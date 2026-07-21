// ============================================================
// ZENTRALE KONFIGURATION – Danke-Seite
// Nur HIER anpassen, sonst nirgends.
// ============================================================

// --- Google-Fotos-Album (geteilter Link) ---
// Album in Google Fotos teilen -> "Link erstellen" -> hier einfügen.
// Gäste können dort alles ansehen, einzelne Bilder oder das
// komplette Album als ZIP herunterladen.
export const GOOGLE_PHOTOS_ALBUM_URL = "https://photos.app.goo.gl/HIER_EINFUEGEN"

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
export const CLOUDINARY_CLOUD_NAME = "DEIN_CLOUD_NAME"
export const CLOUDINARY_UPLOAD_PRESET = "hochzeit_gaeste"

// Max. Dateigröße pro Upload in MB (Cloudinary Free: 10 MB Bilder, 100 MB Videos)
export const MAX_FILE_SIZE_MB = 100
