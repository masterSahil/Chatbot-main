import React, { useState, useEffect, useRef } from "react";
import "../css/msg.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

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
  const [copiedIndex, setCopiedIndex] = useState(null); // Track copied state

  const [botImg, setBotImg] = useState(botDefault);
  const [userImg, setUserImg] = useState(userDefault);

  const [messages, setMessages] = useState([
    { 
      text: "How can I assist you today?", 
      sender: "bot", 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    },
  ]);

  const themeStyles = {
    green: {
      boxShadow: "0 0 15px rgba(78, 240, 55, .7)",
      theme: "#4ef037",
      botImg: botGreen, userImg: userGreen
    },
    blue: {
      boxShadow: "0 0 15px rgba(54, 209, 196, .7)",
      theme: "#36d1c4",
      botImg: botBlue, userImg: userBlue
    },
    purple: {
      boxShadow: "0 0 15px rgba(128, 0, 128, .7)",
      theme: "purple",
      botImg: botPurple, userImg: userPurple
    },
    pink: {
      boxShadow: "0 0 15px rgba(255, 52, 127, .7)",
      theme: "#ff347f",
      botImg: botPink, userImg: userPink
    },
    default: {
      boxShadow: "0 0 15px rgba(79, 70, 229, .7)",
      theme: "#4F46E5",
      botImg: botDefault, userImg: userDefault
    },
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  async function getAnswer() {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setInput("");
    setTyping(true);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { text: trimmedInput, sender: "user", time: currentTime }];
    setMessages(newMessages);

    try {
      const chatHistory = newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
      
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        { contents: chatHistory },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY,
          },
        }
      );

      let apiReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "404! Data not Found";

      apiReply = apiReply.replace(/trained by Google/gi, "trained by Sahil Master");
      apiReply = apiReply.replace(/created by Google/gi, "created by Sahil Master");
      apiReply = apiReply.replace(/I am a large language model, trained by Google./gi, "I am a large language model, trained by Sahil Master.");

      setMessages([...newMessages, { text: apiReply, sender: "bot", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);

    } catch (error) {
      console.error("API call failed:", error);
      let errorMessage = "Error! Could not connect to the bot.";
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.error?.message || 'Bad request'}`;
      } else if (error.request) {
        errorMessage = "Error! No response from server. Check your internet connection.";
      }
      setMessages([...newMessages, { text: errorMessage, sender: "bot", time: currentTime }]);
    } finally {
      setTyping(false);
    }
  }

  function submitMessage(e) {
    if (typing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getAnswer();
    }
  }

  useEffect(() => {
    const theme = themeStyles[color] || themeStyles.default;
    document.documentElement.style.setProperty("--theme-color", theme.theme);
    document.documentElement.style.setProperty("--scrollbar-thumb-color", theme.theme);
    setBotImg(theme.botImg);
    setUserImg(theme.userImg);
  }, [color]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`msg-content ${msg.sender === "user" ? "user-msg-container" : "bot-msg-container"}`}>
            <img 
              src={msg.sender === "bot" ? botImg : userImg} 
              alt={`${msg.sender}-img`} 
              className={`${msg.sender}-img`} 
            />
            
            <div className="msg-box-container">
              {/* Message Bubble (Text Only) */}
              <div 
                className={msg.sender === "user" ? "user-msg msg-box" : "bot-msg msg-box"} 
                style={{ 
                    boxShadow: themeStyles[color]?.boxShadow, 
                    borderColor: themeStyles[color]?.theme 
                }}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Footer: Time + Copy Button (Outside the box) */}
              <div 
                className="msg-footer" 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginTop: '5px',
                    // Align footer right for user, left for bot
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 5px'
                }}
              >
                <div className={`message-time ${msg.sender === "user" ? "user-time" : "bot-time"}`} style={{ margin: 0 }}>
                    {msg.time}
                </div>

                <button 
                    onClick={() => handleCopy(msg.text, index)}
                    title="Copy to clipboard"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#888', // Subtle color
                      opacity: 0.7,
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = themeStyles[color]?.theme || '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = '#888'; }}
                  >
                     {copiedIndex === index ? (
                        // Check Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                     ) : (
                        // Copy Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                     )}
                  </button>
              </div>
              {/* End Footer */}

            </div>
          </div>
        ))}

        {typing && (
          <div className="msg-content bot-msg-container">
            <img src={botImg} alt="bot-img" className="bot-img" />
            <div 
              className="bot-msg msg-box" 
              style={{ boxShadow: themeStyles[color]?.boxShadow, borderColor: themeStyles[color]?.theme }}
            >
              <p className="typing-text">typing <span>.</span><span>.</span><span>.</span></p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-sec" style={{ borderTopColor: themeStyles[color]?.theme }}>
        <textarea 
          className="textarea" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={submitMessage} 
          placeholder="Type something..."
          style={{
            borderColor: themeStyles[color]?.theme,
            outlineColor: themeStyles[color]?.theme,
            caretColor: themeStyles[color]?.theme
          }}
        />

        <button 
          disabled={typing} 
          className="btn" 
          onClick={getAnswer}
          style={{
            background: themeStyles[color]?.theme,
            cursor: typing ? "not-allowed" : "pointer", 
            opacity: typing ? ".5" : "1"
          }}
        >
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