import './modal.css'
import React, { useState, useEffect, useRef, RefObject } from 'react';
import ModalHeader from './ModalHeader';
import ReCAPTCHA from 'react-google-recaptcha'

export interface ModNextCompProps {
  toggleModal: boolean,
  nextPage: boolean,
  setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface ModCompProps extends ModNextCompProps {
  reRef: RefObject<ReCAPTCHA | null>,
}

interface ModProps {
  Component: React.ComponentType<ModCompProps>,
  NextComponent: React.ComponentType<ModNextCompProps>,
  toggleModal: boolean,
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FC<ModProps> = ({ Component, NextComponent, toggleModal, setToggleModal }) => {
  const [nextPage, setNextPage] = useState(false)
  const reRef = useRef<ReCAPTCHA | null>(null)

  useEffect(() => {
    if (!toggleModal) {
      setNextPage(false)
    }
  }, [toggleModal])

  return (
    <div className={toggleModal ? "modal-div" : "hide-modal"} onClick={() => setToggleModal(false)}>
      <button onClick={() => setNextPage(false)}>setNextPage</button>
      <div className={`modal-display first-div ${nextPage ? "" : "active"}`}  onClick={event => event.stopPropagation()}>
        <ModalHeader setToggleModal={setToggleModal} />
        <Component toggleModal={toggleModal} nextPage={nextPage} setNextPage={setNextPage} reRef={reRef} />  
        <button onClick={() => setNextPage(true)}>setNextPage</button>
      </div>
      {toggleModal && !nextPage
        ? <div className="recaptcha-div">
            <ReCAPTCHA 
              sitekey={import.meta.env.VITE_REPATCHA_SITE_KEY} 
              size="invisible"
              ref={reRef}
            />
          </div> 
        : <></>
      }
      <div className={`modal-display second-div ${!nextPage ? "" : "active"}`}  onClick={event => event.stopPropagation()}>
        <ModalHeader setToggleModal={setToggleModal} />
        <NextComponent toggleModal={toggleModal} nextPage={nextPage} setNextPage={setNextPage} />
      </div>
      
    </div>
  )
}

export default Modal