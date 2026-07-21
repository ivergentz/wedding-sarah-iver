import styled from "styled-components"

const DankeContainer = styled.section`
  padding: 5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  color: #000;
  background-color: #fff;
  text-align: center;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const TextBox = styled.div`
  border: 4px solid #000;
  padding: 2.5rem;
  text-align: left;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const Paragraph = styled.p`
  font-size: 1.25rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const Signature = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  margin-top: 2rem;
  text-align: right;
`

function DankeSection() {
  return (
    <DankeContainer id='danke'>
      <SectionTitle>VIELEN DANK!</SectionTitle>
      <TextBox>
        <Paragraph>
          Danke, dass ihr Teil unserer Feier wart. Ihr habt diesen Tag zu dem
          gemacht, was er war: laut, herzlich, unvergesslich.
        </Paragraph>
        <Paragraph>
          Danke für eure Glückwünsche, eure Geschenke, eure Umarmungen – und
          dafür, dass ihr mit uns bis in die Nacht gefeiert habt.
        </Paragraph>
        <Paragraph>
          Hier findet ihr alle Bilder der Feier zum Ansehen und Herunterladen.
          Und wenn ihr selbst Fotos oder Videos gemacht habt: Ladet sie unten
          hoch – wir freuen uns über jedes einzelne!
        </Paragraph>
        <Signature>SARAH & IVER</Signature>
      </TextBox>
    </DankeContainer>
  )
}

export default DankeSection
