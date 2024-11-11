import "./App.css";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Videos from "./components/Videos";
import MapContainer from "./components/MapContainer";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	return (
		<Router>
			<div className="app-content">
				<Header />
				<main className="main-content">
					<Routes>
						<Route path="/videos" element={<Videos />} />
						<Route path="/map" element={<MapContainer />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
