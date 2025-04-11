
interface ForgotPwdProps {
  setNextPage: React.Dispatch<React.SetStateAction<boolean>>
}

const ForgotPassword: React.FC<ForgotPwdProps> = ({ setNextPage }) => {
  //let content
  //submit worked - success screen (password sent)
  //submit didnt work - retry ()
  
  return (
    <form id="forgot-pwd-form">
      <h2 >Forgot Password</h2>
      <p id="forgot-pwd-msg">Enter your email address and we'll send you a link to reset your password.</p>
      <div className="signup-input-div">
        <input id="forgot-pwd-email" type="email" placeholder=""/>
        <label htmlFor="forgot-pwd-email">Email</label>
      </div>
      <button className="btn forgot-pwd-submit" type="submit">Send Reset Link</button>
      <button className="back-page" type="button" onClick={() => {setNextPage(false)}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        </svg>
        <p>Back to Login</p>
      </button>
    </form>
  )
}

export default ForgotPassword
