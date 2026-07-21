import styled from "styled-components"
import { GOOGLE_PHOTOS_ALBUM_URL } from "../config/photos"

const BilderContainer = styled.section`
  padding: 5rem 2rem;
  background-color: #000;
  color: #fff;
`

const Inner = styled.div`
  max-width: 900px;
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
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const AlbumButton = styled.a`
  display: inline-block;
  background: #fff;
  color: #000;
  border: 4px solid #fff;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.05em;

  &:hover {
    background: #000;
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 1.25rem 2rem;
  }
`

const Hint = styled.p`
  font-size: 1rem;
  color: #999;
  margin-top: 2rem;
  line-height: 1.6;
`

function BilderSection() {
  return (
    <BilderContainer id='bilder'>
      <Inner>
        <SectionTitle>DIE BILDER</SectionTitle>
        <Text>
          Alle Fotos der Feier findet ihr in unserem Album. Dort könnt ihr
          stöbern, einzelne Bilder auswählen oder gleich alles auf einmal
          herunterladen.
        </Text>
        <AlbumButton
          href={GOOGLE_PHOTOS_ALBUM_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          ZUM ALBUM →
        </AlbumButton>
        <Hint>
          Tipp: Im Album oben rechts auf die drei Punkte tippen und „Alle
          herunterladen" wählen – dann bekommt ihr alles als ZIP. Einzelne
          Bilder: Bild öffnen → drei Punkte → „Herunterladen".
        </Hint>
      </Inner>
    </BilderContainer>
  )
}

export default BilderSection
