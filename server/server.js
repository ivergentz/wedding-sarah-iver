const express = require("express")
const cors = require("cors")
const fs = require("fs").promises
const path = require("path")

const app = express()
const PORT = process.env.PORT || 5001
const DATA_FILE = path.join(__dirname, "data", "rsvps.json")

// CORS Middleware - MUSS VOR allen anderen Middlewares kommen!
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://sarahiver.de", // DEINE echte Domain!
      "https://www.sarahiver.de", // Mit www
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

// Body Parser Middleware
app.use(express.json())

// Stelle sicher dass data Ordner existiert
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir)
  }

  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]))
  }
}

// GET alle RSVPs
app.get("/api/rsvps", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    const rsvps = JSON.parse(data)
    console.log("✅ RSVPs geladen:", rsvps.length)
    res.json(rsvps)
  } catch (error) {
    console.error("❌ Fehler beim Lesen:", error)
    res.status(500).json({ error: "Fehler beim Laden der RSVPs" })
  }
})

// POST neues RSVP
app.post("/api/rsvps", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    const rsvps = JSON.parse(data)

    const newRsvp = {
      ...req.body,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }

    rsvps.push(newRsvp)

    await fs.writeFile(DATA_FILE, JSON.stringify(rsvps, null, 2))

    console.log("✅ Neues RSVP gespeichert:", newRsvp.name)
    res.json({ success: true, rsvp: newRsvp })
  } catch (error) {
    console.error("❌ Fehler beim Speichern:", error)
    res.status(500).json({ error: "Fehler beim Speichern des RSVPs" })
  }
})

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body

  console.log("🔐 Login-Versuch:", username)

  // WICHTIG: Ändere diese Credentials vor dem Deployment!
  if (username === "admin" && password === "wedding2026") {
    console.log("✅ Login erfolgreich")
    res.json({ success: true, token: "authenticated" })
  } else {
    console.log("❌ Login fehlgeschlagen")
    res.status(401).json({ success: false, message: "Ungültige Anmeldedaten" })
  }
})

// Server starten
const startServer = async () => {
  await ensureDataDir()
  app.listen(PORT, () => {
    console.log("")
    console.log("=================================")
    console.log("✅ Server läuft auf http://localhost:" + PORT)
    console.log("📁 Daten: " + DATA_FILE)
    console.log("=================================")
    console.log("")
  })
}

startServer()
