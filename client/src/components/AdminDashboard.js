import { useState, useCallback } from "react"
import styled from "styled-components"
import GlobalStyles from "../styles/GlobalStyles"

// ============================================================
// ADMIN: Gäste-Bilder & -Videos
// Der frühere RSVP-Bereich wird nach der Hochzeit nicht mehr
// gebraucht und wurde entfernt. Die RSVPs liegen weiterhin
// unangetastet in Supabase.
// ============================================================

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  padding: 2rem;
`

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
`

const BackLink = styled.a`
  color: #fff;
  text-decoration: none;
  border: 2px solid #fff;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s;

  &:hover {
    background: #fff;
    color: #000;
  }
`

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 4px solid #fff;
`

const LoginTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
  text-align: center;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #fff;
  background-color: #000;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fff;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 900;
  background-color: #fff;
  color: #000;
  border: 2px solid #fff;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #000;
    color: #fff;
  }
`

const ErrorMessage = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 1rem;
  background-color: #dc2626;
  color: #fff;
  font-weight: 700;
  text-align: center;
`

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const StatBox = styled.div`
  border: 2px solid #fff;
  padding: 1.5rem;
  text-align: center;
`

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const ActionBar = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  background-color: ${props => props.$primary ? '#fff' : '#000'};
  color: ${props => props.$primary ? '#000' : '#fff'};
  border: 2px solid #fff;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: ${props => props.$primary ? '#000' : '#fff'};
    color: ${props => props.$primary ? '#fff' : '#000'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const DangerButton = styled(ActionButton)`
  border-color: #dc2626;
  background-color: #dc2626;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #000;
    color: #dc2626;
  }
`

const HintBox = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  border: 2px solid #f59e0b;
  color: #f59e0b;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.6;
`

const EmptyState = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 2rem;
  border: 2px dashed #333;
  color: #666;
`

const UploadGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
`

const UploadCard = styled.div`
  border: 2px solid #333;
  position: relative;
`

const UploadThumb = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
`

const UploadMeta = styled.div`
  padding: 0.5rem;
  font-size: 0.7rem;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TypeBadge = styled.span`
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  background: #fff;
  color: #000;
  font-size: 0.65rem;
  font-weight: 900;
  padding: 0.15rem 0.4rem;
  z-index: 1;
`

