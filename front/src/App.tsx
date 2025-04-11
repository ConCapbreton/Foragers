import CookieConsent from './components/CookieConsent'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Homepage from './pages/homepage/Homepage'
import Layout from './components/Layout'
import NewEntry from './pages/newentry/NewEntry'
import RequireAuth from './features/auth/RequireAuth'

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
          
          {/* PROTECTED */}
          <Route element={<RequireAuth />}>
            <Route path="newentry" element={<NewEntry />} />
          </Route>
      </Routes>
        
        
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
