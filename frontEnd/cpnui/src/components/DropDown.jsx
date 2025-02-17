import React, { useState } from 'react'
import {dropDownItems} from "../helpers/DropDownItems.jsx"
import { Link } from 'react-router-dom'
import style from "../styles/DropDown.module.css"


function DropDown() {
  const [dropDown, setDropDown] = useState(false);

  return (
    <div>
        <ul className={dropDown ? style.drop_down_clicked : style.drop_down} onClick={() => setDropDown(!dropDown)}>
            {dropDownItems.map((item) => {
                return <li key={item.id}className ={item.cName} >
                    <Link to={item.path} onClick={()=> setDropDown(false)} >{item.title}</Link>
                    </li>

})}
        </ul>
      
    </div>
  )
}

export default DropDown
