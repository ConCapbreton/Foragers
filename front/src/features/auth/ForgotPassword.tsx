import { useState, useEffect } from "react"
import { validateEmail } from "../../utils/validateInputs"
import { useForgotPasswordMutation } from "../../app/api/authApiSlice"
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner"
import { ModNextCompProps } from "../../components/modal/Modal"

const ForgotPassword: React.FC<ModNextCompProps> = ({ toggleModal, nextPage, setNextPage }) => {
  const [userMsg, setUserMsg] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [formData, setFormData] = useState({email: ''})

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value, 
    })
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isEmail = validateEmail(formData.email)
    if (!isEmail.success) {
      setUserMsg(isEmail.message || "")
      return
    }

    try {
      
      const response = await forgotPassword({email: formData.email}).unwrap()
      
      if (response.success) {
        setEmailSent(true)
        setUserMsg(response.message)
      } else {
        setUserMsg("There was a problem sending the email.")
      }

    } catch (error: any) {
      if (error?.status) {
        setUserMsg(error.data?.message)
      } else {
        setUserMsg("There was a problem sending the email.")
      }
    } 

  }

  useEffect(() => {
    if (!nextPage || !toggleModal) {
      setUserMsg("")
      setFormData({
        email: ''
      })
      setEmailSent(false)
    }
  }, [nextPage, toggleModal])

  let content
  emailSent
    ? <></>
    : content = <>
      <div className="signup-input-div">
        <input 
          id="forgot-pwd-email" 
          type="email" 
          placeholder=""
          required 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <label htmlFor="forgot-pwd-email">Email</label>
      </div>
      <button className="btn forgot-pwd-submit" type="submit">
        {isLoading 
          ? <LoadingSpinner />
          : <span>Send Reset Link</span>
        }
      </button>
    </>
  
  return (
    <form id="forgot-pwd-form" onSubmit={handleSubmit}>
      <h2 >Forgot Password</h2>
      <p id="forgot-pwd-msg">Enter your email address and we'll send you a link to reset your password.</p>
      {content}
      <p className="user-msg">{userMsg}</p>
      <button className="back-page link" type="button" onClick={() => {setNextPage(false)}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        </svg>
        <p>Back to Login</p>
      </button>
    </form>
  )
}

export default ForgotPassword
