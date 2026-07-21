// Vercel Serverless Function: /api/admin-delete
// NUR FÜR ADMIN: Löscht Gäste-Uploads endgültig aus Cloudinary.
// Wird erst nach expliziter Bestätigung im Admin aufgerufen
// (nachdem der ZIP-Download wirklich angekommen ist).
// Auth über Env-Var ADMIN_PASSWORD.

const { v2: cloudinary } = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Cloudinary erlaubt max. 100 IDs pro delete_resources-Aufruf
const CHUNK_SIZE = 100

async function deleteChunked(ids, resourceType) {
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE)
    await cloudinary.api.delete_resources(chunk, {
      resource_type: resourceType,
    })
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = req.body || {}
  const password = body.password || ""

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Nicht autorisiert" })
  }

  const images = Array.isArray(body.images) ? body.images : []
  const videos = Array.isArray(body.videos) ? body.videos : []

  if (images.length === 0 && videos.length === 0) {
    return res.status(400).json({ error: "Nichts zu löschen" })
  }

  try {
    if (images.length > 0) {
      await deleteChunked(images, "image")
    }
    if (videos.length > 0) {
      await deleteChunked(videos, "video")
    }

    return res
      .status(200)
      .json({ deleted: images.length + videos.length })
  } catch (err) {
    console.error("Cloudinary error:", err)
    return res.status(500).json({ error: "Löschen fehlgeschlagen" })
  }
}
