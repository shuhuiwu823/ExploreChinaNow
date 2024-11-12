import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './Plan.css';

function Plan() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [savedResponse, setSavedResponse] = useState('');

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
      const botMessage = { role: 'bot', content: data.choices[0].message.content };

      setChatOutput([...chatOutput, newMessage, botMessage]);
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveResponse = async (message) => {
    try {
      await addDoc(collection(db, 'TravelPlan'), {
        content: message,
        timestamp: new Date(),
      });
      setSavedResponse(message);
      setShowPopup(true);
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div id="chat-container">
      <div id="chat-history">
        {chatOutput.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
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