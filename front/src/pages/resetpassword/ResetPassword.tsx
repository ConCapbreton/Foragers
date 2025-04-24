import './resetpassword.css'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useResetPasswordMutation } from '../../app/api/authApiSlice'
import { validatePassword } from '../../utils/validateInputs'
import LoadingSpinner from '../../components/loadingspinner/LoadingSpinner'

const ResetPassword = () => {
  const { token } = useParams()
  const [userMsg, setUserMsg] = useState("")
  const [pwdReset, setPwdReset] = useState(false)
  const [resetPassword, {isLoading}] = useResetPasswordMutation()
  const [formData, setFormData] = useState({
    password: '',
    confirmPwd: '',
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
    
    const isPwd = validatePassword(formData.password, formData.confirmPwd)
    if (!isPwd.success) {
      setUserMsg(isPwd.message || "")
      return
    }
   
    if (!token) {
      setUserMsg("You have an invalid token. Please request another reset link.")
      setPwdReset(true)
      return
    }

    try {
      const response = await resetPassword({password: formData.password, token}).unwrap()
      if (response.success) {
        setUserMsg(response.message)
        setPwdReset(true)
      } else {
        setUserMsg("Seems there was a problem, try to submit your new password again.")
      }
      
    } catch (error: any) {
      if (error?.status) {
        setUserMsg(error.data?.message)
      } else {
        setUserMsg("Password update failed.")
      }
    }
  }

  let content
  pwdReset
    ? content = <Link to="/" className="link reset-home-link">Go back home to login.</Link>
    : content = <form id="reset-pwd-form" onSubmit={handleSubmit}>
      <div className="signup-input-div">
        <input 
          id="reset-password" 
          type="password" 
          minLength={6}
          required 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder=""
        />
        <label htmlFor="reset-password">New password</label>
      </div>

      <div className="signup-input-div">
        <input 
          id="reset-confirm-pwd" 
          type="password" 
          minLength={6}
          required 
          name="confirmPwd"
          value={formData.confirmPwd}
          onChange={handleInputChange}
          placeholder=""
        />
        <label htmlFor="reset-confirm-pwd">Confirm new password</label>
      </div>

      <button className="btn login-submit" type="submit">
        {isLoading 
          ? <LoadingSpinner />
          : <span>Submit</span>
        }
      </button>
    </form>    

  return (
    <div className="page">
      <div className="modal-div" >
        <div className="modal-display"> 
          <div className="reset-pwd-header">
            <img src="/foragersLogo.webp" alt="Forager's Logo" height="50" width="50" />
          </div>
          <h2 id="reset-title">Foragers Reset Password</h2>
          {content}  
          <p className="user-msg reset-msg">{userMsg}</p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
