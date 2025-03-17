import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from './api-helpers/api-helpers'

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setUserData({
      ...userData,
      [id]: value
    })
    
    // Clear password error when user starts typing again
    if (id === 'password') {
      setPasswordError('')
    }
  }
  
  // Validate password when it changes
  useEffect(() => {
    if (userData.password && userData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
    } else {
      setPasswordError('')
    }
  }, [userData.password])

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Password length validation
    if (userData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }
    
    // Password match validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await registerUser({
        email: userData.email,
        password: userData.password
      })
      
      // Redirect to login page after successful registration
      navigate('/login')
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-full max-w-none m-0 relative">
        {/* Left Section - Dark teal background with form */}
        <div className="w-[50%] bg-teal-900 p-16 flex flex-col justify-center relative" style={{
          clipPath: "ellipse(100% 90% at 0% 50%)"
        }}>
          <h1 className="text-5xl font-bold text-white mb-4">Hi there,</h1>
          <h2 className="text-3xl text-white mb-12">
            Welcome to our<br />
            contacts portal
          </h2>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <input 
              type="email" 
              id="email" 
              value={userData.email}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 
                         text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block 
                         w-3/5 p-2.5 pl-5 placeholder-gray-700 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                         dark:focus:border-blue-500" 
              placeholder="e-mail" 
              required  />
              
            <div className="relative w-3/5">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={userData.password}
                onChange={handleInputChange}
                className={`bg-gray-50 border ${passwordError ? 'border-red-300' : 'border-gray-300'} text-gray-900 
                           text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 
                           block w-full p-2.5 pl-5 pr-10 placeholder-gray-700 dark:bg-gray-700 
                           ${passwordError ? 'dark:border-red-500' : 'dark:border-gray-600'} 
                           dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-blue-500 dark:focus:border-blue-500`} placeholder="create password" 
                           required />
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={togglePasswordVisibility} >

                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 
                                                                        19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 
                                                                        10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 
                                                                        10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 
                                                                        3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 
                                                                        10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 
                                                                        12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 
                                                                        .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 
                                                                        0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password error message */}
            {passwordError && (
              <div className="text-red-300 text-sm -mt-4">{passwordError}</div>
            )}
            
            <div className="relative w-3/5">
              <input 
                type={showPassword ? "text" : "password"} 
                id="confirmPassword" 
                value={userData.confirmPassword}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 
                           text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 
                           block w-full p-2.5 pl-5 pr-10 placeholder-gray-700 dark:bg-gray-700 dark:border-gray-600 
                           dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="confirm password" 
                required />

              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={togglePasswordVisibility} >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 
                                                                        19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 
                                                                        10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 
                                                                        10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 
                                                                        3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 
                                                                        10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 
                                                                        12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 
                                                                        .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 
                                                                        0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* General error message */}
            {error && (
              <div className="text-red-300 text-sm">{error}</div>
            )}
            
            <div className="flex items-center mt-8">
              <button 
                type="submit"
                className="border-2 border-white text-white px-12 py-2 rounded-full hover:underline text-lg cursor-pointer"
                disabled={loading || passwordError} >
                {loading ? 'Registering...' : 'register'}
              </button>
              <span className="text-white mx-4">or</span>
              <Link to="/login" className="text-white underline text-lg">
                Back to login
              </Link>
            </div>
          </form>
        </div>
        
        {/* Right Section - Pattern background with logo */}
        <div className="w-[50%] bg-white relative">
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div className="grid grid-cols-11 gap-2 w-full h-full">
              {[...Array(150)].map((_, i) => (
                <div key={i} className="flex items-center justify-center p-1">
                  {i % 7 === 0 && <div className="w-8 h-8 bg-gray-400 rounded-full" />}
                  {i % 7 === 1 && <div className="w-8 h-8 border-2 border-gray-400 rounded" />}
                  {i % 7 === 2 && <div className="w-8 h-5 border-2 border-gray-400" />}
                  {i % 7 === 3 && <div className="w-8 h-6 bg-gray-400" />}
                  {i % 7 === 4 && <div className="w-8 h-8 bg-gray-400 rounded" />}
                  {i % 7 === 5 && <div className="w-8 h-8 bg-gray-400 rounded-full" />}
                  {i % 7 === 6 && <div className="w-8 h-8 border-2 border-gray-400 rounded" />}
                  {i % 7 === 7 && <div className="w-8 h-5 border-2 border-gray-400" />}
                  {i % 7 === 8 && <div className="w-8 h-6 bg-gray-400" />}
                  {i % 7 === 9 && <div className="w-8 h-8 bg-gray-400 rounded-full" />}
                  {i % 7 === 10 && <div className="w-8 h-8 border-2 border-gray-400 rounded" />}
                  {i % 7 === 11 && <div className="w-8 h-5 border-2 border-gray-400" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="flex justify-center mb-4">
              <div className="text-red-600 font-bold text-4xl">
                <span className="mr-1">▲</span>
                <span className="mr-1">▲</span>
                <span>▲</span>
              </div>
              <span className="text-gray-800 font-bold text-4xl">twc</span>
            </div>
            <div className="text-teal-900 text-6xl font-bold">
              contacts
              <br />
              portal
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
