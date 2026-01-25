import styled from "styled-components"

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
    background-image: url("/assets/gallery/foto1.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    /* Schwarz-Weiß Filter */
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
  return (
    <HeroContainer id='home'>
      <ContentWrapper>
        <Title>SARAH & IVER</Title>
        <Subtitle>04/07/26 - AUF SANKT PAULI</Subtitle>
      </ContentWrapper>
    </HeroContainer>
  )
}

export default HeroSection
