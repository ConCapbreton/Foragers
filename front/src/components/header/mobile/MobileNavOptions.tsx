import React from "react"

interface MobNavProps {
  setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileNavOptions: React.FC<MobNavProps> = ({ setToggleMenu }) => {
  // NEED OPTION HERE FOR LOGGED IN AND NOT LOGGED IN NAV BUTTONS 
  let navBtns
  navBtns = <>
    <button className="mob-nav-btn">About</button>
    <button className="mob-nav-btn">User Guide</button>
    <button className="mob-nav-btn">Contact</button>
  </> 



  return (
    <>
      <div id="mob-nav-opt">
        <img src="./logored.webp" alt="Forager's Logo" height="66" width="66" />
        <div className="circle-x" onClick={() => setToggleMenu(false)}>
          <div className="circle-line line-one"></div>
          <div className="circle-line line-two"></div>
        </div>
      </div>
      <div id="mob-btn-div">{navBtns}</div>
    </>
  )
}

export default MobileNavOptions
