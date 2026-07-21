import { useCallback, useEffect, useMemo, useState } from "react"
import styled from "styled-components"

// ============================================================
// BILDER: Passwortgeschützte Galerie
// - Passwort wird NUR serverseitig geprüft (/api/photos)
// - Tages-Filter: ALLE / STANDESAMT / FEIER
//   ("standesamt" = Bilder mit Tag "standesamt" in Cloudinary,
//    "feier" = alle ohne diesen Tag – kein Nachtaggen nötig.
//    Die Filter-Buttons erscheinen erst, wenn beide Gruppen
//    existieren, also sobald Standesamt-Bilder hochgeladen sind.)
// - Grid lädt erst 10 Bilder, weitere über "Mehr laden"
// - Lightbox: Pfeile (Desktop), Wischen + Pfeile (Mobil),
//   Nachbarbilder werden vorgeladen für flüssiges Blättern
// - Auswahl bis 15 Bilder, Download als ZIP in Originalqualität
// ============================================================

const MAX_SELECTION = 15
const INITIAL_VISIBLE = 10 // Bilder beim ersten Laden
const LOAD_STEP = 30 // Bilder pro Klick auf "Mehr laden"

const BilderContainer = styled.section`
  padding: 5rem 2rem;
  background-color: #000;
  color: #fff;
`

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Text = styled.p`
  font-size: 1.25rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

/* ---------- Passwort-Gate ---------- */

const PasswordForm = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const PasswordInput = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  border: 4px solid #fff;
  background: #000;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  width: 220px;

  &::placeholder {
    color: #666;
    letter-spacing: 0.1em;
    font-weight: 400;
    font-size: 1.1rem;
  }

  &:focus {
    outline: none;
    background: #111;
  }
`

const ActionButton = styled.button`
  background: #fff;
  color: #000;
  border: 4px solid #fff;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.05em;

  &:hover:not(:disabled) {
    background: #000;
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const GhostButton = styled(ActionButton)`
  background: #000;
  color: #fff;

  &:hover:not(:disabled) {
    background: #fff;
    color: #000;
  }
`

const ErrorText = styled.p`
  color: #ff4d4d;
  font-weight: 900;
  font-size: 1.1rem;
  margin-top: 1.5rem;
`

const InfoText = styled.p`
  color: #999;
  font-size: 1rem;
  margin-top: 1.5rem;
  line-height: 1.6;
`

/* ---------- Filter ---------- */

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`

const FilterButton = styled.button`
  background: ${(props) => (props.$active ? "#fff" : "#000")};
  color: ${(props) => (props.$active ? "#000" : "#fff")};
  border: 4px solid #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.05em;

  &:hover {
    background: #fff;
    color: #000;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`

/* ---------- Galerie ---------- */

const Toolbar = styled.div`
  position: sticky;
  top: 5.5rem;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
  background: #000;
  padding: 1rem 0;
`

const SelectionCounter = styled.span`
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: ${(props) => (props.$full ? "#ff4d4d" : "#fff")};
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
`

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 4px solid ${(props) => (props.$selected ? "#fff" : "#000")};
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${(props) => (props.$selected ? "brightness(0.6)" : "none")};
`

const SelectToggle = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid #fff;
  background: ${(props) => (props.$selected ? "#fff" : "rgba(0,0,0,0.5)")};
  color: ${(props) => (props.$selected ? "#000" : "#fff")};
  font-size: 1.25rem;
  font-weight: 900;
  cursor: pointer;
  line-height: 1;
`

const LoadMoreWrapper = styled.div`
  margin-top: 2.5rem;
`

/* ---------- Lightbox ---------- */

const Lightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
  border: 4px solid #fff;
  opacity: ${(props) => (props.$loaded ? 1 : 0.3)};
  transition: opacity 0.2s;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 70%;
    border: none;
  }
`

const LightboxCounter = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 1.1rem;
  font-weight: 900;
  color: #fff;
  z-index: 10001;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #fff;
  color: #000;
  border: 4px solid #fff;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  z-index: 10001;

  &:hover {
    background: #000;
    color: #fff;
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
  }
`

