import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const HOTEL_NAME = process.env.HOTEL_NAME || 'The ParkQueen Hotel'
const HOTEL_EMAIL = process.env.HOTEL_EMAIL || 'fom@parkqueenhotels.com'
const HOTEL_PHONE = process.env.HOTEL_PHONE || '+91 9088809991'
const HOTEL_ADDRESS =
  process.env.HOTEL_ADDRESS ||
  'Opposite Devi Lal Park, Rohtak, Haryana 124001'

// ─── CA certificates ──────────────────────────────────────────────────────────
// Some environments (antivirus, proxies, corporate firewalls) perform SSL
// inspection and replace server certificates with their own CA-signed ones.
// NODE_EXTRA_CA_CERTS is the standard Node.js mechanism to add trusted CAs
// without disabling certificate validation.
//
// Detected environment: Avast Web/Mail Shield intercepts SMTP connections
// and presents certificates signed by "Avast Web/Mail Shield Root".
// We trust the exported Avast CA so Node.js can verify the intercepted cert.
function loadExtraCAs() {
  const caPaths = []

  // 1. Honour NODE_EXTRA_CA_CERTS env var (standard Node.js mechanism)
  if (process.env.NODE_EXTRA_CA_CERTS) {
    caPaths.push(process.env.NODE_EXTRA_CA_CERTS)
  }

  // 2. Load project-local avast-ca.pem if it exists
  //    (auto-exported from Windows cert store during setup)
  const localCA = path.join(process.cwd(), 'avast-ca.pem')
  if (fs.existsSync(localCA)) {
    caPaths.push(localCA)
  }

  if (caPaths.length === 0) return []

  return caPaths.flatMap(p => {
    try {
      const content = fs.readFileSync(p, 'utf8')
      console.log('[Email] Loaded extra CA from:', p)
      return [content]
    } catch (e) {
      console.warn('[Email] Could not load CA file:', p, e.message)
      return []
    }
  })
}

// ─── Transporter factory ──────────────────────────────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST
  if (!host) return null

  const port = parseInt(process.env.SMTP_PORT || '587')
  const secure = process.env.SMTP_SECURE === 'true'
  const user = process.env.SMTP_USER
  const passPresent = !!process.env.SMTP_PASS

  console.log('[Email] Transporter config:')
  console.log('  host:', host)
  console.log('  port:', port)
  console.log('  secure:', secure)
  console.log('  user present:', !!user)
  console.log('  pass present:', passPresent)

  const extraCAs = loadExtraCAs()
  const tlsOptions = extraCAs.length > 0
    ? { ca: extraCAs }
    : undefined

  if (extraCAs.length > 0) {
    console.log('[Email] Using extra CA certificates for TLS verification')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: process.env.SMTP_PASS },
    ...(tlsOptions ? { tls: tlsOptions } : {}),
  })
}

// ─── Verified send ────────────────────────────────────────────────────────────
let _transporterVerified = false
let _transporter = null

async function getVerifiedTransporter() {
  if (!process.env.SMTP_HOST) return null

  // Re-create if not yet verified
  if (!_transporter || !_transporterVerified) {
    _transporter = createTransporter()
    try {
      await _transporter.verify()
      _transporterVerified = true
      console.log('[Email] SMTP connection verified successfully')
    } catch (err) {
      _transporterVerified = false
      _transporter = null
      console.error('[Email] SMTP verify failed:', err.message)
      console.error('[Email] Error code:', err.code)
      console.error('[Email] Stack:', err.stack?.split('\n').slice(0, 4).join('\n'))
      return null
    }
  }
  return _transporter
}

async function send(options) {
  const transporter = await getVerifiedTransporter()

  if (!transporter) {
    console.log('[Email] No verified SMTP transporter — skipping send.')
    if (!process.env.SMTP_HOST) {
      console.log('[Email] Set SMTP_HOST in .env.local to enable emails.')
    }
    return { skipped: true }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${HOTEL_NAME}" <${process.env.SMTP_FROM || HOTEL_EMAIL}>`,
      ...options,
    })
    console.log('[Email] Sent successfully. MessageId:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (err) {
    console.error('[Email] Send failed:', err.message)
    console.error('[Email] Error code:', err.code)
    // Reset so next call re-verifies
    _transporter = null
    _transporterVerified = false
    return { success: false, error: err.message }
  }
}

// ─── Email Templates ───────────────────────────────────────────────────────

function baseHtml(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
          <tr>
            <td style="background:#1a1c2e;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#cda434;font-size:22px;letter-spacing:1px;">${HOTEL_NAME}</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,.6);font-size:12px;">Rohtak, Haryana — India</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;">
                📍 ${HOTEL_ADDRESS}<br/>
                📞 ${HOTEL_PHONE} &nbsp;|&nbsp; ✉️ ${HOTEL_EMAIL}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function row(label, value) {
  return `
  <tr>
    <td style="padding:8px 12px;background:#f9fafb;font-weight:600;color:#374151;font-size:13px;border-bottom:1px solid #e5e7eb;width:35%;">${label}</td>
    <td style="padding:8px 12px;color:#111827;font-size:13px;border-bottom:1px solid #e5e7eb;">${value || '—'}</td>
  </tr>`
}

// ─── Contact Emails ────────────────────────────────────────────────────────

