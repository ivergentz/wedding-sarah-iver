import { useEffect, useState } from "react"
import DetailsSection from "./components/DetailsSection"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import Gallery from "./components/Gallery"
import HeroSection from "./components/HeroSection"
import Navigation from "./components/Navigation"
import RSVPForm from "./components/RSVPForm"
import GlobalStyles from "./styles/GlobalStyles"

const API_URL = "https://wedding-project-1.onrender.com/api"

function App() {
  const [rsvps, setRsvps] = useState([])
  const [message, setMessage] = useState(null)

  // Lade RSVPs vom Server beim Start
  const loadRsvps = async () => {
    try {
      const response = await fetch(`${API_URL}/rsvps`, {
        headers: {
          Authorization: "Bearer admin_secret_2026",
        },
      })
      const data = await response.json()
      setRsvps(data)
    } catch (error) {
      console.error("Fehler beim Laden der RSVPs:", error)
    }
  }

  useEffect(() => {
    loadRsvps()
  }, [])

  // RSVP Formular Submit Handler
  const handleRSVPSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/rsvps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadRsvps()
        setMessage({
          type: "success",
          text: "VIELEN DANK FÜR DEINE RÜCKMELDUNG! WIR FREUEN UNS, MIT DIR ZU FEIERN.",
        })
        setTimeout(() => setMessage(null), 5001)
      } else {
        throw new Error("Fehler beim Speichern")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "FEHLER BEIM SPEICHERN. BITTE VERSUCHE ES ERNEUT.",
      })
      setTimeout(() => setMessage(null), 5001)
    }
  }

  return (
    <>
      <GlobalStyles />
      <Navigation />
      <HeroSection />
      <DetailsSection />
      <Gallery />
      <FAQ />
      <RSVPForm onSubmit={handleRSVPSubmit} message={message} />
      <Footer rsvps={rsvps} onRefresh={loadRsvps} />{" "}
    </>
  )
}

export default App
