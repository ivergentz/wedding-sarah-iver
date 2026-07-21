// ============================================================
// ZENTRALE KONFIGURATION – Danke-Seite
// Nur HIER anpassen, sonst nirgends.
//
// WICHTIG: Das Download-Passwort steht NICHT hier und NICHT im
// Frontend. Es liegt als Env-Variable PHOTOS_PASSWORD auf Vercel
// und wird serverseitig in /api/photos und /api/download geprüft.
// ============================================================

// --- Hero-Bild (Cloudinary-URL) ---
// Leer lassen = lokales Bild (/assets/gallery/hero.jpg).
export const HERO_IMAGE_URL = ""

// --- Cloudinary Gäste-Upload ---
// Preset: Settings -> Upload -> Upload presets -> "hochzeit_gaeste"
//   -> Signing Mode: "Unsigned"
//   -> Asset folder: "hochzeit/gaeste-uploads"
// Der Cloud Name ist öffentlich (steht in jeder Bild-URL) – das ist ok.
export const CLOUDINARY_CLOUD_NAME = "si-weddings"
export const CLOUDINARY_UPLOAD_PRESET = "hochzeit_gaeste"

// Max. Dateigröße pro Upload in MB (Cloudinary Free: 10 MB Bilder, 100 MB Videos)
export const MAX_FILE_SIZE_MB = 100
