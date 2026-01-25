import { useState } from "react"
import styled from "styled-components"

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #000;
  color: #fff;
  z-index: 9999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.button`
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`

const DesktopMenu = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`

const NavButton = styled.button`
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 2rem;
  background: none;
  border: none;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`

const MenuLine = styled.span`
  height: 2px;
  width: 100%;
  background-color: #fff;
  transition: all 0.3s;

  ${(props) =>
    props.$open &&
    props.$first &&
    `
    transform: rotate(45deg) translateY(8px);
  `}

  ${(props) =>
    props.$open &&
    props.$middle &&
    `
    opacity: 0;
  `}

  ${(props) =>
    props.$open &&
    props.$last &&
    `
    transform: rotate(-45deg) translateY(-8px);
  `}
`

const MobileMenuDropdown = styled.div`
  background-color: #000;
  border-top: 1px solid #fff;
  padding: 1rem 1.5rem;

  @media (min-width: 768px) {
    display: none;
  }
`

const MobileNavButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  font-size: 1.25rem;
  font-weight: 900;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <Nav>
      <NavContainer>
        <Logo onClick={() => scrollToSection("home")}>S&I.</Logo>

        <DesktopMenu>
          <NavButton onClick={() => scrollToSection("details")}>
            FAKTEN
          </NavButton>
          <NavButton onClick={() => scrollToSection("gallery")}>
            GALERIE
          </NavButton>
          <NavButton onClick={() => scrollToSection("faq")}>DETAILS</NavButton>
          <NavButton onClick={() => scrollToSection("rsvp")}>RSVP</NavButton>
        </DesktopMenu>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <MenuLine $open={mobileMenuOpen} $first />
          <MenuLine $open={mobileMenuOpen} $middle />
          <MenuLine $open={mobileMenuOpen} $last />
        </MobileMenuButton>
      </NavContainer>

      {mobileMenuOpen && (
        <MobileMenuDropdown>
          <MobileNavButton onClick={() => scrollToSection("details")}>
            FAKTEN
          </MobileNavButton>
          <MobileNavButton onClick={() => scrollToSection("gallery")}>
            GALERIE
          </MobileNavButton>
          <MobileNavButton onClick={() => scrollToSection("faq")}>
            DETAILS
          </MobileNavButton>
          <MobileNavButton onClick={() => scrollToSection("rsvp")}>
            RSVP
          </MobileNavButton>
        </MobileMenuDropdown>
      )}
    </Nav>
  )
}

export default Navigation
