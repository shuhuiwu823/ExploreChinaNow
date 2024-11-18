import { useContext, useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Tips from "./components/Tips.jsx";
import Plan from "./components/Plan.jsx";
import Blogs from "./components/Blogs.jsx";
import Profile from "./components/Profile.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import AddPost from "./components/AddPost";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"; // React Router for routing
import Videos from "./components/Videos";
import MapContainer from "./components/MapContainer";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling

import { onAuthStateChanged } from "firebase/auth"; // Firebase Authentication
import { auth } from "./firebase.js"; // Firebase configuration
import { AppContext } from "./Context.jsx"; // Global app context
import { getUserData } from "./dbOperation.js"; // Fetch user-specific data from Firebase

function App() {
  const { userData, setUserData } = useContext(AppContext); // Access global context values
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Firebase Auth listener
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserData(user.uid); // Fetch user data by UID
        setUserData(data);
      } else {
        setUserData(null); // Set userData to null if user is not logged in
      }
      setLoading(false); // Mark loading as complete
    });

    return () => {
      unSub(); // Cleanup subscription on unmount
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevent route transitions until loading is complete
  }

  return (
    <Router>
      <div className="app-content">
        {/* Global Header */}
        <Header />
        <main className="main-content">
          <Routes>
            {/* Videos Page */}
            <Route path="/videos" element={<Videos />} />
            
            {/* Map Page */}
            <Route path="/map" element={<MapContainer />} />
            
            {/* Travel Plan Page */}
            <Route path="/tour-plan" element={<Plan />} />
            
            {/* Travel Tips Page */}
            <Route path="/tips" element={<Tips />} />
            
            {/* Blogs with nested AddPost route */}
            <Route
              path="/blogs/*"
              element={
                <Routes>
                  {/* Blogs Home */}
                  <Route path="" element={<Blogs />} />
                  
                  {/* Add Post */}
                  <Route
                    path="add"
                    element={
                      userData ? <AddPost /> : <Navigate to="/sign-in" /> // Redirect if not logged in
                    }
                  />
                </Routes>
              }
            />
            
            {/* Login Page */}
            <Route path="/sign-in" element={<Login />} />
            
            {/* Registration Page */}
            <Route path="/sign-up" element={<Register />} />
            
            {/* Profile Page (only accessible if logged in) */}
            <Route
              path="/profile"
              element={
                userData ? <Profile /> : <Navigate to="/sign-in" />
              }
            />
            
            {/* Default route */}
            <Route path="/" element={<div />} />
          </Routes>
        </main>
        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