// Seitliche Pfeile – nur Desktop
const SideNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #000;
  border: 4px solid #fff;
  padding: 1rem 1.5rem;
  font-size: 2rem;
  font-weight: 900;
  cursor: pointer;
  z-index: 10001;

  ${(props) => props.$left && "left: 2rem;"}
  ${(props) => props.$right && "right: 2rem;"}

  &:hover {
    background: #000;
    color: #fff;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const LightboxBar = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 10001;
  flex-wrap: wrap;
  padding: 0 1rem;

  @media (max-width: 768px) {
    bottom: 1.5rem;
  }
`

// Pfeile in der unteren Leiste – nur Mobil
const BarNavButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: inline-block;
    background: #fff;
    color: #000;
    border: 4px solid #fff;
    padding: 0.75rem 1.25rem;
    font-size: 1.5rem;
    font-weight: 900;
    cursor: pointer;
    line-height: 1;
  }
`

const LightboxSelectButton = styled.button`
  display: inline-block;
  background: ${(props) => (props.$selected ? "#000" : "#fff")};
  color: ${(props) => (props.$selected ? "#fff" : "#000")};
  border: 4px solid #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`

const LoadingText = styled.p`
  font-size: 1.25rem;
  font-weight: 900;
  color: #fff;
`

const STORAGE_KEY = "si_bilder_pw"
const MIN_SWIPE_DISTANCE = 50

const FILTERS = [
  { key: "alle", label: "ALLE" },
  { key: "standesamt", label: "STANDESAMT" },
  { key: "feier", label: "FEIER" },
]

function BilderSection() {
  const [passwordInput, setPasswordInput] = useState("")
  const [password, setPassword] = useState(null) // verifiziertes Passwort
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [dayFilter, setDayFilter] = useState("alle")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxLoaded, setLightboxLoaded] = useState(false)
  const [zipLoading, setZipLoading] = useState(false)

  // Touch-Swipe in der Lightbox
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Gefilterte Liste – Grundlage für Grid UND Lightbox
  const filteredPhotos = useMemo(() => {
    if (dayFilter === "standesamt") return photos.filter((p) => p.standesamt)
    if (dayFilter === "feier") return photos.filter((p) => !p.standesamt)
    return photos
  }, [photos, dayFilter])

  // Filter nur anzeigen, wenn es beide Gruppen gibt
  const hasStandesamt = useMemo(
    () => photos.some((p) => p.standesamt),
    [photos]
  )
  const hasFeier = useMemo(() => photos.some((p) => !p.standesamt), [photos])
  const showFilter = hasStandesamt && hasFeier

  const loadPhotos = useCallback(async (pw) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      })

      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY)
        setPassword(null)
        setError("FALSCHES PASSWORT")
        return
      }

      if (!res.ok) {
        throw new Error("Serverfehler")
      }

      const data = await res.json()
      setPhotos(data.photos || [])
      setPassword(pw)
      sessionStorage.setItem(STORAGE_KEY, pw)
    } catch (err) {
      setError(
        "BILDER KONNTEN NICHT GELADEN WERDEN. BITTE SPÄTER NOCHMAL VERSUCHEN."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Passwort aus der Session wiederverwenden (z. B. nach Reload)
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      loadPhotos(stored)
    }
  }, [loadPhotos])

  const handleUnlock = () => {
    if (passwordInput.trim()) {
      loadPhotos(passwordInput.trim())
    }
  }

  const changeFilter = (key) => {
    setDayFilter(key)
    setVisibleCount(INITIAL_VISIBLE)
    setLightboxIndex(null)
  }

  const toggleSelect = (id) => {
    setError(null)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= MAX_SELECTION) {
          setError(
            `MAXIMAL ${MAX_SELECTION} BILDER PRO DOWNLOAD – ERST HERUNTERLADEN, DANN WEITER AUSWÄHLEN.`
          )
          return prev
        }
        next.add(id)
      }
      return next
    })
  }

  const startZipDownload = async () => {
    if (selected.size === 0) return
    setZipLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          publicIds: Array.from(selected),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError((data.error || "DOWNLOAD FEHLGESCHLAGEN").toUpperCase())
        return
      }

      window.location.assign(data.url)
      // Auswahl nach Start des Downloads zurücksetzen,
      // damit direkt die nächsten 15 gewählt werden können
      setSelected(new Set())
    } catch (err) {
      setError("DOWNLOAD FEHLGESCHLAGEN. BITTE SPÄTER NOCHMAL VERSUCHEN.")
    } finally {
      setZipLoading(false)
    }
  }

  const openLightbox = (index) => {
    setLightboxLoaded(false)
    setLightboxIndex(index)
  }

  const goToPrevious = useCallback(() => {
    setLightboxLoaded(false)
    setLightboxIndex((prev) =>
      prev > 0 ? prev - 1 : filteredPhotos.length - 1
    )
  }, [filteredPhotos.length])

  const goToNext = useCallback(() => {
    setLightboxLoaded(false)
    setLightboxIndex((prev) =>
      prev < filteredPhotos.length - 1 ? prev + 1 : 0
    )
  }, [filteredPhotos.length])

  // Tastatur-Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    if (lightboxIndex !== null) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxIndex, goToPrevious, goToNext])

  // Nachbarbilder vorladen, damit Blättern flüssig ist
  useEffect(() => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return

    const preload = (idx) => {
      const photo =
        filteredPhotos[(idx + filteredPhotos.length) % filteredPhotos.length]
      if (photo) {
        const img = new Image()
        img.src = photo.full
      }
    }

    preload(lightboxIndex + 1)
    preload(lightboxIndex - 1)
  }, [lightboxIndex, filteredPhotos])

  // Body-Scroll sperren, solange die Lightbox offen ist
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [lightboxIndex])

  // Touch-Swipe Handler
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (distance > MIN_SWIPE_DISTANCE) goToNext()
    if (distance < -MIN_SWIPE_DISTANCE) goToPrevious()
    setTouchStart(null)
    setTouchEnd(null)
  }

  /* ---------- Render ---------- */

  // Noch nicht freigeschaltet
  if (!password) {
    return (
      <BilderContainer id='bilder'>
        <Inner>
          <SectionTitle>DIE BILDER</SectionTitle>
          <Text>
            Alle Fotos der Feier – zum Ansehen und Herunterladen. Gebt das
            Passwort ein (ihr kennt es schon von der Anmeldung).
          </Text>
          <PasswordForm>
            <PasswordInput
              type='password'
              inputMode='numeric'
              placeholder='Passwort'
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUnlock()
              }}
            />
            <ActionButton onClick={handleUnlock} disabled={loading}>
              {loading ? "LÄDT..." : "ANSEHEN →"}
            </ActionButton>
          </PasswordForm>
          {error && <ErrorText>{error}</ErrorText>}
        </Inner>
      </BilderContainer>
    )
  }

  const visiblePhotos = filteredPhotos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPhotos.length
  const currentPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null
  const currentSelected = currentPhoto && selected.has(currentPhoto.id)

  // Freigeschaltet
  return (
    <BilderContainer id='bilder'>
      <Inner>
        <SectionTitle>DIE BILDER</SectionTitle>

        {loading ? (
          <LoadingText>LADE BILDER...</LoadingText>
        ) : (
          <>
            <Text>
              Sucht euch eure Lieblingsbilder aus: Mit dem ✓ auswählen (bis zu{" "}
              {MAX_SELECTION} auf einmal), dann herunterladen – ihr bekommt
              alles als ZIP in voller Qualität. Danach könnt ihr direkt die
              nächsten auswählen.
            </Text>

            {showFilter && (
              <FilterBar>
                {FILTERS.map((f) => (
                  <FilterButton
                    key={f.key}
                    $active={dayFilter === f.key}
                    onClick={() => changeFilter(f.key)}
                  >
                    {f.label}
                  </FilterButton>
                ))}
              </FilterBar>
            )}

            <Toolbar>
              <SelectionCounter $full={selected.size >= MAX_SELECTION}>
                {selected.size} / {MAX_SELECTION} AUSGEWÄHLT
              </SelectionCounter>
              <ActionButton
                onClick={startZipDownload}
                disabled={zipLoading || selected.size === 0}
              >
                {zipLoading
                  ? "ERSTELLE ZIP..."
                  : `HERUNTERLADEN (${selected.size})`}
              </ActionButton>
            </Toolbar>

            {error && <ErrorText>{error}</ErrorText>}

            <ImageGrid>
              {visiblePhotos.map((photo, index) => {
                const isSelected = selected.has(photo.id)
                return (
                  <ImageCard
                    key={photo.id}
                    $selected={isSelected}
                    onClick={() => openLightbox(index)}
                  >
                    <Thumb
                      src={photo.thumb}
                      alt={`Hochzeitsbild ${index + 1}`}
                      loading='lazy'
                      $selected={isSelected}
                    />
                    <SelectToggle
                      $selected={isSelected}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSelect(photo.id)
                      }}
                      aria-label={
                        isSelected ? "Auswahl entfernen" : "Bild auswählen"
                      }
                    >
                      ✓
                    </SelectToggle>
                  </ImageCard>
                )
              })}
            </ImageGrid>

            {hasMore && (
              <LoadMoreWrapper>
                <GhostButton
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + LOAD_STEP, filteredPhotos.length)
                    )
                  }
                >
                  MEHR LADEN ({visibleCount} / {filteredPhotos.length})
                </GhostButton>
              </LoadMoreWrapper>
            )}

            {photos.length === 0 && (
              <InfoText>
                Die Bilder der Fotografen sind noch nicht online – schaut bald
                wieder vorbei!
              </InfoText>
            )}
          </>
        )}

        {/* Lightbox */}
        {currentPhoto && (
          <Lightbox
            onClick={() => setLightboxIndex(null)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <LightboxCounter>
              {lightboxIndex + 1} / {filteredPhotos.length}
            </LightboxCounter>
            <CloseButton onClick={() => setLightboxIndex(null)}>✕</CloseButton>
            <SideNavButton
              $left
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              ‹
            </SideNavButton>
            <LightboxImage
              key={currentPhoto.id}
              src={currentPhoto.full}
              alt={`Hochzeitsbild ${lightboxIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              onLoad={() => setLightboxLoaded(true)}
              $loaded={lightboxLoaded}
            />
            <SideNavButton
              $right
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              ›
            </SideNavButton>
            <LightboxBar onClick={(e) => e.stopPropagation()}>
              <BarNavButton onClick={goToPrevious}>‹</BarNavButton>
              <LightboxSelectButton
                $selected={currentSelected}
                onClick={() => toggleSelect(currentPhoto.id)}
                disabled={!currentSelected && selected.size >= MAX_SELECTION}
              >
                {currentSelected ? "✓ AUSGEWÄHLT" : "AUSWÄHLEN"}
              </LightboxSelectButton>
              <BarNavButton onClick={goToNext}>›</BarNavButton>
            </LightboxBar>
          </Lightbox>
        )}
      </Inner>
    </BilderContainer>
  )
}

export default BilderSection
