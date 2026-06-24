import crypto from 'crypto'

const SECRET = process.env.ADMIN_SECRET || 'parkqueen_admin_secret_2024'
const PASSWORD = process.env.ADMIN_PASSWORD || 'parkqueen@admin'

export function makeToken() {
  return crypto.createHmac('sha256', SECRET).update('admin:authenticated').digest('hex')
}

export function verifyAuth(request) {
  const token = request.cookies.get('admin_token')?.value
  return !!token && token === makeToken()
}

export function verifyPassword(pw) {
  return pw === PASSWORD
}
