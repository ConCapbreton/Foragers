import "./header.css"
import HamburgerMenu from "./mobile/HamburgerMenu"
import NavBtns from "./desktop/NavBtns"
import MobileNav from "./mobile/MobileNav"

import { useState } from "react"

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false)

  return (
    <header className="header">
        <img className="header-logo" src="/logored.webp" alt="Foragers Logo" height="66" width="66" />
        <HamburgerMenu setToggleMenu={setToggleMenu}/>
        <NavBtns />
        <MobileNav toggleMenu={toggleMenu} setToggleMenu={setToggleMenu}/>
    </header>
  )
}

export default Header
