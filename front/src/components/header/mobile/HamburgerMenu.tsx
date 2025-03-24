import React from "react"

interface HamProps {
  setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const HamburgerMenu: React.FC<HamProps> = ({ setToggleMenu }) => {

  return (
    <div className="hamburger" onClick={() => setToggleMenu(true)}>
        <div className="ham-line"></div>
        <div className="ham-line"></div>
        <div className="ham-line"></div>
    </div>
  )
}

export default HamburgerMenu
