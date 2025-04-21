import { useState, useEffect } from "react" //RefObject 
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from "./authSlice"
import { useLoginUserMutation } from "../../app/api/authApiSlice"
import { validateEmail } from "../../utils/validateInputs"
import { containsHTML,safelyTrimInputs } from "../../utils/sanitizeInputs"
// import ReCAPTCHA from 'react-google-recaptcha'
import GoogleLogin from "./GoogleLogin"
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner"

interface LoginProps {
  toggleModal: boolean,
  setNextPage: React.Dispatch<React.SetStateAction<boolean>>
  // reRef: RefObject<ReCAPTCHA | null>,
}

const Login: React.FC<LoginProps> = ({toggleModal, setNextPage }) => { //reRef
  const [userMsg, setUserMsg] = useState("")
  const navigate = useNavigate()
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()

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
    setUserMsg("")

    const inputsToTrim = ['email']
    safelyTrimInputs(formData, inputsToTrim)

    const isHTML = containsHTML(Object.values(formData))
    if (isHTML.success) {
      setUserMsg(isHTML.message || "")
      return
    }

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
      const token = "" //await reRef.current?.executeAsync() || 
      const userData = await loginUser({...formData, token}).unwrap()
      if (userData.success) {
        dispatch(setCredentials({accessToken: userData.accessToken, username: userData.username}))
        navigate('/new-entry')
      } else {
        setUserMsg("Login failed")
      }

    } catch (error: any) {
      if (error?.status) {
        setUserMsg(error.data?.message)
      } else {
        setUserMsg("Login failed")
      }
    } 
    // reRef.current?.reset()
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
        <button id="forgot-pwd" className="link" type="button" onClick={() => {setNextPage(true)}}>Forgot password?</button>
        <button className="btn login-submit" type="submit">
          {isLoginLoading 
            ? <LoadingSpinner />
            : <span>Submit</span>
          }
        </button>
        <p className="user-msg">{userMsg}</p>
      </form>
    </>
  )
}

export default Login