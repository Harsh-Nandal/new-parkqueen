import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(file, folder = 'parkqueen') {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const dataUri = `data:${file.type};base64,${base64}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'auto',
  })

  return { url: result.secure_url, public_id: result.public_id }
}

export async function deleteFromCloudinary(public_id) {
  if (!public_id) return
  try {
    await cloudinary.uploader.destroy(public_id)
  } catch {
    // ignore deletion errors — asset may already be deleted
  }
}

export async function replaceCloudinaryImage(file, oldPublicId, folder = 'parkqueen') {
  const uploaded = await uploadToCloudinary(file, folder)
  if (oldPublicId) await deleteFromCloudinary(oldPublicId)
  return uploaded
}

export { cloudinary }
