import React from "react"
import './circleX.css'

interface CircleXProps {
  onClickSetter: React.Dispatch<React.SetStateAction<boolean>>
}

const CircleX: React.FC<CircleXProps> = ({ onClickSetter }) => {
  return (
    <div className="circle-x" onClick={() => onClickSetter(false)}>
      <div className="circle-line line-one"></div>
      <div className="circle-line line-two"></div>
    </div>
  )
}

export default CircleX
