import './footer.css'

const Footer = () => {
  return (
    <footer id="footer-container">
      <p>@Copyright {new Date().getFullYear()}</p>
      <a>Terms and conditions</a>
      <a>Privacy Policy</a>
    </footer>
  )
}

export default Footer
