import styled from "styled-components"
import { HERO_IMAGE_URL } from "../config/photos"

// Euer Hochzeitsfoto (liegt lokal unter public/assets/gallery/hero.jpg).
// Alternativ kann in config/photos.js eine Cloudinary-URL gesetzt werden.
const FALLBACK_IMAGE = "/assets/gallery/hero.jpg"

const HeroContainer = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  padding-top: 5rem;
  overflow: hidden;

  /* Hintergrundbild */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("${(props) => props.$image}");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    /* Schwarz-Weiß Filter – Zeile löschen, wenn das Bild in Farbe sein soll */
    filter: grayscale(100%) brightness(0.9);

    z-index: 0;
  }

  /* Dunkler Overlay für bessere Lesbarkeit */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.3)
    );
    z-index: 1;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`

const Title = styled.h1`
  font-size: 7rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.5rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.1em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

function HeroSection() {
  const image = HERO_IMAGE_URL || FALLBACK_IMAGE

  return (
    <HeroContainer id='home' $image={image}>
      <ContentWrapper>
        <Title>DANKE.</Title>
        <Subtitle>04/07/26 - AUF SANKT PAULI</Subtitle>
      </ContentWrapper>
    </HeroContainer>
  )
}

export default HeroSection
