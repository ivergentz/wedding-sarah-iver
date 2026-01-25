import { useState } from "react"
import styled from "styled-components"

const FooterContainer = styled.footer`
  background-color: #000;
  color: #fff;
  padding: 3rem 2rem 2rem;
`

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
`

const AdminToggle = styled.button`
  background: none;
  border: 2px solid #fff;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s;

  &:hover {
    background: #fff;
    color: #000;
  }
`

const AdminSection = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 2rem;
  border: 2px solid #fff;
`

const AdminTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
`

const LoginBox = styled.div`
  margin-bottom: 1.5rem;
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
  text-align: left;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #fff;
  background-color: #000;
  color: #fff;
  font-weight: 700;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fff;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 900;
  background-color: #fff;
  color: #000;
  border: 2px solid #fff;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: #000;
    color: #fff;
  }
`

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: #fff;
  color: #000;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`

const StatsBox = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border: 2px solid #fff;
`

const StatText = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const DownloadButton = styled(Button)`
  margin-bottom: 0.5rem;
`

const Copyright = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #999;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #333;
`

function Footer({ rsvps, onRefresh }) {
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const API_URL = "https://wedding-project-1.onrender.com/api"

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        setError("")
        onRefresh()
      } else {
        setError("UNGÜLTIGE ANMELDEDATEN")
      }
    } catch (err) {
      setError("VERBINDUNGSFEHLER")
    }
  }

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "wedding2026" }),
      })

      const data = await response.json()

      if (data.success) {
        alert("✅ Alle RSVPs wurden gelöscht!")
        onRefresh() // Liste neu laden
      } else {
        alert("❌ Fehler beim Löschen")
      }
    } catch (err) {
      alert("❌ Verbindungsfehler")
    }
  }

  const downloadCSV = () => {
    if (rsvps.length === 0) {
      alert("Keine RSVPs zum Exportieren")
      return
    }

    const headers = [
      "Name",
      "Email",
      "Attending",
      "Guests",
      "Message",
      "Timestamp",
    ]
    const csvContent = [
      headers.join(","),
      ...rsvps.map((rsvp) =>
        [
          `"${rsvp.name}"`,
          `"${rsvp.email}"`,
          `"${rsvp.attending}"`,
          rsvp.guests,
          `"${rsvp.dietaryRestrictions || ""}"`,
          `"${(rsvp.message || "").replace(/"/g, '""')}"`,
          `"${rsvp.timestamp}"`,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `rsvps_${new Date().toISOString().split("T")[0]}.csv`
    )
    link.click()
  }

  return (
    <FooterContainer>
      <FooterContent>
        <AdminToggle onClick={() => setShowAdmin(!showAdmin)}>
          {showAdmin ? "✕ SCHLIEẞEN" : "🔒"}
        </AdminToggle>

        {showAdmin && (
          <AdminSection>
            {!isAuthenticated ? (
              <>
                <AdminTitle>ADMIN LOGIN</AdminTitle>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <LoginBox>
                  <FormGroup>
                    <Label>BENUTZERNAME</Label>
                    <Input
                      type='text'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete='username'
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>PASSWORT</Label>
                    <Input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete='current-password'
                    />
                  </FormGroup>
                  <Button onClick={handleLogin}>ANMELDEN</Button>
                </LoginBox>
              </>
            ) : (
              <>
                <AdminTitle>RSVP VERWALTUNG</AdminTitle>
                <StatsBox>
                  <StatText>Gesamtzahl RSVPs: {rsvps.length}</StatText>
                  <StatText>
                    Zusagen: {rsvps.filter((r) => r.attending === "yes").length}
                  </StatText>
                  <StatText>
                    Absagen: {rsvps.filter((r) => r.attending === "no").length}
                  </StatText>
                  <StatText>
                    Zugesagte Gäste:{" "}
                    {rsvps
                      .filter((r) => r.attending === "yes")
                      .reduce(
                        (total, rsvp) => total + parseInt(rsvp.guests || 0),
                        0
                      )}
                  </StatText>
                </StatsBox>
                <DownloadButton onClick={downloadCSV}>
                  CSV HERUNTERLADEN
                </DownloadButton>

                {/* NEU: Reset Button */}
                <Button
                  onClick={() => {
                    if (
                      window.confirm(
                        "ACHTUNG: Alle RSVPs werden gelöscht! Bist du sicher?"
                      )
                    ) {
                      handleReset()
                    }
                  }}
                  style={{
                    backgroundColor: "#dc2626",
                    borderColor: "#dc2626",
                    marginTop: "2rem",
                  }}
                >
                  🗑️ ALLE RSVPS LÖSCHEN
                </Button>

                <Button onClick={() => setIsAuthenticated(false)}>
                  ABMELDEN
                </Button>
              </>
            )}
          </AdminSection>
        )}

        <Copyright>© 2026 Sarah & Iver - Alle Rechte vorbehalten</Copyright>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
