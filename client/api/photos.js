// Vercel Serverless Function: /api/photos
// Prüft das Passwort (Env-Var PHOTOS_PASSWORD) und liefert die Liste
// aller Hochzeitsfotos aus Cloudinary (per Tag, Env-Var CLOUDINARY_PHOTOS_TAG).
//
// SORTIERUNG:
//   1. Nach Tag: Standesamt (Tag "standesamt") zuerst, dann Feier
//   2. Innerhalb des Tages: fortlaufend nach Dateiname
//      (natürliche Sortierung: 2 vor 10 vor 100; der Zufalls-Suffix
//      von Cloudinary wie "1_ofhqzm" stört dabei nicht)
//   3. Bei gleichem Namen entscheidet der Upload-Zeitpunkt
//
// Tag-Logik für den Tages-Filter:
//   Tag "standesamt" vorhanden -> Standesamt (Freitag)
//   Tag "standesamt" fehlt     -> Feier (Samstag)
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
const STANDESAMT_TAG = "standesamt"

// Dateiname ohne Ordnerpfad
function nameOf(r) {
  return (r.public_id || "").split("/").pop()
}

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
        tags: true, // Tag-Liste pro Bild mitliefern (für Filter + Sortierung)
      })
      resources.push(...result.resources)
      cursor = result.next_cursor
    } while (cursor && resources.length < MAX_PHOTOS)

    const isStandesamt = (r) =>
      Array.isArray(r.tags) && r.tags.includes(STANDESAMT_TAG)

    // 1. Tag (Standesamt zuerst) -> 2. Dateiname -> 3. Upload-Zeit
    resources.sort((a, b) => {
      const dayA = isStandesamt(a) ? 0 : 1
      const dayB = isStandesamt(b) ? 0 : 1
      if (dayA !== dayB) return dayA - dayB

      const cmp = nameOf(a).localeCompare(nameOf(b), "de", {
        numeric: true,
        sensitivity: "base",
      })
      if (cmp !== 0) return cmp

      return new Date(a.created_at) - new Date(b.created_at)
    })

    const photos = resources.map((r) => ({
      id: r.public_id,
      // true = Standesamt (Freitag), false = Feier (Samstag)
      standesamt: isStandesamt(r),
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
