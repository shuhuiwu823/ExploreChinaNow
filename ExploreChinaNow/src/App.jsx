import { useState } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'
import Tips from './components/Tips.jsx';
import Plan from './components/Plan.jsx';
import Blogs from './components/Blogs.jsx';

function App() {
  const [page, setPage] = useState("tips");

  const renderPage = () => {
    switch(page) {
      case 'tips':
        return 'This is travel tips page';
      case 'plan':
        return <Plan></Plan>;
      case 'blog':
        return 'This is blog posts page';
      case 'login':
        return <Login></Login>;
      case 'register':
        return <Register></Register>
    }
  }
  return (
    <>
      <header className="header">
        <div className='header-left'>
          <h1>Explore China Now</h1>
          <div className='navigation-buttons'>
            <button className='home-button navigation-button' onClick={(e) => {
              e.preventDefault();
              setPage('tips');
            }}>
              Travel Tips
            </button>
            <button className='plan-button navigation-button'onClick={(e) => {
              e.preventDefault();
              setPage('plan');
            }}>
              Travel Plan
            </button>
            <button className='blog-button navigation-button'onClick={(e) => {
              e.preventDefault();
              setPage('blog');
            }}>
              Blog Posts
            </button>
          </div>
        </div>

        <div className='header-right'>
          <button className="register-btn" onClick={(e) => {
            e.preventDefault();
            setPage('register');
          }}>Join Us</button>
          <button className="login-btn" onClick={(e) => {
            e.preventDefault();
            setPage('login');
          }}>Login</button>
        </div>
      </header>
      
      <main className="main">
        {renderPage()}
      </main>
      
      <footer className='footer'>
      </footer>
    </>
    );
}

export default App;