export async function sendContactNotification({ name, email, message, createdAt }) {
  return send({
    to: HOTEL_EMAIL,
    subject: `📩 New Contact Message from ${name}`,
    html: baseHtml(
      'New Contact Message',
      `<h2 style="margin:0 0 20px;color:#111827;font-size:18px;">New Contact Form Submission</h2>
       <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:20px;">
         ${row('Name', name)}
         ${row('Email', `<a href="mailto:${email}" style="color:#cda434;">${email}</a>`)}
         ${row('Received', new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}
       </table>
       <div style="background:#f9fafb;border-left:4px solid #cda434;padding:16px;border-radius:4px;">
         <p style="margin:0 0 6px;font-weight:600;font-size:13px;color:#374151;">Message:</p>
         <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
       </div>
       <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
         Reply directly to <a href="mailto:${email}" style="color:#cda434;">${email}</a> to respond.
       </p>`
    ),
    replyTo: email,
  })
}

export async function sendContactConfirmation({ name, email, message }) {
  return send({
    to: email,
    subject: `Thank you for contacting ${HOTEL_NAME}`,
    html: baseHtml(
      'Message Received',
      `<h2 style="margin:0 0 8px;color:#111827;font-size:18px;">Dear ${name},</h2>
       <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
         Thank you for reaching out to <strong>${HOTEL_NAME}</strong>. We have received your message and our team will get back to you within <strong>24 hours</strong>.
       </p>
       <div style="background:#f9fafb;border-left:4px solid #cda434;padding:16px;border-radius:4px;margin-bottom:20px;">
         <p style="margin:0 0 6px;font-weight:600;font-size:13px;color:#374151;">Your message:</p>
         <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
       </div>
       <p style="margin:0;color:#374151;font-size:14px;">
         For urgent enquiries, please call us at <strong>${HOTEL_PHONE}</strong>.
       </p>
       <p style="margin:20px 0 0;color:#374151;font-size:14px;">
         Warm regards,<br/>
         <strong>The ParkQueen Hotel Team</strong>
       </p>`
    ),
  })
}

// ─── Booking Emails ────────────────────────────────────────────────────────

export async function sendBookingNotification(booking) {
  const { bookingRef, name, email, phone, roomType, guests, checkIn, checkOut, message, createdAt } = booking
  return send({
    to: HOTEL_EMAIL,
    subject: `🏨 New Booking Request [${bookingRef}] — ${name}`,
    html: baseHtml(
      'New Booking Request',
      `<h2 style="margin:0 0 6px;color:#111827;font-size:18px;">New Booking Request</h2>
       <p style="margin:0 0 20px;color:#9ca3af;font-size:13px;">Ref: <strong style="color:#cda434;">${bookingRef}</strong></p>
       <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:20px;">
         ${row('Booking Ref', `<strong style="color:#cda434;">${bookingRef}</strong>`)}
         ${row('Guest Name', name)}
         ${row('Email', `<a href="mailto:${email}" style="color:#cda434;">${email}</a>`)}
         ${row('Phone', phone)}
         ${row('Room Type', roomType)}
         ${row('Guests', guests)}
         ${row('Check In', checkIn)}
         ${row('Check Out', checkOut)}
         ${row('Submitted', new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}
       </table>
       ${message ? `<div style="background:#f9fafb;border-left:4px solid #cda434;padding:16px;border-radius:4px;">
         <p style="margin:0 0 6px;font-weight:600;font-size:13px;color:#374151;">Special Requests:</p>
         <p style="margin:0;color:#111827;font-size:13px;">${message.replace(/\n/g, '<br/>')}</p>
       </div>` : ''}`
    ),
    replyTo: email,
  })
}

export async function sendBookingConfirmation(booking) {
  const { bookingRef, name, email, roomType, guests, checkIn, checkOut } = booking
  return send({
    to: email,
    subject: `Booking Request Received — ${HOTEL_NAME} [${bookingRef}]`,
    html: baseHtml(
      'Booking Received',
      `<h2 style="margin:0 0 8px;color:#111827;font-size:18px;">Dear ${name},</h2>
       <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
         We have received your booking request. Our reservations team will confirm within <strong>12 hours</strong>.
       </p>
       <div style="background:#1a1c2e;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center;">
         <p style="margin:0 0 4px;color:rgba(255,255,255,.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;">Your Booking Reference</p>
         <h3 style="margin:0;color:#cda434;font-size:28px;letter-spacing:3px;">${bookingRef}</h3>
         <p style="margin:6px 0 0;color:rgba(255,255,255,.4);font-size:11px;">Quote this reference in all communications</p>
       </div>
       <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:20px;">
         ${row('Room Type', roomType)}
         ${row('Guests', guests)}
         ${row('Check In', checkIn)}
         ${row('Check Out', checkOut)}
       </table>
       <p style="margin:0;color:#374151;font-size:14px;">
         📞 <strong>${HOTEL_PHONE}</strong><br/>
         ✉️ <a href="mailto:${HOTEL_EMAIL}" style="color:#cda434;">${HOTEL_EMAIL}</a>
       </p>
       <p style="margin:24px 0 0;color:#374151;font-size:14px;">
         Warm regards,<br/>
         <strong>The ParkQueen Hotel Reservations Team</strong>
       </p>`
    ),
  })
}
