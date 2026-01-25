import React, { useState } from "react"
import styled from "styled-components"

const GalleryContainer = styled.section`
  padding: 5rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  background-color: #000;

  @media (max-width: 768px) {
    padding: 0;
    max-width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 4rem;
  color: #000;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0;
    padding: 2rem 1rem 1rem;
  }
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileCarousel = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    width: 100%;
  }
`

const CarouselImageContainer = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
`

const CarouselImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

const CarouselControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #000;
  color: #fff;
`

const CarouselButton = styled.button`
  background: #fff;
  color: #000;
  border: 2px solid #fff;
  padding: 0.75rem 1.25rem;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  min-width: 50px;

  &:active {
    background: #000;
    color: #fff;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const CarouselCounter = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  pointer-events: none;
  min-width: 80px;
  text-align: center;
`
const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 4px solid #000;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

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
  max-height: 90%;
  object-fit: contain;
  border: 4px solid #fff;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100%;
    border: none;
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

const NavButton = styled.button`
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

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #666;
`

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    // Verwende lokale Bilder aus public/assets/gallery/
    const localImageNames = [
      "foto9.jpg",
      "foto1.jpg",
      "foto2.jpg",
      "foto3.jpg",
      "foto4.jpg",
      "foto5.jpg",
      "foto6.jpg",
      "foto7.jpg",
      "foto8.jpg",
    ]

    // Erstelle Pfade zu lokalen Bildern
    const localImages = localImageNames.map((name) => `/assets/gallery/${name}`)

    setImages(localImages)
    setLoading(false)
  }, [])

  const openLightbox = (index) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const goToPreviousMobile = () => {
    setCurrentMobileIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNextMobile = () => {
    setCurrentMobileIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    if (selectedImage !== null) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedImage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Touch-Swipe für Mobile Carousel
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) goToNextMobile()
    if (isRightSwipe) goToPreviousMobile()
  }

  if (loading) {
    return (
      <GalleryContainer id='gallery'>
        <SectionTitle>BILDER:</SectionTitle>
        <LoadingText>Lade Bilder...</LoadingText>
      </GalleryContainer>
    )
  }

  return (
    <GalleryContainer id='gallery'>
      <SectionTitle></SectionTitle>

      {/* Desktop Grid */}
      <ImageGrid>
        {images.map((image, index) => (
          <ImageCard key={index} onClick={() => openLightbox(index)}>
            <Image
              src={image}
              alt={`Galerie Bild ${index + 1}`}
              loading='lazy'
              onError={(e) => {
                console.error("Bild konnte nicht geladen werden:", image)
                e.target.style.display = "none"
              }}
            />
          </ImageCard>
        ))}
      </ImageGrid>

      {/* Mobile Carousel */}
      <MobileCarousel>
        <CarouselImageContainer
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <CarouselImage
            src={images[currentMobileIndex]}
            alt={`Bild ${currentMobileIndex + 1}`}
          />
        </CarouselImageContainer>
        <CarouselControls>
          <CarouselButton onClick={goToPreviousMobile}>‹</CarouselButton>
          <CarouselCounter>
            <span>{currentMobileIndex + 1}</span>
            <span> / </span>
            <span>{images.length}</span>
          </CarouselCounter>
          <CarouselButton onClick={goToNextMobile}>›</CarouselButton>
        </CarouselControls>
      </MobileCarousel>

      {/* Lightbox (nur Desktop) */}
      {selectedImage !== null && (
        <Lightbox onClick={closeLightbox}>
          <CloseButton onClick={closeLightbox}>✕</CloseButton>
          <NavButton
            $left
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
          >
            ‹
          </NavButton>
          <LightboxImage
            src={images[selectedImage]}
            alt={`Bild ${selectedImage + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <NavButton
            $right
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
          >
            ›
          </NavButton>
        </Lightbox>
      )}
    </GalleryContainer>
  )
}

export default Gallery
