import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './App.css'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'
import WelcomePage from './components/WelcomePage'
import AddContactPage from './components/AddContactPage'
import ContactsPage from './components/ContactsPage'
import { userActions } from './components/store/index'

// Protected Route component using Redux state
const ProtectedRoute = ({ element }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  return element
}

function App() {
  const dispatch = useDispatch()
  
  // Check for existing token and set up user state
  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('userEmail')
    
    if (token) {
      console.log('Found existing token, logging in user')
      console.log('User email from localStorage:', email)
      
      // Update Redux store with login info
      dispatch(userActions.login())
      
      if (!email) {
        console.warn('No email found in localStorage, setting placeholder')
        localStorage.setItem('userEmail', 'Logged User')
      }
    }
  }, [dispatch])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute element={<WelcomePage />} />} />
        <Route path="/add-contact" element={<ProtectedRoute element={<AddContactPage />} />} />
        <Route path="/contacts" element={<ProtectedRoute element={<ContactsPage />} />} />
        
        {/* Catch-all and redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
