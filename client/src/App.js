import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation"
import HeroSection from "./components/HeroSection"
import DankeSection from "./components/DankeSection"
import BilderSection from "./components/BilderSection"
import UploadSection from "./components/UploadSection"
import Footer from "./components/Footer"
import AdminDashboard from "./components/AdminDashboard"
import EssenFassen from "./components/EssenFassen"
import GlobalStyles from "./styles/GlobalStyles"

function MainPage() {
  return (
    <>
      <GlobalStyles />
      <Navigation />
      <HeroSection />
      <DankeSection />
      <BilderSection />
      <UploadSection />
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
        <Route
          path="/essenfassen"
          element={
            <>
              <GlobalStyles />
              <EssenFassen />
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
