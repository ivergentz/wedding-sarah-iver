import { useState } from "react"
import styled from "styled-components"

const FAQContainer = styled.section`
  padding: 5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 4rem;
  color: #000;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const AccordionItem = styled.div`
  border: 4px solid #000;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s;

  &:last-child {
    margin-bottom: 0;
  }
`

const AccordionHeader = styled.button`
  width: 100%;
  padding: 1.5rem;
  background-color: ${(props) => (props.$isOpen ? "#000" : "#fff")};
  color: ${(props) => (props.$isOpen ? "#fff" : "#000")};
  border: none;
  text-align: left;
  font-size: 1.25rem;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.$isOpen ? "#000" : "#f0f0f0")};
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 1.25rem;
  }
`

const AccordionIcon = styled.span`
  font-size: 1.5rem;
  font-weight: 900;
  transition: transform 0.3s;
  transform: ${(props) => (props.$isOpen ? "rotate(45deg)" : "rotate(0deg)")};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

const AccordionContent = styled.div`
  max-height: ${(props) => (props.$isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s ease;
`

const AccordionText = styled.div`
  padding: ${(props) => (props.$isOpen ? "1.5rem" : "0 1.5rem")};
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
  font-weight: 400;
  border-top: ${(props) => (props.$isOpen ? "2px solid #000" : "none")};

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: ${(props) => (props.$isOpen ? "1.25rem" : "0 1.25rem")};
  }
`

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (index) => {
    if (openIndex === index) {
      setOpenIndex(null) // Gleicher Index = schließen
    } else {
      setOpenIndex(index) // Neuer Index = öffnen
    }
  }

  const faqs = [
    {
      question: "Standesamtliche Trauung - FR - 03/07/26?",
      answer:
        "Am Freitag, den 03/07/26 um 10.30 Uhr, heiraten wir im Rathaus in Jork. Leider sind die Plätze im Standesamt begrenzt, weshalb wir nur ausgewählte Personen einladen konnten. Wir freuen uns aber über alle, die mit uns nach der Trauung vor dem Rathaus anstoßen wollen.",
    },
    {
      question: "Nach der Trauung - FR - 03/07/26",
      answer:
        "Wir gehen nach der Trauung mit dem engsten Kreis Essen. Danach ist nichts 'offizielles' mehr geplant.",
    },
    {
      question: "Ablauf am Samstag - SA - 04/07/26",
      answer:
        "Unser Wunsch ist es, mit so vielen unserer Freunde wie möglich zu feiern. Es gibt kein großes 'Tam Tam' - wir verzichten auf Essen und beginnen erst um 18:00 Uhr. Es wird einen Sektempfang geben. Danach folgt eine kurze freie Trauung. Und dann: Tanzen und die Bar leer trinken, oder andersrum. Aber tanzen!",
    },
    {
      question: "Dresscode - SA - 04/07/26",
      answer:
        "Wir wollen, dass ihr euch wohlfühlt! Egal wie ihr ausseht, Hauptsache ihr seht gut aus!",
    },
    {
      question: "Kinder - SA - 04/07/26",
      answer:
        "Wir mögen Kinder. Wirklich. Aber der Abend ist für Erwachsene gedacht. Wir bitten daher um Verständnis, dass wir keine Kinder zu unserer Feier einladen. Unsere eigenen Kids verlassen die Party auch, damit wir ausgelassen mit euch feiern können. ",
    },
    {
      question: "Anreise - SA - 04/07/26",
      answer:
        "Es gibt in der Nähe nur wenige Parkplätze. Der nächste öffentliche Parkplatz ist an der Rindermarkthalle. Die Location ist aber mit U- Bahn (Feldstraße), S-Bahn (Reeperbahn / Sternschanze) oder Bus (Neuer Pferdemarkt / Feldstraße / Paulinenstraße) gut zu erreichen.",
    },
    {
      question: "Spiele und sonstiger Firlefanz - SA - 04/07/26",
      answer:
        "Wirds nicht geben. Wir wollen einfach nur mit euch feiern, tanzen und eine gute Zeit haben.",
    },
    {
      question: "Besonderheiten der Location - SA - 04/07/26",
      answer:
        "Der Grüne Jäger hat zwei Etagen. Wir haben für unsere Feier die 'Jägerlounge' im 1. OG gebucht. Den Außenbereich teilen wir uns mit einem Geburtstag der im EG parallel zu uns feiert. Bitte nehmt Rücksicht auf die anderen Feiernden.",
    },
    {
      question: "Übernachtungsmöglichkeiten",
      answer:
        "Wir feiern mitten auf St. Pauli, also gibt es viele Hotels und Airbnbs in der Nähe. Wir empfehlen, frühzeitig zu buchen, da die Nachfrage an dem Wochenende sehr hoch ist. Kontingente haben wir keine reserviert.",
    },

    {
      question: "Was ist das für ein komischer Code auf der Einladung?",
      answer:
        "Der Code wird bei 'Zu- oder Absage' weiter unten benötigt. Er dient dazu, eure Einladung zu verifizieren und sicherzustellen, dass nur geladene Gäste antworten können. Einfach in das entsprechende Feld eingeben.",
    },
  ]

  return (
    <FAQContainer id='faq'>
      <SectionTitle>DETAILS</SectionTitle>
      {faqs.map((faq, index) => (
        <AccordionItem key={index}>
          <AccordionHeader
            onClick={() => handleToggle(index)}
            $isOpen={openIndex === index}
          >
            <span>{faq.question}</span>
            <AccordionIcon $isOpen={openIndex === index}>+</AccordionIcon>
          </AccordionHeader>
          <AccordionContent $isOpen={openIndex === index}>
            <AccordionText $isOpen={openIndex === index}>
              {faq.answer}
            </AccordionText>
          </AccordionContent>
        </AccordionItem>
      ))}
    </FAQContainer>
  )
}

export default FAQ
