import styled from "styled-components"

const FooterContainer = styled.footer`
  background-color: #000;
  color: #fff;
  padding: 3rem 2rem 2rem;
`

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
`

const Copyright = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #999;
`

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© 2026 Sarah & Iver - Alle Rechte vorbehalten</Copyright>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
