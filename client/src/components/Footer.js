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

const AdminLink = styled.a`
  display: inline-block;
  background: none;
  border: 2px solid #fff;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s;
  text-decoration: none;

  &:hover {
    background: #fff;
    color: #000;
  }
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
        <AdminLink href="/admin">🔒</AdminLink>
        <Copyright>© 2026 Sarah & Iver - Alle Rechte vorbehalten</Copyright>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
