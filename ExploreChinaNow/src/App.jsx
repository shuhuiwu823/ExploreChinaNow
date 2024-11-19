import { useContext, useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

import Home from "./components/Home.jsx";

import Tips from "./components/Tips.jsx";
import Plan from "./components/Plan.jsx";
import Blogs from "./components/Blogs.jsx";
import Profile from "./components/Profile.jsx";

// import { Button } from "react-bootstrap";
import Footer from "./components/Footer.jsx";
import AddPost from "./components/AddPost";
import Header from "./components/Header.jsx";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Videos from "./components/Videos";
import MapContainer from "./components/MapContainer";
import VisaPolicyInfo from "./components/VisaPolicyInfo";
import PaySetup from "./components/PaySetup";
import "bootstrap/dist/css/bootstrap.min.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { AppContext } from "./Context.jsx";
// import { doc, getDoc } from "firebase/firestore";
import { getUserData } from "./dbOperation.js";

function App() {
  const { userData, setUserData } = useContext(AppContext);
	const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth listener
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserData(user.uid); // Fetch user data by UID
        setUserData(data);
      } else {
        setUserData(null); // Set userData to null if user is not logged in
      }
      console.log(user);
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
      <>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visa-policy" element={<VisaPolicyInfo />} />
            <Route path="/payment-setup" element={<PaySetup />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/map" element={<MapContainer />} />
            <Route path="/tour-plan" element={<Plan />} />
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
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
            <Route
              path="/profile"
              element={userData ? <Profile /> : <Navigate to="/videos" />}
            />
            <Route path="/" element={<div />} />
          </Routes>
        </main>
        <Footer />
      </>
    </Router>
  );
}

export default App;
