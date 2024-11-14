import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './Plan.css';

function Plan() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

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
      const original_botMessage = { role: 'bot', content: data.choices[0].message.content };
      console.log('bot-response',original_botMessage);
      const botMessage = { role: 'bot', content: formatText(data.choices[0].message.content) };

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
    try {
      const docRef = await addDoc(collection(db, 'TravelPlan'), {
        content: message,
        timestamp: new Date(),
      });

      const title = message.slice(0, 20) + (message.length > 20 ? '...' : '');
      setSavedPlans([...savedPlans, { id: docRef.id, title, content: message, expanded: false }]);
      setShowPopup(true);
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const toggleExpanded = (index) => {
    setSavedPlans(savedPlans.map((plan, i) =>
      i === index ? { ...plan, expanded: !plan.expanded } : plan
    ));
  };

  const closePopup = () => {
    setShowPopup(false);
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
                <button className="save-button" onClick={() => saveResponse(msg.content)}>
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
    </div>
  );
}

export default Plan;
