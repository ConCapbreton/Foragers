import { useState, useEffect, RefObject } from "react"
import ReCAPTCHA from 'react-google-recaptcha'
import GoogleLogin from "./GoogleLogin"

interface SignupProps {
  toggleModal: boolean,
  setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
  reRef: RefObject<ReCAPTCHA | null>,
}

interface SignupForm {
  username: string,
  email: string,
  bday: string,
  password: string,
  confirmPwd: string,
  isTAndC: boolean,
}

const Signup: React.FC<SignupProps> = ({toggleModal, setNextPage, reRef}) => {
  
  const [userMsg, setUserMsg] = useState('')
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    email: '',
    bday: '',
    password: '',
    confirmPwd: '',
    isTAndC: false,
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

    console.log(formData.bday)

    if (!formData.password) return

    //DO I NEED AN ERROR HANDLER FOR THIS??
    const token = await reRef.current?.executeAsync()
    //SEND TOKEN TO THE BACKEND ALOING WITH FORM DATA

    console.log(token)
    console.log(formData)
    //TO TAKE YOU TO THE VALIDATE EMAIL PAGE
    setNextPage(true)

    reRef.current?.reset()
  }

  useEffect(() => {
    if (!toggleModal) {
      setUserMsg("")
      setFormData({
        username: '',
        email: '',
        bday: '',
        password: '',
        confirmPwd: '',
        isTAndC: false,
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
            name="bday"
            value={formData.bday}
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
            name="isTAndC"
            checked={formData.isTAndC}
            onChange={() => setFormData({...formData, isTAndC: !formData.isTAndC})}
          />
          <label htmlFor="signup-tandc" id="tandc-label">I agree to the <a href="/termsandconditions">Terms and conditions</a> and the <a href="/privacypolicy">Privacy Policy</a></label>
        </div>
        <button className="btn login-submit signup-submit" type="submit" onClick={handleSubmit}>Submit</button>
        <p id="signup-user-msg">{userMsg}</p>
      </form>
    </>
  )
}

export default Signup