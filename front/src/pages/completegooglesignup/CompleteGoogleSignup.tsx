import './completegooglesignup.css'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCompleteProfileMutation } from '../../app/api/authApiSlice'
import { containsHTML, safelyTrimInputs } from "../../utils/sanitizeInputs"
import { validateUsername, validateDob } from "../../utils/validateInputs"
import LoadingSpinner from '../../components/loadingspinner/LoadingSpinner'
import { useDispatch } from 'react-redux'
import { setCredentials } from "../../features/auth/authSlice"

interface CompleteProfileForm {
    username: string,
    dob: string,
    termsAccepted: boolean,
  }

const CompleteGoogleSignup = () => {
    const { completeProfileToken } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [completeProfile, { isLoading }] = useCompleteProfileMutation()
    const [userMsg, setUserMsg] = useState('')
      const [formData, setFormData] = useState<CompleteProfileForm>({
        username: '',
        dob: '',
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

    const inputsToTrim = ['username', 'dob']
    safelyTrimInputs(formData, inputsToTrim)

    const noHTML = containsHTML(Object.values(formData))
    if (!noHTML.success) {
      setUserMsg(noHTML.message || "")
      return
    }
    
    const isUsername = validateUsername(formData.username)
    if (!isUsername.success) {
      setUserMsg(isUsername.message || "")
      return
    }

    const isDob = validateDob(formData.dob) 
    if (!isDob.success) {
      setUserMsg(isDob.message || "")
      return
    }

    if (!formData.termsAccepted) {
      setUserMsg("Please accept our Terms and conditions and Privacy Policy")
      return
    }

    if (!completeProfileToken) {
        setUserMsg("You have an invalid token. Please try and login again.")
        return
      }
    
    try {
      
      const completeProfileResponse = await completeProfile({...formData, completeProfileToken}).unwrap()
      if (completeProfileResponse.success) {
        dispatch(setCredentials({accessToken: completeProfileResponse.accessToken, username: completeProfileResponse.username}))
        navigate('/new-entry')
      } else {
        setUserMsg("Failed to update your profile.")
      }
    } catch (error: any) {
      if (error?.status) {
        console.log(error)
        setUserMsg(error.data?.message)
      } else {
        setUserMsg("Failed to update your profile.")
      }
    } 
  }

  return (
    <div className="page">
      <div className="modal-div" >
        <div className="modal-display"> 
          <div className="reset-pwd-header">
            <img src="/foragersLogo.webp" alt="Forager's Logo" height="50" width="50" />
          </div>
          <form id="signup-form">
            <h2 id="complete-profile-title">Complete your Foragers profile</h2>
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
                id="signup-bday" 
                type="date" 
                required 
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
              <label htmlFor="signup-bday" id="bday-label">Date of birth</label>
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
            <button className="btn login-submit complete-profile-submit" type="submit" onClick={handleSubmit}>
            {isLoading 
              ? <LoadingSpinner />
              : <span>Submit</span>
            }
            </button>
            <p id="signup-user-msg">{userMsg}</p>
          </form>
        </div>
      </div>
    </div>

   
  )
}

export default CompleteGoogleSignup
