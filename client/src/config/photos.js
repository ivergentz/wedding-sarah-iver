// ============================================================
// ZENTRALE KONFIGURATION – Danke-Seite
// Nur HIER anpassen, sonst nirgends.
//
// WICHTIG: Das Download-Passwort steht NICHT hier und NICHT im
// Frontend. Es liegt als Env-Variable PHOTOS_PASSWORD auf Vercel
// und wird serverseitig in /api/photos und /api/download geprüft.
// ============================================================

// --- Hero-Bild (Cloudinary-URL) ---
// Leer lassen = lokales Fallback (/assets/gallery/foto1.jpg).
// Sobald du das Bild ausgesucht hast, volle Cloudinary-URL einsetzen, z. B.:
// "https://res.cloudinary.com/DEIN_CLOUD_NAME/image/upload/f_auto,q_auto,w_2000/hochzeit/hero.jpg"
export const HERO_IMAGE_URL = ""

// --- Cloudinary Gäste-Upload ---
// 1) Cloud Name: Cloudinary Dashboard oben links
// 2) Upload Preset: Settings -> Upload -> Add upload preset
//    -> Signing Mode: "Unsigned"
//    -> Asset folder z. B. "hochzeit/gaeste-uploads"
// Der Cloud Name ist öffentlich (steht in jeder Bild-URL) – das ist ok.
export const CLOUDINARY_CLOUD_NAME = "DEIN_CLOUD_NAME"
export const CLOUDINARY_UPLOAD_PRESET = "hochzeit_gaeste"

// Max. Dateigröße pro Upload in MB (Cloudinary Free: 10 MB Bilder, 100 MB Videos)
export const MAX_FILE_SIZE_MB = 100