function formatBytes(bytes) {
  if (!bytes) return "0 MB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [adminPassword, setAdminPassword] = useState("") // für Server-APIs
  const [error, setError] = useState("")

  // Gäste-Bilder State
  const [uploads, setUploads] = useState([])
  const [uploadStats, setUploadStats] = useState(null)
  const [uploadsLoading, setUploadsLoading] = useState(false)
  const [uploadsError, setUploadsError] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null) // Items des letzten Downloads
  const [deleting, setDeleting] = useState(false)

  // Gäste-Uploads laden
  const loadUploads = useCallback(async (pw) => {
    setUploadsLoading(true)
    setUploadsError(null)

    try {
      const res = await fetch("/api/guest-uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadsError(
          res.status === 401
            ? "SERVER-LOGIN FEHLGESCHLAGEN – STIMMT DIE ENV-VARIABLE ADMIN_PASSWORD AUF VERCEL?"
            : (data.error || "FEHLER BEIM LADEN").toUpperCase()
        )
        return
      }

      setUploads(data.items || [])
      setUploadStats({
        imageCount: data.imageCount || 0,
        videoCount: data.videoCount || 0,
        totalBytes: data.totalBytes || 0,
      })
    } catch (err) {
      setUploadsError("GÄSTE-UPLOADS KONNTEN NICHT GELADEN WERDEN")
    } finally {
      setUploadsLoading(false)
    }
  }, [])

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault()
    const adminUser = process.env.REACT_APP_ADMIN_USER || ''
    const adminPass = process.env.REACT_APP_ADMIN_PASS || ''

    if (username === adminUser && password === adminPass) {
      setAdminPassword(password)
      setIsAuthenticated(true)
      setError("")
      loadUploads(password)
    } else {
      setError("UNGÜLTIGE ANMELDEDATEN")
    }
  }

  // Gäste-Uploads als ZIP herunterladen (Fotos ODER Videos)
  const downloadUploads = async (resourceType) => {
    setUploadsError(null)

    try {
      const res = await fetch("/api/admin-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, resourceType }),
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadsError((data.error || "DOWNLOAD FEHLGESCHLAGEN").toUpperCase())
        return
      }

      window.open(data.url, "_blank")

      // Diese Items zum Löschen vormerken – gelöscht wird erst
      // nach expliziter Bestätigung, dass das ZIP angekommen ist
      const batch = uploads.filter((u) => u.type === resourceType)
      setPendingDelete({ resourceType, items: batch })
    } catch (err) {
      setUploadsError("DOWNLOAD FEHLGESCHLAGEN")
    }
  }

  // Nach bestätigtem Download: endgültig aus Cloudinary löschen
  const confirmDelete = async () => {
    if (!pendingDelete || pendingDelete.items.length === 0) return

    const ok = window.confirm(
      `${pendingDelete.items.length} Datei(en) endgültig aus Cloudinary löschen?\n\n` +
        `Nur bestätigen, wenn das ZIP wirklich vollständig heruntergeladen ist – das lässt sich nicht rückgängig machen!`
    )
    if (!ok) return

    setDeleting(true)
    setUploadsError(null)

    try {
      const images = pendingDelete.items
        .filter((i) => i.type === "image")
        .map((i) => i.id)
      const videos = pendingDelete.items
        .filter((i) => i.type === "video")
        .map((i) => i.id)

      const res = await fetch("/api/admin-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, images, videos }),
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadsError((data.error || "LÖSCHEN FEHLGESCHLAGEN").toUpperCase())
        return
      }

      setPendingDelete(null)
      await loadUploads(adminPassword)
    } catch (err) {
      setUploadsError("LÖSCHEN FEHLGESCHLAGEN")
    } finally {
      setDeleting(false)
    }
  }

  const imageUploads = uploads.filter((u) => u.type === "image")
  const videoUploads = uploads.filter((u) => u.type === "video")

  return (
    <>
      <GlobalStyles />
      <AdminContainer>
        {!isAuthenticated ? (
          <LoginContainer>
            <LoginTitle>ADMIN LOGIN</LoginTitle>
            {error && <ErrorMessage style={{ margin: "0 0 1rem" }}>{error}</ErrorMessage>}
            <form onSubmit={handleLogin}>
              <FormGroup>
                <Label>BENUTZERNAME</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </FormGroup>
              <FormGroup>
                <Label>PASSWORT</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </FormGroup>
              <Button type="submit">ANMELDEN</Button>
            </form>
          </LoginContainer>
        ) : (
          <>
            <Header>
              <Title>GÄSTE-BILDER & -VIDEOS</Title>
              <BackLink href="/">← ZUR WEBSITE</BackLink>
            </Header>

            {uploadStats && (
              <StatsGrid>
                <StatBox>
                  <StatNumber>{uploadStats.imageCount}</StatNumber>
                  <StatLabel>Fotos</StatLabel>
                </StatBox>
                <StatBox>
                  <StatNumber>{uploadStats.videoCount}</StatNumber>
                  <StatLabel>Videos</StatLabel>
                </StatBox>
                <StatBox>
                  <StatNumber>{formatBytes(uploadStats.totalBytes)}</StatNumber>
                  <StatLabel>Speicher belegt</StatLabel>
                </StatBox>
              </StatsGrid>
            )}

            <ActionBar>
              <ActionButton
                $primary
                onClick={() => downloadUploads("image")}
                disabled={uploadsLoading || imageUploads.length === 0}
              >
                📥 FOTOS ALS ZIP ({imageUploads.length})
              </ActionButton>
              <ActionButton
                $primary
                onClick={() => downloadUploads("video")}
                disabled={uploadsLoading || videoUploads.length === 0}
              >
                📥 VIDEOS ALS ZIP ({videoUploads.length})
              </ActionButton>
              <ActionButton onClick={() => loadUploads(adminPassword)}>
                🔄 AKTUALISIEREN
              </ActionButton>
              {pendingDelete && pendingDelete.items.length > 0 && (
                <DangerButton onClick={confirmDelete} disabled={deleting}>
                  {deleting
                    ? "LÖSCHE..."
                    : `🗑 DOWNLOAD OK – JETZT LÖSCHEN (${pendingDelete.items.length})`}
                </DangerButton>
              )}
              <ActionButton onClick={() => setIsAuthenticated(false)}>
                🚪 ABMELDEN
              </ActionButton>
            </ActionBar>

            {pendingDelete && (
              <HintBox>
                WICHTIG: Erst prüfen, ob das ZIP vollständig heruntergeladen und
                gesichert ist – dann auf "JETZT LÖSCHEN" klicken. Das Löschen
                entfernt die Dateien endgültig aus Cloudinary.
              </HintBox>
            )}

            {uploadsError && <ErrorMessage>{uploadsError}</ErrorMessage>}

            {uploadsLoading ? (
              <EmptyState>Lade Gäste-Uploads...</EmptyState>
            ) : uploads.length === 0 ? (
              <EmptyState>Noch keine Gäste-Uploads vorhanden</EmptyState>
            ) : (
              <UploadGrid>
                {uploads.map((item) => (
                  <UploadCard key={`${item.type}-${item.id}`}>
                    <TypeBadge>
                      {item.type === "video" ? "VIDEO" : "FOTO"}
                    </TypeBadge>
                    <UploadThumb src={item.thumb} alt={item.id} loading='lazy' />
                    <UploadMeta>
                      {item.uploader || "Ohne Name"} ·{" "}
                      {formatBytes(item.bytes)}
                    </UploadMeta>
                  </UploadCard>
                ))}
              </UploadGrid>
            )}
          </>
        )}
      </AdminContainer>
    </>
  )
}

export default AdminDashboard
