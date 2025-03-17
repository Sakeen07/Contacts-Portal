import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userActions } from './store/index'

function WelcomePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleLogout = () => {
      dispatch(userActions.logout())
      navigate('/login')
    }
    
    return (
      <div className="min-h-screen bg-white flex flex-col relative">

        {/* Background*/}
        <div className="absolute inset-0 opacity-70 overflow-hidden">
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
              </div>
            ))}
          </div>
        </div>
          
        {/* Main Content */}
        <div 
          className="flex-1 w-full shadow-lg text-white relative flex flex-col bg-teal-900 z-10"
          style={{
            clipPath: "polygon(0 0, 75% 0, 100% 15%, 100% 100%, 25% 100%, 0 85%, 0 0)",
            borderRadius: "0 15% 0 15%"
          }}>
          {/* Logo */}
          <div className="pt-12 pb-4 pl-15 pr-12">
          <div className="flex items-center">
            <div className="text-red-500 font-bold text-2xl mr-2">
              <span className="mr-1">▲</span>
              <span className="mr-1">▲</span>
              <span>▲</span>
            </div>
            <div className="text-red-500 font-bold text-2xl">twc</div>
          </div>
          <div className="text-white font-bold text-4xl">contacts</div>
          <div className="text-white text-4xl">portal</div>
        </div>
          
          <div className="flex flex-col justify-center flex-grow pl-24 pr-12">
            <div className="mb-20">
              <h1 className="text-6xl font-bold mb-3">Welcome,</h1>
              <p className="text-2xl">
                This is where your contacts will live. Click the button below
                to add a new contact or view your existing contacts.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <button 
                onClick={() => navigate('/add-contact')}
                className="border border-white rounded-full py-2 px-6 text-white hover:underline text-lg cursor-pointer">
                add your first contact
              </button>
              
              <button 
                onClick={() => navigate('/contacts')}
                className="border border-white rounded-full py-2 px-6 text-white hover:underline text-lg cursor-pointer">
                show contacts
              </button>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="absolute bottom-10 right-10">
            <button 
              onClick={handleLogout}
              className="flex items-center text-white hover:underline cursor-pointer">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
              </span>
              logout
            </button>
          </div>
        </div>
      </div>
    );
  };

export default WelcomePage
