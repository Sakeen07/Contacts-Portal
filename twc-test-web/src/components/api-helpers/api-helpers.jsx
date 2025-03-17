import axios from "axios";

// Base URL
const API_BASE_URL = "http://localhost:3001/api";

// Get the token from local storage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/register", userData);
    return response.data;
    
  } catch (error) {
    console.error("Error registering user:", error.response?.data);
    throw error;
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    
    if (response.data.user) {
      localStorage.setItem("userId", response.data.user._id || response.data.user.id);
      localStorage.setItem("userEmail", response.data.user.email);
    }
    return response.data;

  } catch (error) {
    console.error("Error logging in:", error.response?.data);
    throw error;
  }
};

// Create a new contact
export const createContact = async (contactData) => {
  try {
    const response = await axiosInstance.post("/contacts", contactData);
    return response.data;

  } catch (error) {
    console.error("Error creating contact:", error);
    
    if (error.response?.status === 401) {
      console.error("Authentication failed");
    }
    throw error;
  }
};

// Get All Contacts for the authenticated user
export const getUserContacts = async () => {
  try {
    const response = await axiosInstance.get("/contacts");
    return response.data;

  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// Edit Contact
export const editContact = async (contactId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/contacts/${contactId}`, updatedData);
    return response.data;

  } catch (error) {
    console.error("Error updating contact:", error.response?.data);
    throw error;
  }
};

// Delete Contact
export const deleteContact = async (contactId) => {
  try {
    const response = await axiosInstance.delete(`/contacts/${contactId}`);
    return response.data;

  } catch (error) {
    console.error("Error deleting contact:", error.response?.data);
    throw error;
  }
};

