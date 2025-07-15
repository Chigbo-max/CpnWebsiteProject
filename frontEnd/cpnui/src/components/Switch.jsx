import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLink } from "../app/navBar/navBarSlice";

const Switch = () => {
  const dispatch = useDispatch();
  const openLink = useSelector((state) => state.navBar.openLink);

  const toggleMenu = () => {
    dispatch(setOpenLink(!openLink)); // Toggle Redux state
  };

  return (
    <div className="relative">
      <div id="menuToggle" className="relative">
        <input id="checkbox" type="checkbox" className="hidden" />
        <label 
          className="relative w-10 cursor-pointer mx-auto block h-8" 
          htmlFor="checkbox" 
          onClick={toggleMenu}
        >
          <div className="absolute left-0 right-0 h-1 bg-amber-600 opacity-100 transition-all duration-300 ease-out rounded-sm bar--top" style={{ bottom: 'calc(50% + 11px + 2px)' }}></div>
          <div className="absolute left-0 right-0 h-1 bg-amber-600 opacity-100 transition-all duration-300 ease-out rounded-sm bar--middle" style={{ top: 'calc(50% - 2px)' }}></div>
          <div className="absolute left-0 right-0 h-1 bg-amber-600 opacity-100 transition-all duration-300 ease-out rounded-sm bar--bottom" style={{ top: 'calc(50% + 11px + 2px)' }}></div>
        </label>
      </div>
    </div>
  );
};

export default Switch;
