// Vercel Serverless Function: /api/download
// Prüft das Passwort und erzeugt eine signierte Cloudinary-URL,
// die ein ZIP der AUSGEWÄHLTEN Bilder generiert.
// Es gibt bewusst KEINEN "alle herunterladen"-Weg für Gäste –
// max. 15 Bilder pro Anfrage (serverseitig erzwungen).
//
// Benötigt dieselben Env-Variablen wie /api/photos.

const { v2: cloudinary } = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const MAX_SELECTION = 15

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = req.body || {}
  const password = body.password || ""

  if (!process.env.PHOTOS_PASSWORD || password !== process.env.PHOTOS_PASSWORD) {
    return res.status(401).json({ error: "Falsches Passwort" })
  }

  const publicIds = Array.isArray(body.publicIds) ? body.publicIds : []

  if (publicIds.length === 0) {
    return res.status(400).json({ error: "Bitte zuerst Bilder auswählen." })
  }

  if (publicIds.length > MAX_SELECTION) {
    return res.status(400).json({
      error: `Bitte maximal ${MAX_SELECTION} Bilder pro Download auswählen.`,
    })
  }

  try {
    const url = cloudinary.utils.download_zip_url({
      public_ids: publicIds,
      resource_type: "image",
      flatten_folders: true,
      target_public_id: "hochzeitsbilder",
    })

    return res.status(200).json({ url })
  } catch (err) {
    console.error("Cloudinary error:", err)
    return res
      .status(500)
      .json({ error: "Download konnte nicht erstellt werden" })
  }
}
