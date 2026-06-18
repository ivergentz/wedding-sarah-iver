import { useEffect } from "react"
import styled from "styled-components"

/* ---------------------------------------------------------------------------
   ESSEN FASSEN  –  sarahiver.de/essenfassen
   Unterseite für die Hochzeit: Gäste holen sich mit Bändchen Essen in der
   "Kleinen Pause". Im Stil der Hauptseite (S/W, 900er-Weight, ALL CAPS).
   Bewusst nur für Mobile optimiert (wird nur am Handy genutzt).
--------------------------------------------------------------------------- */

const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1" +
  "&origin=Gr%C3%BCner+J%C3%A4ger%2C+Neuer+Pferdemarkt+36%2C+20359+Hamburg" +
  "&destination=Kleine+Pause%2C+Wohlwillstra%C3%9Fe+37%2C+20359+Hamburg" +
  "&travelmode=walking"

const APPLE_MAPS_URL =
  "https://maps.apple.com/?saddr=Neuer+Pferdemarkt+36,+20359+Hamburg" +
  "&daddr=Wohlwillstra%C3%9Fe+37,+20359+Hamburg&dirflg=w"

const FOOD = [
  "Cheeseburger",
  "Hamburger",
  "Hot-Dog",
  "Pommes",
  "Kartoffelsalat",
  "Nudelsalat",
  "Riesencurrywurst",
  "Currywurst",
  "Frikadelle",
  "Vegane Rost- oder Schinkenwurst",
]

const Page = styled.main`
  min-height: 100vh;
  background-color: #fff;
  color: #000;
  display: flex;
  justify-content: center;
`

/* feste, schmale Spalte – mobile only */
const Phone = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
`

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #000;
  color: #fff;
  padding: 1.1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #000;
`

const Logo = styled.a`
  font-size: 1.9rem;
  font-weight: 900;
  color: #fff;
  text-decoration: none;
  letter-spacing: -0.02em;
`

const TopTag = styled.span`
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.18em;
`

const Hero = styled.section`
  background-color: #000;
  color: #fff;
  padding: 2.75rem 1.25rem 2.5rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 3.4rem;
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -0.01em;

  @media (max-width: 360px) {
    font-size: 2.9rem;
  }
`

const Subtitle = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  opacity: 0.85;
`

const Section = styled.section`
  padding: 2rem 1.25rem;
`

const Lead = styled.p`
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.55;
`

const Highlight = styled.span`
  background-color: #000;
  color: #fff;
  padding: 0.05em 0.35em;
`

const Label = styled.h2`
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
`

const Box = styled.div`
  border: 4px solid #000;
`

const FoodList = styled.ul`
  list-style: none;
`

const FoodItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.1rem;
  font-size: 1.15rem;
  font-weight: 900;
  border-bottom: 2px solid #000;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: "";
    width: 0.7rem;
    height: 0.7rem;
    background-color: #000;
    flex-shrink: 0;
  }
`

const DrinkBox = styled.div`
  margin-top: 1rem;
  background-color: #000;
  color: #fff;
  padding: 1.1rem 1.2rem;
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-align: center;
`

const MapCard = styled(Box)`
  padding: 1.25rem;
`

const RouteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const RouteFrom = styled.span`
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.06em;
`

const Badge = styled.span`
  background-color: #000;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.6rem;
  white-space: nowrap;
`

const Address = styled.div`
  margin-top: 1.1rem;
  text-align: center;
  font-weight: 900;
  line-height: 1.5;
  letter-spacing: 0.04em;
`

const AddressBig = styled.div`
  font-size: 1.35rem;
`

const Button = styled.a`
  display: block;
  margin-top: 1.1rem;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 1.05rem;
  border: 4px solid #000;

  &:active {
    background-color: #fff;
    color: #000;
  }
`

const GhostButton = styled(Button)`
  background-color: #fff;
  color: #000;
  margin-top: 0.6rem;

  &:active {
    background-color: #000;
    color: #fff;
  }
`

const Foot = styled.footer`
  margin-top: auto;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 2rem 1.25rem;
`

const BackLink = styled.a`
  display: inline-block;
  border: 2px solid #fff;
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  padding: 0.7rem 1.2rem;
  margin-bottom: 1.25rem;

  &:active {
    background-color: #fff;
    color: #000;
  }
`

const Copyright = styled.p`
  font-size: 0.8rem;
  color: #999;
  font-weight: 700;
`

