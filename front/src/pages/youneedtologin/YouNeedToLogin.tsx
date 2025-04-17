import './youneedtologin.css'
import { Link } from "react-router-dom"

const YouNeedToLogin = () => {
  return (
    <div className="page">
      <div id="you-need-to-login-div">
        <h2>You need to login!</h2>
        <p>Follow the link back to the home page.</p>
        <Link className="link home-link" to="/"><span>Home</span></Link> 
      </div>
    </div>
  )
}

export default YouNeedToLogin
 