import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLink } from "../app/navBar/navBarSlice";

const Switch = () => {
  const dispatch = useDispatch();
  const openLink = useSelector((state) => state.navBar.openLink);

  const toggleMenu = () => {
    dispatch(setOpenLink(!openLink)); // Toggle Redux state
  };

  return (
    <StyledWrapper>
      <div id="menuToggle">
        {/* Remove `checked` from input since we're not relying on it */}
        <input id="checkbox" type="checkbox" />
        {/* Add `onClick` directly to the label */}
        <label className="toggle" htmlFor="checkbox" onClick={toggleMenu}>
          <div className="bar bar--top" />
          <div className="bar bar--middle" />
          <div className="bar bar--bottom" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 40px;
    cursor: pointer;
    margin: auto;
    display: block;
    height: calc(4px * 3 + 11px * 2);
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: calc(4px / 2);
    background: burlywood;
    opacity: 1;
    transition: 0.35s cubic-bezier(.5,-0.35,.35,1.5);
  }

  .bar--top {
    bottom: calc(50% + 11px + 4px/ 2);
    transition-property: bottom, transform;
  }

  .bar--middle {
    top: calc(50% - 4px/ 2);
    transition-property: opacity, transform;
  }

  .bar--bottom {
    top: calc(50% + 11px + 4px/ 2);
    transition-property: top, transform;
  }

  #checkbox:checked + .toggle .bar--top {
    transform: rotate(-135deg);
    bottom: calc(50% - 4px/ 2);
  }

  #checkbox:checked + .toggle .bar--middle {
    opacity: 0;
    transform: rotate(-135deg);
  }

  #checkbox:checked + .toggle .bar--bottom {
    top: calc(50% - 4px/ 2);
    transform: rotate(-225deg);
  }
`;

export default Switch;
