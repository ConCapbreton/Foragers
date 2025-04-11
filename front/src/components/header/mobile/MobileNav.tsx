import React from "react"
import MobileNavDrawer from "./MobileNavDrawer"

interface MobNavProps {
  toggleMenu: boolean,
  setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileNav: React.FC<MobNavProps> = ({ toggleMenu, setToggleMenu }) => {

  return (
    <div id={toggleMenu ? "mob-nav" : "hide-mob-nav"}>
      <div id="nav-menu">
        <MobileNavDrawer setToggleMenu={setToggleMenu}/>
      </div>
      <div id="nav-fill" onClick={() => setToggleMenu(false)}></div>
    </div>
  )
}

export default MobileNav
