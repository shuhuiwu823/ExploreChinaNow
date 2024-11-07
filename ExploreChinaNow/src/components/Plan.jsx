import React, { useState } from 'react';

function Plan() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();
      setChatOutput(data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id="chat-container">
      <textarea
        id="user-input"
        placeholder="Type your message..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></textarea>
      <button onClick={sendMessage}>Send</button>
      <div id="chat-output">{chatOutput}</div>
    </div>
  );
}

export default Plan;
