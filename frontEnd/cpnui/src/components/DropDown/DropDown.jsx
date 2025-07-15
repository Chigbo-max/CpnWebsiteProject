import React from 'react'
import {dropDownItems} from "./DropDownItems"
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setDropDown } from '../../app/navBar/navBarSlice'

function DropDown() {
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    dispatch(setDropDown(true));
  };

  const handleMouseLeave = () => {
    // Add a small delay to allow users to move back to the navbar item
    setTimeout(() => {
      dispatch(setDropDown(false));
    }, 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="list-none bg-amber-50 w-40 p-3 rounded-xl shadow-2xl block absolute top-full left-0 mt-0 z-50 transition-all duration-200">
        {dropDownItems.map((item, index) => (
          <li key={index} className="p-2 border-b-2 border-white rounded bg-gray-900 mb-1 last:mb-0">
            <Link 
              to={item.path} 
              className="text-white text-sm font-medium no-underline hover:text-amber-100 transition-colors duration-300 block px-2 py-1"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DropDown
