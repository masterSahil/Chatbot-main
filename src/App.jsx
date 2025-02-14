import Message from "./components/Message";
import Navbar from "./components/Navbar";
import "./css/App.css";
import { useState, useRef } from "react";
import { colorContext } from "./Context/context";

function App() {
  const [color, setColor] = useState("");
  const containerRef = useRef("");

  const themeStyles = {
    green: {
      theme: "0 0 15px 1px rgba(78, 240, 55, .7)",
    },
    blue: {
      theme: "0 0 15px rgba(54, 209, 196, .7)",
    },
    purple: {
      theme: "0 0 15px rgba(128, 0, 128, .7)",
    },
    pink: {
      theme: "0 0 15px rgba(255, 52, 127, .7)",
    },
    default: {
      theme: "0 0 15px rgba(79, 70, 229, .7)",
    },
  }

  return (
    <>

      <colorContext.Provider value={{color, setColor}}>
        <div ref={containerRef} className="container" 
        style={{
          boxShadow: themeStyles[color]?.theme,
        }}>
          <Navbar color={color} />
          <Message color={color} />
        </div>
      </colorContext.Provider>      

    </>
  );
}

export default App;
