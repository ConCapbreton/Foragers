import { useState, useEffect, RefObject } from "react"
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'

// import { useDispatch } from 'react-redux'
// import { setCredentials } from "./authSlice"

import { useLoginUserMutation } from "../../app/api/authApiSlice"
import { validateEmail } from "../../utils/validateInputs"
import GoogleLogin from "./GoogleLogin"

interface LoginProps {
  toggleModal: boolean,
  setNextPage: React.Dispatch<React.SetStateAction<boolean>>
  reRef: RefObject<ReCAPTCHA | null>,
}

const Login: React.FC<LoginProps> = ({toggleModal, setNextPage, reRef}) => {
  const [loginUser, {data: loginData, isSuccess: isLoginSuccess, isError: isLoginError, error: loginError}] = useLoginUserMutation()
  const [userMsg, setUserMsg] = useState("")
  const navigate = useNavigate()
  // const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value, 
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    //CHECK EMAIL USING REGEX (NO CHECK ON PASSWORD)
    //CHECK BOTH EMAIL AND PASSWORD ARE PRESENT BEFORE TRYING SERVER
    
    setUserMsg("")

    const isEmail = validateEmail(formData.email)
    if (!isEmail.success) {
      setUserMsg(isEmail.message || "")
      return
    }

    if (!formData.email || !formData.password) {
      setUserMsg("Please provide login details.")
      return
    }
    
    try {
      const token = await reRef.current?.executeAsync() || ""

      if (formData.email && formData.password) {
        await loginUser({...formData, token}).unwrap()
        console.log(loginData, isLoginSuccess, isLoginError, loginError)
        navigate
        // dispatch(setCredentials({...userData}))
      }
    } catch (error) {
      //NEED TO HAVE A MESSAGE AREA IN THE COMPONENT TO COMMUNICATE WITH THE USER. 
      console.log(error)
    }
    
    
    
    //SEND TOKEN TO THE BACKEND ALOING WITH FORM DATA
   
    
    reRef.current?.reset()
  }

  useEffect(() => {
    if (!toggleModal) {
      setUserMsg("")
      setFormData({
        email: '',
        password: '',
      })
    }
  }, [toggleModal])

  return (
    <>
      <form id="login-form" onSubmit={handleSubmit}>
        <h2 id="login-title">Foragers Login</h2>
        <GoogleLogin />
        <div id="login-input-div">
          <div className="signup-input-div">
            <input 
              id="login-email" 
              type="email"  
              required 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=""
            />
            <label htmlFor="login-email">Email</label>
          </div>
          
          <div className="signup-input-div">
            <input 
              id="login-password" 
              type="password" 
              required 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder=""
            />
            <label htmlFor="login-password">Password</label>
          </div>
        </div>
        <button id="forgot-pwd" type="button" onClick={() => {setNextPage(true)}}>Forgot password?</button>
        <button className="btn login-submit" type="submit">Submit</button>
        <p id="user-msg">{userMsg}</p>
      </form>
    </>
  )
}

export default Login