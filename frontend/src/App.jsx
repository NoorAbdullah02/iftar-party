import React from 'react'
import RegisterPage from './Pages/RegisterPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast';
import Header from './Components/Header.jsx'

const App = () => {

  const { isLoggedIn } = useAuth();

  return (
    <>
      <div className='min-h-screen bg-base-100'>
        <Header />
        <main>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<Dashboard />} />

          </Routes>
        </main>
      </div>
    </>
  );
}

export default App