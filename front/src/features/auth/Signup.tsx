import { useState, useEffect } from "react" //RefObject
 // import ReCAPTCHA from 'react-google-recaptcha'
import GoogleLogin from "./GoogleLogin"
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner"
import { useSignupUserMutation } from "../../app/api/authApiSlice"
import { validateUsername, validateEmail, validateDob, validatePassword } from "../../utils/validateInputs"
import { containsHTML, safelyTrimInputs } from "../../utils/sanitizeInputs"
import { ModCompProps } from "../../components/modal/Modal"

interface SignupForm {
  username: string,
  email: string,
  dob: string,
  password: string,
  confirmPwd: string,
  termsAccepted: boolean,
}

const Signup: React.FC<ModCompProps> = ({toggleModal, setNextPage }) => { //reRef
  const [signupUser, { isLoading }] = useSignupUserMutation()
  const [userMsg, setUserMsg] = useState('')
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    email: '',
    dob: '',
    password: '',
    confirmPwd: '',
    termsAccepted: false,
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value, 
    })
  }

  async function handleSubmit (event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault()
    setUserMsg("")

    const inputsToTrim = ['username', 'email', 'dob']
    safelyTrimInputs(formData, inputsToTrim)

    const isHTML = containsHTML(Object.values(formData))
    if (isHTML.success) {
      setUserMsg(isHTML.message || "")
      return
    }
    
    const isUsername = validateUsername(formData.username)
    if (!isUsername.success) {
      setUserMsg(isUsername.message || "")
      return
    }
    
    const isEmail = validateEmail(formData.email)
    if (!isEmail.success) {
      setUserMsg(isEmail.message || "")
      return
    }

    const isDob = validateDob(formData.dob) 
    if (!isDob.success) {
      setUserMsg(isDob.message || "")
      return
    }

    const isPwd = validatePassword(formData.password, formData.confirmPwd) 
    if (!isPwd.success) {
      setUserMsg(isPwd.message || "")
      return
    }

    if (!formData.termsAccepted) {
      setUserMsg("Please accept our Terms and conditions and Privacy Policy")
      return
    }
    
    try {
      const token = "" //await reRef.current?.executeAsync() ||
      const signupResponse = await signupUser({...formData, token}).unwrap()
      if (signupResponse.success) {
        setNextPage(true)
      } else {
        setUserMsg("Signup failed")
      }
    } catch (error: any) {
      if (error?.status) {
        setUserMsg(error.data?.message)
      } else {
        setUserMsg("Signup failed")
      }
    } 
    // reRef.current?.reset()  
  }

  useEffect(() => {
    if (!toggleModal) {
      setUserMsg("")
      setFormData({
        username: '',
        email: '',
        dob: '',
        password: '',
        confirmPwd: '',
        termsAccepted: false,
      })
    }
  }, [toggleModal])

  return (
    <>
      <form id="signup-form">
        <h2 id="signup-title">Foragers Sign Up</h2>
        <GoogleLogin />
        <div className="signup-input-div">
          <input 
            id="signup-username" 
            type="text" 
            minLength={3} 
            maxLength={20} 
            required 
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder=""
          />
          <label htmlFor="signup-username">Username</label>
        </div>
        
        <div className="signup-input-div">
          
          <input 
            id="signup-email" 
            type="email" 
            required 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder=""
          />
          <label htmlFor="signup-email">Email</label>
        </div>

        <div className="signup-input-div">
          
          <input 
            id="signup-bday" 
            type="date" 
            required 
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
          <label htmlFor="signup-bday" id="bday-label">Date of birth</label>
        </div>
        
        <div className="signup-input-div">
        
          <input 
            id="signup-password" 
            type="password" 
            minLength={6}
            required 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder=""
          />
          <label htmlFor="signup-password">Password</label>
        </div>
        
        <div className="signup-input-div">
          <input 
            id="signup-confirm-pwd" 
            type="password" 
            minLength={6}
            required 
            name="confirmPwd"
            value={formData.confirmPwd}
            onChange={handleInputChange}
            placeholder=""
          />
          <label htmlFor="signup-confirm-pwd">Confirm password</label>
        </div>
        
        <div id="signup-checkbox">
          <input 
            id="signup-tandc" 
            type="checkbox" 
            required 
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={() => setFormData({...formData, termsAccepted: !formData.termsAccepted})}
          />
          <label htmlFor="signup-tandc" id="tandc-label">I agree to the <a href="/termsandconditions">Terms and conditions</a> and the <a href="/privacypolicy">Privacy Policy</a></label>
        </div>
        <button className="btn login-submit signup-submit" type="submit" onClick={handleSubmit}>
          {isLoading 
            ? <LoadingSpinner />
            : <span>Submit</span>
          }
        </button>
        <p id="signup-user-msg">{userMsg}</p>
      </form>
    </>
  )
}

export default Signup