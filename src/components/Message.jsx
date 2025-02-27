import React, { useState, useEffect, useRef } from "react";
import "../css/msg.css";
import axios from "axios";

// Import theme-based images
import botDefault from "../assets/robot.png";
import userDefault from "../assets/gamer.png";
import botGreen from "../assets/robotGreen.png";
import userGreen from "../assets/gamerGreen.png";
import botBlue from "../assets/robotBlue.png";
import userBlue from "../assets/gamerBlue.png";
import botPurple from "../assets/robotPurple.png";
import userPurple from "../assets/gamerPurple.png";
import botPink from "../assets/robotPink.png";
import userPink from "../assets/gamerPink.png";

const Message = ({ color }) => {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [botImg, setBotImg] = useState(botDefault);
  const [userImg, setUserImg] = useState(userDefault);
  const [messages, setMessages] = useState([
    { text: "How can I assist you today?", sender: "bot", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);

  // Theme-based styles
  const themeStyles = {
    green: { boxShadow: "0 0 15px rgba(78, 240, 55, .7)", theme: "#4ef037", botImg: botGreen, userImg: userGreen },
    blue: { boxShadow: "0 0 15px rgba(54, 209, 196, .7)", theme: "#36d1c4", botImg: botBlue, userImg: userBlue },
    purple: { boxShadow: "0 0 15px rgba(128, 0, 128, .7)", theme: "purple", botImg: botPurple, userImg: userPurple },
    pink: { boxShadow: "0 0 15px rgba(255, 52, 127, .7)", theme: "#ff347f", botImg: botPink, userImg: userPink },
    default: { boxShadow: "0 0 15px rgba(79, 70, 229, .7)", theme: "#4F46E5", botImg: botDefault, userImg: userDefault },
  };

  // Function to get bot response
  async function getAnswer() {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setInput("");
    setTyping(true);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { text: trimmedInput, sender: "user", time: currentTime }];
    setMessages(newMessages);

    // **Custom Responses**
    const customResponses = {
      "who made you": "I am a large language model, trained by Sahil Master.",
      "who created you": "I am a large language model, trained by Sahil Master.",
      "when were you created": "I was set up by Sahil Master on 16 Feb.",
      "when did you start": "I was set up by Sahil Master on 16 Feb.",
      "are you google's ai": "Nope! I am Sahil Master's AI.",
      "do you belong to google": "Nope! I am Sahil Master's AI.",
      "are you from google": "Nope! I am Sahil Master's AI.",
    };

    // **Check for custom response**
    const botReply = customResponses[trimmedInput.toLowerCase()];
    if (botReply) {
      setMessages([...newMessages, { text: botReply, sender: "bot", time: currentTime }]);
      setTyping(false);
      return;
    }

    // **API Request**
    try {
      const API_KEY = "AIzaSyCujTe9X_7XVlnWKYy3eH3htrB0kftjfdk"; // Secure API Key
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: newMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            parts: [{ text: msg.text }],
          })),
        }
      );

      const apiReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "404! Data not Found";
      setMessages([...newMessages, { text: apiReply, sender: "bot", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);

    } catch (error) {
      setMessages([...newMessages, { text: "Error! Internet is not connected", sender: "bot", time: currentTime }]);
    } finally {
      setTyping(false);
    }
  }

  // Function to handle Enter key
  function submitMessage(e) {
    if (typing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getAnswer();
    }
  }

  // Set theme and bot/user images when color changes
  useEffect(() => {
    const theme = themeStyles[color] || themeStyles.default;
    document.documentElement.style.setProperty("--theme-color", theme.theme);
    document.documentElement.style.setProperty("--scrollbar-thumb-color", theme.theme);
    setBotImg(theme.botImg);
    setUserImg(theme.userImg);
  }, [color]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`msg-content ${msg.sender === "user" ? "user-msg-container" : "bot-msg-container"}`}>
            <img src={msg.sender === "bot" ? botImg : userImg} alt={`${msg.sender}-img`} className={`${msg.sender}-img`} />
            <div className="msg-box-container">
              <div className={msg.sender === "user" ? "user-msg msg-box" : "bot-msg msg-box"} style={{ boxShadow: themeStyles[color]?.boxShadow, borderColor: themeStyles[color]?.theme }}>
                {msg.text}
              </div>
              <div className={`message-time ${msg.sender === "user" ? "user-time" : "bot-time"}`}>{msg.time}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="msg-content bot-msg-container">
            <img src={botImg} alt="bot-img" className="bot-img" />
            <div className="bot-msg msg-box" style={{ boxShadow: themeStyles[color]?.boxShadow, borderColor: themeStyles[color]?.theme }}>
              <p className="typing-text">typing <span>.</span><span>.</span><span>.</span></p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-sec" style={{ borderTopColor: themeStyles[color]?.theme }}>
        <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={submitMessage} placeholder="Type something..." style={{ borderColor: themeStyles[color]?.theme, outlineColor: themeStyles[color]?.theme, caretColor: themeStyles[color]?.theme }}></textarea>
        <button disabled={typing} className="btn" onClick={getAnswer} style={{ background: themeStyles[color]?.theme, cursor: typing ? "not-allowed" : "pointer", opacity: typing ? ".5" : "1" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg lucide lucide-send w-5 h-5">
            <path d="m22 2-7 20-4-9-9-4Z"></path>
            <path d="M22 2 11 13"></path>
          </svg>
        </button>
      </div>
    </>
  );
};

export default Message;
