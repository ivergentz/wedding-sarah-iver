// Vercel Serverless Function: /api/photos
// Prüft das Passwort (Env-Var PHOTOS_PASSWORD) und liefert die Liste
// aller Hochzeitsfotos aus Cloudinary (per Tag, Env-Var CLOUDINARY_PHOTOS_TAG).
//
// SORTIERUNG: Nach echtem Aufnahmezeitpunkt aus den EXIF-Daten der
// Kamera (Datum -> Stunde -> Minute -> Sekunde). Fotos ohne EXIF-Zeit
// landen ans Ende. Bei gleicher Zeit (Serienbilder) entscheidet der
// Dateiname (natürliche Sortierung), danach der Upload-Zeitpunkt.
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

// EXIF-Zeit ("2026:07:04 15:42:03") -> Timestamp; null wenn nicht vorhanden
function captureTime(r) {
  const m = r.image_metadata || {}
  const raw = m.DateTimeOriginal || m.CreateDate || m.DateTime
  if (!raw || typeof raw !== "string") return null

  const iso = raw
    .trim()
    .replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")
    .replace(" ", "T")

  const t = Date.parse(iso)
  return Number.isNaN(t) ? null : t
}

// Dateiname ohne Ordnerpfad (für die Fallback-Sortierung)
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
    // Search-API statt Admin-Listing, weil nur sie die
    // EXIF-Metadaten (Aufnahmezeitpunkt) mitliefern kann
    const resources = []
    let cursor

    do {
      let query = cloudinary.search
        .expression(`tags:${tag} AND resource_type:image`)
        .with_field("image_metadata")
        .with_field("tags")
        .max_results(500)

      if (cursor) {
        query = query.next_cursor(cursor)
      }

      const result = await query.execute()
      resources.push(...(result.resources || []))
      cursor = result.next_cursor
    } while (cursor && resources.length < MAX_PHOTOS)

    // Sortierung: Aufnahmezeit -> Dateiname (natürlich) -> Upload-Zeit
    resources.sort((a, b) => {
      const ta = captureTime(a)
      const tb = captureTime(b)

      if (ta !== null && tb !== null && ta !== tb) return ta - tb
      if (ta !== null && tb === null) return -1 // ohne EXIF ans Ende
      if (ta === null && tb !== null) return 1

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
      standesamt:
        Array.isArray(r.tags) && r.tags.includes(STANDESAMT_TAG),
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
