import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import './Plan.css';
import { AppContext } from '../Context';

/**
 * Plan Component
 * 
 * This component allows users to generate travel plans and manage them. 
 * It interacts with Firestore and provides a chat interface for generating plans.
 * 
 * @component
 */
function Plan() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  useEffect(() => {
    if (userData) {
      const savedChat = localStorage.getItem(`chatOutput_${userData.id}`);
      setChatOutput(savedChat ? JSON.parse(savedChat) : []);
      fetchSavedPlans();
    } else {
      setChatOutput([]);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      localStorage.setItem(`chatOutput_${userData.id}`, JSON.stringify(chatOutput));
    }
  }, [chatOutput, userData]);

  useEffect(() => {
    if (location.state?.selectedCity) {
      const initialInput = `Please generate a travel plan for ${location.state.selectedCity}`;
      setUserInput(initialInput);
    }
  }, [location.state]);

  /**
   * Fetches saved travel plans for the logged-in user.
   * @async
   * @function fetchSavedPlans
   */
  const fetchSavedPlans = async () => {
    if (!userData) return;

    try {
      const q = query(collection(db, 'TravelPlan'), where('userId', '==', userData.id));
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        expanded: false,
      }));
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error fetching saved plans:', error);
    }
  };

  /**
   * Sends a message to the API and updates chat output.
   * @async
   * @function sendMessage
   */
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessage = { role: 'user', content: userInput };

    try {
      const response = await fetch('https://explorechinanow-planserver.onrender.com/api/chat', {
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

  /**
   * Formats chat output for better layout by wrapping paragraphs in HTML tags.
   * 
   * @param {string} text - The text to format.
   * @returns {string} Formatted text with HTML tags.
   * @function formatText
   */
  const formatText = (text) => {
    return text
      .split(/\n+/)
      .map((paragraph, index) => `<p key=${index}>${paragraph}</p>`)
      .join('');
  };

  /**
   * Saves a chat response to database under the current user's plans.
   * 
   * @param {string} message - The chat message to save.
   * @async
   * @function saveResponse
   */
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
        title: message.slice(0, 20) + (message.length > 20 ? '...' : ''),
      });

      const title = message.slice(0, 20) + (message.length > 20 ? '...' : '');
      setSavedPlans([...savedPlans, { id: docRef.id, title, content: message, expanded: false }]);
      setShowPopup(true);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  /**
   * Deletes a saved travel plan from database and updates the UI.
   * 
   * @param {string} planId - The ID of the plan to delete.
   * @async
   * @function deletePlan
   */
  const deletePlan = async (planId) => {
    try {
      await deleteDoc(doc(db, 'TravelPlan', planId));
      setSavedPlans(savedPlans.filter((plan) => plan.id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  /**
   * Toggles the expanded state of a saved plan.
   * 
   * @param {number} index - The index of the plan to toggle.
   * @function toggleExpanded
   */
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

  /**
   * Redirects the user to the sign-in page.
   * @function handleSignIn
   */
  const handleSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <div className="tour-content">
      <div className="saved-plan-list">
        <h3>Saved Plans</h3>
        <div className="plan-cards">
          {savedPlans.map((plan, index) => (
            <div key={plan.id} className={`plan-card ${plan.expanded ? 'expanded' : ''}`}>
              {!plan.expanded && (
                <div className="card-header">
                  <p>{plan.title}</p>
                  <button
                    className="collapse-button"
                    onClick={() => toggleExpanded(index)}
                  >
                    {plan.expanded ? '▲' : '▼'}
                  </button>
                </div>
              )}
              {plan.expanded && (
                <div className="card-body">
                  <div dangerouslySetInnerHTML={{ __html: formatText(plan.content) }} />
                  <div className="list-buttons">
                  <button
                    className="collapse-button"
                    onClick={() => toggleExpanded(index)}
                  >
                    ▲
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deletePlan(plan.id)}
                  >
                    Delete
                  </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div id="chat-container">
        <h3>Create Your Travel Plan</h3>
        <div id="chat-history">
          {chatOutput.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'bot' ? (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                msg.content
              )}
              {msg.role === 'bot' && (
                <button
                  className="save-button"
                  onClick={() => saveResponse(msg.content_ori)}
                >
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
            <button className="popup-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {showSignInPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>You need to sign in to save your plan.</p>
            <div className="popup-buttons">
              <button className="popup-button" onClick={closeSignInPopup}>
                Stay on Page
              </button>
              <button className="popup-button" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plan;