/* Vereinfachte Wegbeschreibung Grüner Jäger -> Kleine Pause als Schema-Karte */
function RouteMap() {
  return (
    <svg
      viewBox="0 0 320 380"
      width="100%"
      role="img"
      aria-label="Wegbeschreibung vom Grünen Jäger zur Kleinen Pause"
      style={{ display: "block" }}
    >
      {/* Straßen (helle Bänder) */}
      <rect x="138" y="58" width="170" height="22" fill="#e8e8e8" />
      <rect x="138" y="58" width="24" height="288" fill="#e8e8e8" />
      {/* Querstraßen-Stummel */}
      <rect x="40" y="190" width="98" height="16" fill="#f0f0f0" />
      <rect x="40" y="300" width="98" height="16" fill="#f0f0f0" />

      {/* Route (fette schwarze gestrichelte Linie) */}
      <polyline
        points="290,69 150,69 150,338"
        fill="none"
        stroke="#000"
        strokeWidth="6"
        strokeDasharray="2 11"
        strokeLinecap="round"
      />

      {/* Start: Grüner Jäger */}
      <circle cx="290" cy="69" r="11" fill="#fff" stroke="#000" strokeWidth="5" />
      <text x="284" y="40" textAnchor="end" fontSize="14" fontWeight="900" fill="#000">
        GRÜNER JÄGER
      </text>
      <text x="284" y="54" textAnchor="end" fontSize="10" fontWeight="700" fill="#000">
        NEUER PFERDEMARKT 36
      </text>

      {/* Ziel: Kleine Pause */}
      <circle cx="150" cy="338" r="14" fill="#000" />
      <circle cx="150" cy="338" r="5" fill="#fff" />
      <text x="150" y="372" textAnchor="middle" fontSize="15" fontWeight="900" fill="#000">
        KLEINE PAUSE
      </text>

      {/* Straßennamen */}
      <text
        x="150"
        y="210"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill="#666"
        transform="rotate(-90 150 210)"
      >
        WOHLWILLSTRASSE
      </text>
      <text x="42" y="186" textAnchor="start" fontSize="9" fontWeight="700" fill="#999">
        THADENSTR.
      </text>
      <text x="42" y="296" textAnchor="start" fontSize="9" fontWeight="700" fill="#999">
        OTZENSTR.
      </text>
    </svg>
  )
}

function EssenFassen() {
  useEffect(() => {
    document.title = "S&I. Essen fassen"
    window.scrollTo(0, 0)
  }, [])

  return (
    <Page>
      <Phone>
        <TopBar>
          <Logo href="/">S&amp;I.</Logo>
          <TopTag>ESSEN FASSEN</TopTag>
        </TopBar>

        <Hero>
          <Title>
            ESSEN
            <br />
            FASSEN
          </Title>
          <Subtitle>IN DER KLEINEN PAUSE</Subtitle>
        </Hero>

        <Section>
          <Lead>
            Zeigt einfach euer <Highlight>Bändchen</Highlight> an der Theke und
            sucht euch unten was aus, worauf ihr Bock habt. Geht aufs Haus.
          </Lead>
        </Section>

        <Section style={{ paddingTop: 0 }}>
          <Label>VON DER KARTE</Label>
          <Box>
            <FoodList>
              {FOOD.map((item) => (
                <FoodItem key={item}>{item}</FoodItem>
              ))}
            </FoodList>
          </Box>
          <DrinkBox>DAZU GIBT&apos;S BIER, SOFTDRINKS &amp; CO.</DrinkBox>
        </Section>

        <Section style={{ paddingTop: 0 }}>
          <Label>SO KOMMT IHR HIN</Label>
          <MapCard>
            <RouteMeta>
              <RouteFrom>VOM GRÜNEN JÄGER</RouteFrom>
              <Badge>290 M · 4 MIN ZU FUSS</Badge>
            </RouteMeta>

            <RouteMap />

            <Address>
              <AddressBig>KLEINE PAUSE</AddressBig>
              WOHLWILLSTRASSE 37
              <br />
              20359 HAMBURG
            </Address>

            <Button href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              ROUTE IN GOOGLE MAPS
            </Button>
            <GhostButton
              href={APPLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              ROUTE IN APPLE KARTEN
            </GhostButton>
          </MapCard>
        </Section>

        <Foot>
          <BackLink href="/">ZURÜCK ZUR SEITE</BackLink>
          <Copyright>© 2026 Sarah &amp; Iver</Copyright>
        </Foot>
      </Phone>
    </Page>
  )
}

export default EssenFassen
