import CookieConsent from './components/CookieConsent'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Homepage from './pages/homepage/Homepage'
import Layout from './components/Layout'
import NewEntry from './pages/newentry/NewEntry'
import YouNeedToLogin from './pages/youneedtologin/YouNeedToLogin'
import RequireAuth from './features/auth/RequireAuth'
import ResetPassword from './pages/resetpassword/ResetPassword'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  
  return (
    <>
      <CookieConsent />
      <Header />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
          {/* PUBLIC */}
          <Route index element={<Homepage />} />
          {/* <Route path="about" element={<About />} /> SYNTAX FOR OTHER PUBLIC ROUTES */}
          <Route path="you-need-to-login" element={<YouNeedToLogin />} /> 
          <Route path="reset-password/:token" element={<ResetPassword />} /> 
          
          {/* PROTECTED */}
          <Route element={<RequireAuth />}>
            <Route path="new-entry" element={<NewEntry />} />
          </Route>
      </Routes>
        {/* NEED A CATCH ALL ROUTE THAT SENDS USERS BACK TO THE HOME PAGE */}
        
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
