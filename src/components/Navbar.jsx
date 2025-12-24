import React, { useContext, useEffect } from 'react'
import '../css/navbar.css'
import { useState, useRef } from 'react'
import { colorContext } from '../Context/context'


const Navbar = ({color}) => {

  const [vissible, setVissible] = useState(false)
  const colorCall = useContext(colorContext);

  const toggleDropdown = () => {
    setVissible(!vissible);
  };

  const navbarRef = useRef();
  const dropdownRef = useRef();

  if (color === "green") {
    navbarRef.current.style.background = "#4ef037";
    dropdownRef.current.style.borderColor = "#4ef037";
    dropdownRef.current.style.boxShadow = "0 0 10px 5px rgba(78, 240, 55, .3)";
  } else if (color === "blue") {
    navbarRef.current.style.background = "#36d1c4";
    dropdownRef.current.style.borderColor = "#36d1c4";
    dropdownRef.current.style.boxShadow = "0 0 10px 5px rgba(54, 209, 196, .3)";
  } else if (color === "purple") {
    navbarRef.current.style.background = "purple";
    dropdownRef.current.style.borderColor = "purple";
    dropdownRef.current.style.boxShadow = "0 0 10px 5px rgba(128, 0, 128, .3)";
  } else if (color === "pink") {
    navbarRef.current.style.background = "#ff347f";
    dropdownRef.current.style.borderColor = "#ff347f";
    dropdownRef.current.style.boxShadow = "0 0 10px 5px rgba(255, 52, 127, .3)";
  } else if (color === "default") {
    navbarRef.current.style.background = "#4F46E5";
    dropdownRef.current.style.borderColor = "#4F46E5";
    dropdownRef.current.style.boxShadow = "0 0 10px 5px rgba(79, 70, 229, .3)";
  } else if (color === "black") {
    navbarRef.current.style.background = "#000";
    dropdownRef.current.style.borderColor = "#000";
    dropdownRef.current.style.boxShadow = "0 0 10px 5px rgba(0, 0, 0, 0.3)";
  }


   // Function to handle clicks outside the dropdown
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) && // Click is outside the dropdown
        !event.target.closest(".bx-menu-alt-right") // Click is not on the menu button
      ) {
        setVissible(false);
      }
    };

    // Add event listener when dropdown is visible
    if (vissible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [vissible]);
  
  return (

    <>


      <div ref={navbarRef} className='navbar'>
        <div className='navbar-content'>
          <svg className='svg2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill='white' ><path fillRule="evenodd" clipRule="evenodd" d="M8.48 4h4l.5.5v2.03h.52l.5.5V8l-.5.5h-.52v3l-.5.5H9.36l-2.5 2.76L6 14.4V12H3.5l-.5-.64V8.5h-.5L2 8v-.97l.5-.5H3V4.36L3.53 4h4V2.86A1 1 0 0 1 7 2a1 1 0 0 1 2 0 1 1 0 0 1-.52.83V4zM12 8V5H4v5.86l2.5.14H7v2.19l1.8-2.04.35-.15H12V8zm-2.12.51a2.71 2.71 0 0 1-1.37.74v-.01a2.71 2.71 0 0 1-2.42-.74l-.7.71c.34.34.745.608 1.19.79.45.188.932.286 1.42.29a3.7 3.7 0 0 0 2.58-1.07l-.7-.71zM6.49 6.5h-1v1h1v-1zm3 0h1v1h-1v-1z"/></svg>

          <h1 className="heading">Chatbot Ai</h1>
        </div>

        <div className='dropdown-main'>
          <i className='bx bx-menu-alt-right' onClick={toggleDropdown}></i>

          <div ref={dropdownRef} className={`dropdown ${vissible ? 'visible' : 'hidden'}`}>
            {/* Default Color */}
            <li 
              onClick={() => colorCall.setColor(colorCall.color = "default")} 
              className='list'> Default 
              <span className='default-dot dot'></span> 
            </li>

            {/* Green Color */}
            <li 
              onClick={() => colorCall.setColor(colorCall.color = "green")} 
              className='list1'>Green 
              <span className='green-dot dot'></span> 
            </li>
            
            {/* Blue Color */}
            <li 
               onClick={() => colorCall.setColor(colorCall.color = "blue")} 
              className='list2'>Blue 
              <span className='blue-dot dot'></span> 
            </li>
            
            {/* Purple Color */}
            <li 
               onClick={() => colorCall.setColor(colorCall.color = "purple")} 
              className='list3'>Purple 
              <span className='purple-dot dot'></span> 
            </li>
            
            {/* Pink Color */}
            <li 
               onClick={() => colorCall.setColor(colorCall.color = "pink")} 
              className='list4'>Pink 
              <span className='pink-dot dot'></span> 
            </li>

          </div>
        </div>
      </div>


    </>

  )
}

export default Navbar
