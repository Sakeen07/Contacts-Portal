import React, { useState, useEffect } from 'react';
import { getUserContacts, deleteContact, editContact } from './api-helpers/api-helpers';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './store/index';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, contact: null });
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Your contact has been deleted successfully");
  const [editingContact, setEditingContact] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const emailFromRedux = useSelector(state => state.user.email);
  const userEmail = emailFromRedux || localStorage.getItem('userEmail') || 'User';
  
  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Function to fetch contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await getUserContacts();
      setContacts(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError("Failed to load contacts. Please try again later.");
      
      if (err.response?.status === 401) {
        dispatch(userActions.logout());
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (contact) => {
    setDeleteConfirm({ show: true, contact });
  };

  // Handle delete contact
  const handleDelete = async () => {
    if (!deleteConfirm.contact) return;
    
    try {
      await deleteContact(deleteConfirm.contact._id);
      
      setDeleteConfirm({ show: false, contact: null });
      
      setSuccessMessage("Your contact has been deleted successfully");
      setSuccessAlert(true);
      fetchContacts();

    } catch (err) {
      console.error("Failed to delete contact:", err);
      alert("Failed to delete contact. Please try again.");
      setDeleteConfirm({ show: false, contact: null });
    }
  };

  const closeSuccessAlert = () => {
    setSuccessAlert(false);
    navigate('/contacts');
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, contact: null });
  };

  const handleLogout = () => {
    dispatch(userActions.logout());
    navigate('/login');
  };

  // Enable edit mode
  const handleEdit = (contact) => {
    setEditingContact(contact._id);
    setEditFormData({
      fullname: contact.fullname,
      gender: contact.gender,
      email: contact.email,
      phone: contact.phone
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Save edited contact
  const handleSave = async (contactId) => {
    try {
      await editContact(contactId, editFormData);
      setEditingContact(null);
      setSuccessMessage("Your contact has been updated successfully!");
      setSuccessAlert(true);
      fetchContacts();

    } catch (err) {
      console.error("Failed to update contact:", err);
      alert("Failed to update contact. Please try again.");
    }
  };

  // Get appropriate avatar
  const getAvatar = (gender) => {
    return gender?.toLowerCase() === 'female' ? '👩' : '🧑';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Main content that gets blurred */}
      <div className={`relative w-full h-full flex flex-col flex-1 ${(deleteConfirm.show || successAlert) ? 'filter blur-sm transition-all duration-200' : ''}`}>
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
          {/* Top Right Corner Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)"
            }}/>
          
          {/* Bottom Left Corner Pattern */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10"
            style={{
              clipPath: "polygon(0 100%, 0 0, 100% 100%)"
            }}/>
  
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
  
          {/* Contacts Header */}
          <div className="flex justify-between px-16 mt-8">
            <h2 className="text-white font-bold text-4xl">Contacts</h2>
            <div className="flex items-center text-gray-300 text-sm">
              {/* User Email with Icon */}
              <div className="flex items-center">
                <span className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                {userEmail}
              </div>
              <Link to="/add-contact" className="ml-6 bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-full">
                add new contact
              </Link>
            </div>
          </div>
  
          {/* Contacts List */}
          <div className="mx-16 my-6 bg-white rounded-lg overflow-hidden shadow-lg">
            {loading ? (
              <div className="text-center py-8 text-gray-700">
                Loading contacts...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-700">
                No contacts found. Add your first contact!
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="text-gray-600 border-b">
                  <tr>
                    <th className="py-2 px-6">full name</th>
                    <th className="py-2 px-6">gender</th>
                    <th className="py-2 px-6">e-mail</th>
                    <th className="py-2 px-6">phone number</th>
                    <th className="py-2 px-6 w-24"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-6">
                        <div className="flex items-center">
                          <div className="bg-orange-200 text-xl w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            {getAvatar(contact.gender)}
                          </div>
                          {editingContact === contact._id ? (
                            <input 
                              type="text" 
                              name="fullname"
                              value={editFormData.fullname || ''}
                              onChange={handleEditChange}
                              className="border rounded px-2 py-1 w-full"/>
                          ) : (
                            <span>{contact.fullname}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-6">
                        {editingContact === contact._id ? (
                          <select 
                            name="gender"
                            value={editFormData.gender || ''}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        ) : (
                          contact.gender
                        )}
                      </td>
                      <td className="py-2 px-6">
                        {editingContact === contact._id ? (
                          <input 
                            type="email" 
                            name="email"
                            value={editFormData.email || ''}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 w-full"/>
                        ) : (
                          contact.email
                        )}
                      </td>
                      <td className="py-2 px-6">
                        {editingContact === contact._id ? (
                          <input 
                            type="text" 
                            name="phone"
                            value={editFormData.phone || ''}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 w-full"/>
                        ) : (
                          contact.phone
                        )}
                      </td>
                      <td className="py-2 px-6 text-right whitespace-nowrap">
                        {editingContact === contact._id ? (
                          <button 
                            onClick={() => handleSave(contact._id)}
                            className="px-4 py-1 bg-teal-700 text-white rounded-full text-sm hover:bg-teal-800">
                            Save
                          </button>
                        ) : (
                          <div className="flex justify-end items-center">
                            {/* Edit Button */}
                            <button 
                              onClick={() => handleEdit(contact)}
                              className="text-teal-600 hover:text-teal-800 p-1 inline-block">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                            </button>
                            {/* Delete Button */}
                            <button 
                              onClick={() => confirmDelete(contact)} 
                              className="text-teal-600 hover:text-teal-800 p-1 inline-block ml-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Do you want to delete the {deleteConfirm.contact?.fullname}?
            </h3>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-teal-700 border border-transparent rounded-full text-sm font-medium text-white hover:bg-teal-800">
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {successMessage}
            </h3>
            <div className="flex justify-center mt-6">
              <button
                onClick={closeSuccessAlert}
                className="px-6 py-2 bg-teal-700 border border-transparent rounded-full text-sm font-medium text-white hover:bg-teal-800">
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsPage;