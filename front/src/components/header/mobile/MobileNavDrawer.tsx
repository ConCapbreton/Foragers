import React from "react"
import CircleX from "../../circleX/CircleX"

interface MobNavProps {
  setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileNavDrawer: React.FC<MobNavProps> = ({ setToggleMenu }) => {
  // NEED OPTION HERE FOR LOGGED IN AND NOT LOGGED IN NAV BUTTONS 
  let navBtns
  navBtns = <>
    <button className="mob-nav-btn">Home</button>
    <button className="mob-nav-btn">About</button>
    <button className="mob-nav-btn">User Guide</button>
  </> 

  return (
    <>
      <div id="mob-nav-opt">
        <img src="./logored.webp" alt="Forager's Logo" height="50" width="50" />
        <CircleX onClickSetter={setToggleMenu}/>
      </div>
      <div id="mob-btn-div">{navBtns}</div>
    </>
  )
}

export default MobileNavDrawer
