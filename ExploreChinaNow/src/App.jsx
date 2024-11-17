import { useContext, useEffect, useState} from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'
import Tips from './components/Tips.jsx';
import Plan from './components/Plan.jsx';
import Blogs from './components/Blogs.jsx';
import Profile from './components/Profile.jsx';
import { Button } from 'react-bootstrap';
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Videos from "./components/Videos";
import MapContainer from "./components/MapContainer";
import 'bootstrap/dist/css/bootstrap.min.css';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { AppContext } from './Context.jsx';
import { doc, getDoc } from "firebase/firestore";
import { getUserData } from './dbOperation.js';

function App() {
  	const {userData, setUserData} = useContext(AppContext);
  	const [loading, setLoading] = useState(true);

  	useEffect(() => {
    	const unSub = onAuthStateChanged(auth, async (user) => {
	  	if(user){
			const data = await getUserData(user.uid); 
			setUserData(data);
	  	}
      	console.log(user);
	  	setLoading(false);
    	});

    	return () => {
      		unSub();
    	};
    
  	}, []);

  	if(loading) {
		return (<div>Loading...</div>);
  	}

	return (
		<Router>
			<div className="app-content">
				<Header />
				<main className="main-content">
					<Routes>
						<Route path="/videos" element={<Videos />} />
						<Route path="/map" element={<MapContainer />} />
						<Route path="/tour-plan" element={<Plan />} />
            			<Route path="/tips" element={<Tips />} />
            			<Route path="/blog" element={<Blogs />} />
            			<Route path="/sign-in" element={<Login />} />
            			<Route path="/sign-up" element={<Register />} />
						<Route path='/profile' element={userData ? <Profile /> : <Navigate to="/videos"/>} />
            			<Route path="/" element={<div />} />

					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;