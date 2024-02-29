import React, { useState, useEffect, useRef } from 'react';
import './select.scss';
import { categoryOptions } from './constants';
export default function Select(props) {
  const selectRef = useRef(null);
  const [value, setValue] = useState(categoryOptions[0]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    }
  })
  const renderOptions = () => {
    return categoryOptions.map(option => <li key={option.key} className={`option ${option.key !== 'league' && 'disabled'}`} name={option.key} onClick={() => {
      setValue(option);
      setOpenMenu(false);
      props.setMediaType(option.key);
    }
    }>{option.display}</li>);
  }
  return (
      <div className={openMenu ? 'dropdown opened' : 'dropdown'} onClick={() => setOpenMenu(!openMenu)} ref={selectRef}>
        <input id="categoryselect" type="text" placeholder="Pick a technology" readOnly value={value.display} />
        <ul className="options">
          {renderOptions()}
        </ul>
      </div>
  )
}