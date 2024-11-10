import "./App.css";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Videos from "./components/Videos";

function App() {
	return (
		<Router>
			<div className="app-content">
				<Header />
				<main className="main-content">
					<Routes>
						<Route path="/videos" element={<Videos />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
