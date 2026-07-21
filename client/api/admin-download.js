// Vercel Serverless Function: /api/admin-download
// NUR FÜR ADMIN: Erzeugt eine signierte ZIP-URL für ALLE
// Gäste-Uploads eines Typs ("image" oder "video").
// Auth über Env-Var ADMIN_PASSWORD.

const { v2: cloudinary } = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = req.body || {}
  const password = body.password || ""

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Nicht autorisiert" })
  }

  const resourceType = body.resourceType === "video" ? "video" : "image"
  const tag = process.env.CLOUDINARY_GUEST_TAG || "gaeste-upload"

  try {
    const url = cloudinary.utils.download_zip_url({
      tags: tag,
      resource_type: resourceType,
      flatten_folders: true,
      target_public_id:
        resourceType === "video" ? "gaeste-videos" : "gaeste-fotos",
    })

    return res.status(200).json({ url })
  } catch (err) {
    console.error("Cloudinary error:", err)
    return res
      .status(500)
      .json({ error: "Download konnte nicht erstellt werden" })
  }
}
