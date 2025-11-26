import './homepage.css'
import Modal from '../../components/modal/Modal'
import Login from '../../features/auth/Login'
import Signup from '../../features/auth/Signup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsAuthQuery } from '../../app/api/authApiSlice'
import ForgotPassword from '../../features/auth/ForgotPassword'
import EmailVerification from '../../features/auth/EmailVerification'
import LoadingSpinner from '../../components/loadingspinner/LoadingSpinner'

//MOVE THE CHECK LOGIC TO THE LAYOUT COMPONENT

const Homepage = () => {
  const navigate = useNavigate()
  const {data: isLoggedIn, isLoading, isSuccess, isError }  = useIsAuthQuery(undefined)

  const [loginModal, setLoginModal] = useState(false)
  const [signupModal, setSignupModal] = useState(false)

  let content

  if (isLoading) {
    content = <div className="page homepage">
      <LoadingSpinner />
    </div>
  }

  if (isLoggedIn?.success) {
    navigate('/new-entry')
  }

  if ((isSuccess && !isLoggedIn?.success) || isError) {
    content = <div className="page homepage">
      <h1 className="page-title">Welcome to Foragers</h1>
      <div className="button-div">
        <button className="btn login-btn" onClick={() => setLoginModal(true)}>Login</button>
        <button className="btn signup-btn" onClick={() => setSignupModal(true)}>Sign Up</button>
      </div>
      <img className="body-logo" src="./foragersLogo.webp" alt="Foragers Logo" height="250" width="250"/>
      <hr />
      <Modal Component={Login} NextComponent={ForgotPassword} toggleModal={loginModal} setToggleModal={setLoginModal} />
      <Modal Component={Signup} NextComponent={EmailVerification} toggleModal={signupModal} setToggleModal={setSignupModal}/>
    </div>
  }

  return content

}

  export default Homepage