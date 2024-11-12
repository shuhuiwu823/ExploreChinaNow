import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'
import Tips from './components/Tips.jsx';
import Plan from './components/Plan.jsx';
import Blogs from './components/Blogs.jsx';
import Profile from './components/Profile.jsx';
import { Button } from 'react-bootstrap';
import Videos from "./components/Videos.jsx"
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';

function App() {
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user);
    });

    return () => {
      unSub();
    };
    
  }, []);

	return (
		<Router>
			<div className="app-content">
				<Header />
				<main className="main-content">
					<Routes>
						<Route path="/videos" element={<Videos />} />
						<Route path="/tour-plan" element={<Plan />} />
            			<Route path="/tips" element={<Tips />} />
            			<Route path="/blog" element={<Blogs />} />
            			<Route path="/sign-in" element={<Login />} />
            			<Route path="/sign-up" element={<Register />} />
            			<Route path="/" element={<div />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
