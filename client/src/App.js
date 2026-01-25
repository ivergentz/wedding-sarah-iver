import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DetailsSection from "./components/DetailsSection"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import Gallery from "./components/Gallery"
import HeroSection from "./components/HeroSection"
import Navigation from "./components/Navigation"
import RSVPForm from "./components/RSVPForm"
import AdminDashboard from "./components/AdminDashboard"
import GlobalStyles from "./styles/GlobalStyles"
import { addRSVP } from "./config/supabase"

function MainPage() {
  const [message, setMessage] = useState(null)

  // RSVP Formular Submit Handler
  const handleRSVPSubmit = async (formData) => {
    const result = await addRSVP(formData)

    if (result.success) {
      setMessage({
        type: "success",
        text: "VIELEN DANK FÜR DEINE RÜCKMELDUNG! WIR FREUEN UNS, MIT DIR ZU FEIERN.",
      })
      setTimeout(() => setMessage(null), 5000)
    } else {
      setMessage({
        type: "error",
        text: "FEHLER BEIM SPEICHERN. BITTE VERSUCHE ES ERNEUT.",
      })
      setTimeout(() => setMessage(null), 5000)
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
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
