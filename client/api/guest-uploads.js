// Vercel Serverless Function: /api/guest-uploads
// NUR FÜR ADMIN: Listet alle Gäste-Uploads (Fotos + Videos).
// Auth über Env-Var ADMIN_PASSWORD (serverseitig geprüft).
//
// Gäste-Uploads werden beim Hochladen mit dem Tag "gaeste-upload"
// versehen (siehe UploadSection.js). Env-Var CLOUDINARY_GUEST_TAG
// kann den Tag optional überschreiben.

const { v2: cloudinary } = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const MAX_ITEMS = 2000

async function listByTag(tag, resourceType) {
  const resources = []
  let cursor

  do {
    const result = await cloudinary.api.resources_by_tag(tag, {
      resource_type: resourceType,
      max_results: 500,
      next_cursor: cursor,
      context: true,
    })
    resources.push(...result.resources)
    cursor = result.next_cursor
  } while (cursor && resources.length < MAX_ITEMS)

  return resources
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const password = (req.body && req.body.password) || ""

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Nicht autorisiert" })
  }

  const tag = process.env.CLOUDINARY_GUEST_TAG || "gaeste-upload"

  try {
    const [images, videos] = await Promise.all([
      listByTag(tag, "image"),
      listByTag(tag, "video"),
    ])

    const mapItem = (r, type) => ({
      id: r.public_id,
      type,
      bytes: r.bytes,
      createdAt: r.created_at,
      // Name des Gasts, falls beim Upload angegeben
      uploader:
        (r.context && r.context.custom && r.context.custom.caption) || null,
      thumb:
        type === "image"
          ? cloudinary.url(r.public_id, {
              transformation: [
                { width: 300, height: 300, crop: "fill", gravity: "auto" },
                { quality: "auto" },
                { fetch_format: "auto" },
              ],
            })
          : cloudinary.url(r.public_id + ".jpg", {
              resource_type: "video",
              transformation: [
                { width: 300, height: 300, crop: "fill" },
                { quality: "auto" },
              ],
            }),
    })

    const items = [
      ...images.map((r) => mapItem(r, "image")),
      ...videos.map((r) => mapItem(r, "video")),
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    return res.status(200).json({
      items,
      imageCount: images.length,
      videoCount: videos.length,
      totalBytes: items.reduce((sum, i) => sum + (i.bytes || 0), 0),
    })
  } catch (err) {
    console.error("Cloudinary error:", err)
    return res
      .status(500)
      .json({ error: "Uploads konnten nicht geladen werden" })
  }
}
