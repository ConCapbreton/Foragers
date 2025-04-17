import React from "react"
import ModalHeader from "../../modal/ModalHeader"

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
      <ModalHeader setToggleModal={setToggleMenu}/>
      <div id="mob-btn-div">{navBtns}</div>
    </>
  )
}

export default MobileNavDrawer
