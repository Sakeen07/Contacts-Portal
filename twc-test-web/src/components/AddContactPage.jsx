import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContact } from './api-helpers/api-helpers';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './store/index';

function AddContactPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn && !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prevState => ({
      ...prevState,
      gender
    }));
  };

  const handleLogout = () => {
    dispatch(userActions.logout());
    navigate('/login');
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    
    if (!formData.fullname || !formData.email || !formData.phone || !formData.gender) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createContact(formData);
      navigate('/contacts');

    } catch (error) {
      console.error('Error adding contact:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => {
          dispatch(userActions.logout());
          navigate('/login');
        }, 2000);
      } else {
        setError(error.response?.data?.message || 'Failed to add contact. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-white flex flex-col relative">
      {/* Background Pattern */}
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
          <h2 className="text-white text-4xl font-bold mb-8">New Contact</h2>
          
          <form onSubmit={handleAddContact} className="space-y-6 max-w-3xl">
            <div className="flex gap-4 w-full">
              <input 
                type="text" 
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="full name" 
                className="bg-gray-50 border border-gray-300 text-gray-900 
                           text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 
                           p-2.5 pl-5 placeholder-gray-700 dark:bg-gray-700 dark:border-gray-600 
                           dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                           dark:focus:border-blue-500 w-full"
                required />
              
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e-mail" 
                className="bg-gray-50 border border-gray-300 text-gray-900 
                           text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 
                           p-2.5 pl-5 placeholder-gray-700 dark:bg-gray-700 dark:border-gray-600 
                           dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                           dark:focus:border-blue-500 w-full" 
                required />
            </div>
    
            <div className="flex items-center gap-4">
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="phone number" 
                className="bg-gray-50 border border-gray-300 text-gray-900 
                           text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 
                           p-2.5 pl-5 placeholder-gray-700 dark:bg-gray-700 dark:border-gray-600 
                           dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                           dark:focus:border-blue-500 w-1/2" 
                required />
              
              <div className="flex items-center">
                <span className="mr-6 text-white">gender</span>
                <label className="inline-flex items-center mr-6">
                  <input 
                    type="radio" 
                    name="gender" 
                    className="form-radio" 
                    onChange={() => handleGenderChange('male')}
                    checked={formData.gender === 'male'} 
                    required />
                  <span className="ml-2 text-white">male</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="gender" 
                    className="form-radio" 
                    onChange={() => handleGenderChange('female')}
                    checked={formData.gender === 'female'} />
                  <span className="ml-2 text-white">female</span>
                </label>
              </div>
            </div>
            
            {error && (
              <div className="text-red-300 text-sm">{error}</div>
            )}
            
            <div className="mt-6">
              <button 
                type="submit"
                disabled={loading}
                className="border border-white rounded-full py-2 px-6 text-white hover:underline w-fit text-lg cursor-pointer">
                {loading ? 'Adding...' : 'add contact'}
              </button>
            </div>
          </form>
        </div>
        
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
}

export default AddContactPage;
