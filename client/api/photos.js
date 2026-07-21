// Vercel Serverless Function: /api/photos
// Prüft das Passwort (Env-Var PHOTOS_PASSWORD) und liefert die Liste
// aller Hochzeitsfotos aus Cloudinary (per Tag, Env-Var CLOUDINARY_PHOTOS_TAG).
//
// Bildgrößen:
//   thumb    -> 300x300 (Galerie-Grid, klein & schnell)
//   full     -> max. 1600px (Lightbox)
//   download -> ORIGINAL in voller Qualität
//
// Benötigte Env-Variablen auf Vercel:
//   PHOTOS_PASSWORD          -> das Download-Passwort
//   CLOUDINARY_CLOUD_NAME    -> Cloud Name
//   CLOUDINARY_API_KEY       -> API Key (Dashboard -> Settings -> API Keys)
//   CLOUDINARY_API_SECRET    -> API Secret
//   CLOUDINARY_PHOTOS_TAG    -> optional, Standard: "hochzeitsfotos"

const { v2: cloudinary } = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const MAX_PHOTOS = 3000

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const password = (req.body && req.body.password) || ""

  if (!process.env.PHOTOS_PASSWORD || password !== process.env.PHOTOS_PASSWORD) {
    return res.status(401).json({ error: "Falsches Passwort" })
  }

  const tag = process.env.CLOUDINARY_PHOTOS_TAG || "hochzeitsfotos"

  try {
    const resources = []
    let cursor

    do {
      const result = await cloudinary.api.resources_by_tag(tag, {
        resource_type: "image",
        max_results: 500,
        next_cursor: cursor,
      })
      resources.push(...result.resources)
      cursor = result.next_cursor
    } while (cursor && resources.length < MAX_PHOTOS)

    // Chronologisch sortieren (älteste zuerst)
    resources.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )

    const photos = resources.map((r) => ({
      id: r.public_id,
      // Kleines Thumbnail fürs Grid – schnell zu laden
      thumb: cloudinary.url(r.public_id, {
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "auto" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      }),
      // Lightbox-Ansicht – komprimiert, max. 1600px
      full: cloudinary.url(r.public_id, {
        transformation: [
          { width: 1600, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      }),
      // Original als Download in voller Qualität
      download: cloudinary.url(r.public_id, { flags: "attachment" }),
    }))

    return res.status(200).json({ photos })
  } catch (err) {
    console.error("Cloudinary error:", err)
    return res
      .status(500)
      .json({ error: "Bilder konnten nicht geladen werden" })
  }
}
