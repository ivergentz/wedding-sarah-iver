import { useState } from "react"
import styled from "styled-components"

const DetailsContainer = styled.section`
  padding: 5rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  color: #000;
  background-color: #fff;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`

const CardContainer = styled.div`
  perspective: 1000px;
  height: 350px;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 300px;
  }
`

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;

  ${(props) =>
    props.$flipped &&
    `
    transform: rotateY(180deg);
  `}
`

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 4px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  background-color: #fff;
`

const CardFront = styled(CardFace)`
  /* Hint für "klickbar" */
  &::after {
    content: "↻";
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    opacity: 0.5;
  }
`

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);

  /* Hint für "zurück" */
  &::after {
    content: "←";
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 1.5rem;
    opacity: 0.5;
  }
`

const CardTitle = styled.h3`
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  max-width: 90%;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

const CardContent = styled.div`
  text-align: center;
`

const CardText = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const CardIcon = styled.div`
  font-size: 2.6rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
`

function DetailsSection() {
  const [flippedCard, setFlippedCard] = useState(null)

  const handleCardClick = (cardId) => {
    if (flippedCard === cardId) {
      setFlippedCard(null) // Gleiche Karte nochmal = schließen
    } else {
      setFlippedCard(cardId) // Neue Karte öffnen
    }
  }

  const cards = [
    {
      id: "standesamt",
      title: "FR - 03/07/26",
      icon: "STANDESAMT",
      details: [
        "Begrenzte Plätze - wir haben separat eingeladen",
        "Rathaus Jork",
        "Am Gräfengericht 2",
        "21635 Jork",
        "10:30 Uhr",
      ],
    },
    {
      id: "hochzeit",
      title: "SA - 04/07/26",
      icon: "LOCATION",
      details: [
        "Grüner Jäger",
        "Neuer Pferdemarkt 36",
        "20359 Hamburg",
        "Beginn: 18:00 Uhr",
      ],
    },
    {
      id: "dresscode",
      title: "SA - 04/07/26",
      icon: "DRESSCODE",
      details: [
        "Hochzeit, aber auf 'locker'",
        "Sarah will euch strahlen sehen",
      ],
    },
    {
      id: "achtung",
      title: "WICHTIG",
      icon: "ACHTUNG",
      details: [
        "Wir feiern keine 'klassische' Hochzeit mit gesetztem Essen",
        "Wir wollen mit euch eine PARTY feiern!",
        "Bitte kommt satt (Es gibt einen Mitternachtssnack)",
      ],
    },
    {
      id: "schlafen",
      title: "TRIVAGO...",
      icon: "HOTEL?",
      details: [
        "Wir heiraten auf St. Pauli",
        "Viele Möglichkeiten in Laufnähe zur Location",
        "ABER: Bucht möglichst früh - es sind viele Veranstaltungen an dem Wochenende",
      ],
    },
    {
      id: "geschenke",
      title: "",
      icon: "GESCHENKE",
      details: ["Hochzeit ist teuer"],
    },
  ]

  return (
    <DetailsContainer id='details'>
      <SectionTitle>FAKTEN</SectionTitle>
      <Grid>
        {cards.map((card) => (
          <CardContainer key={card.id} onClick={() => handleCardClick(card.id)}>
            <CardInner $flipped={flippedCard === card.id}>
              {/* Vorderseite */}
              <CardFront>
                <CardIcon>{card.icon}</CardIcon>
                <CardTitle>{card.title}</CardTitle>
              </CardFront>

              {/* Rückseite */}
              <CardBack>
                <CardContent>
                  {card.details.map((detail, index) => (
                    <CardText key={index}>{detail}</CardText>
                  ))}
                </CardContent>
              </CardBack>
            </CardInner>
          </CardContainer>
        ))}
      </Grid>
    </DetailsContainer>
  )
}

export default DetailsSection
