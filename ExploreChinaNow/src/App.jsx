import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Tips from './components/Tips.jsx';
import Plan from './components/Plan.jsx';
import Blogs from './components/Blogs.jsx';

function App() {
  return (
    <Router>
      <header className="header">
        <div className="header-left">
          <h1>Explore China Now</h1>
          <div className="navigation-buttons">
            <Link to="/tips" className="home-button navigation-button">Travel Tips</Link>
            <Link to="/plan" className="plan-button navigation-button">Travel Plan</Link>
            <Link to="/blogs" className="blog-button navigation-button">Blog Posts</Link>
          </div>
        </div>

        <div className="header-right">
          <Link to="/register" className="register-btn">Join Us</Link>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/tips" element={<Tips />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="footer"></footer>
    </Router>
  );
}

export default App;
