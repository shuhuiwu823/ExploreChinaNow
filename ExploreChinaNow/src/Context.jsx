import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create the App Context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Initial loading state set to true
  const [errorMsg, setErrorMsg] = useState(""); // State to store any error messages

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase Auth instance
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, extract required information
        setUserData({
          username: user.displayName || "Anonymous", // Fallback to "Anonymous" if displayName is null
          email: user.email,
          avatar: user.photoURL || "/default-avatar.png", // Use default avatar if photoURL is null
          name: user.displayName || "Anonymous",
        });
      } else {
        // User is not logged in
        setUserData(null);
      }
      setLoading(false); // Mark loading as complete
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Context value to be shared across the app
  const value = {
    userData, // User information
    setUserData, // Function to update user information
    loading, // Loading state
    setLoading, // Function to update loading state
    errorMsg, // Error message
    setErrorMsg, // Function to update error message
  };

  return (
    <AppContext.Provider value={value}>
      {children} {/* Render child components */}
    </AppContext.Provider>
  );
};
