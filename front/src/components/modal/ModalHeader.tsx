import CircleX from "../circleX/CircleX"

interface ModHeaderProps {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalHeader: React.FC<ModHeaderProps> = ({ setToggleModal }) => {
  return (
    <div className="modal-header">
          <img src="./logored.webp" alt="Forager's Logo" height="50" width="50" />
          <CircleX onClickSetter={setToggleModal}/>
    </div>
  )
}

export default ModalHeader