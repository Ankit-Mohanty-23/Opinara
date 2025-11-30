import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpinaraLanding from "./pages/LandingPage";
import OpinaraAuth from "./pages/LoginSignupPage"
import TermsAndPolicy from "./assets/Terms&Policy";

const App = () => {
  return (
    <BrowserRouter>
        <main>
            <Routes>
                <Route path="/" element={<OpinaraLanding />} />
                <Route path="/login" element={<OpinaraAuth />} />
                <Route path="/terms" element={<TermsAndPolicy />} />
            </Routes>
        </main>
    </BrowserRouter>
  )
}

export default App