import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import './Plan.css';
import { AppContext } from '../context';

function Plan() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState(() => {
    const savedChat = localStorage.getItem('chatOutput');
    return savedChat ? JSON.parse(savedChat) : [];
  });
  const [savedPlans, setSavedPlans] = useState(() => {
    const savedPlansData = localStorage.getItem('savedPlans');
    return savedPlansData ? JSON.parse(savedPlansData) : [];
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false); // Popup for not signed-in users
  const location = useLocation();
  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  useEffect(() => {
    localStorage.setItem('chatOutput', JSON.stringify(chatOutput));
  }, [chatOutput]);

  useEffect(() => {
    localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessage = { role: 'user', content: userInput };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      const botMessage = {
        role: 'bot',
        content: formatText(data.choices[0].message.content),
        content_ori: data.choices[0].message.content,
      };

      setChatOutput([...chatOutput, newMessage, botMessage]);
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatText = (text) => {
    return text
      .split(/\n+/)
      .map((paragraph, index) => `<p key=${index}>${paragraph}</p>`)
      .join('');
  };

  const saveResponse = async (message) => {
    if (!userData) {
      setShowSignInPopup(true);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'TravelPlan'), {
        content: message,
        timestamp: new Date(),
        userId: userData.id,
      });

      const title = message.slice(0, 20) + (message.length > 20 ? '...' : '');
      setSavedPlans([...savedPlans, { id: docRef.id, title, content: message, expanded: false }]);
      setShowPopup(true);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const toggleExpanded = (index) => {
    setSavedPlans(
      savedPlans.map((plan, i) =>
        i === index ? { ...plan, expanded: !plan.expanded } : plan
      )
    );
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeSignInPopup = () => {
    setShowSignInPopup(false);
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <div className="main-content">
      <div className="saved-plan-list">
        <h2>Saved Plans</h2>
        <ul>
          {savedPlans.map((plan, index) => (
            <li key={plan.id}>
              <span>{plan.title}</span>
              <button className="more-button" onClick={() => toggleExpanded(index)}>
                {plan.expanded ? 'Less' : 'More'}
              </button>
              {plan.expanded && <p className="full-content">{plan.content}</p>}
            </li>
          ))}
        </ul>
      </div>
      <div id="chat-container">
        <h2>Create Your Travel Plan</h2>
        <div id="chat-history">
          {chatOutput.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'bot' ? (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                msg.content
              )}
              {msg.role === 'bot' && (
                <button className="save-button" onClick={() => saveResponse(msg.content_ori)}>
                  Save
                </button>
              )}
            </div>
          ))}
        </div>
        <div id="input-section">
          <textarea
            id="user-input"
            placeholder="Type your question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          ></textarea>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Response saved successfully!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {showSignInPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>You need to sign in to save your plan.</p>
            <button onClick={closeSignInPopup}>Stay on Page</button>
            <button onClick={handleSignIn}>Sign In</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plan;
