import React from 'react'
import { useState } from 'react'
import { communityDropDownItems } from "./CommunityDropDownItems"
import { Link } from 'react-router-dom'
import style from "./CommunityDropDown.module.css"


function CommunityDropDown() {
    const[dropDown, setDropDown] = useState(false);

  return (
    <div>
      <ul onClick={() => setDropDown(!dropDown)} className={dropDown ? style.drop_down_clicked : style.drop_down}>
            {communityDropDownItems.map((item, index) => {
                return (
                    <li key={index} className={item.cName}>
                        <Link to={item.path} onClick ={()=>setDropDown(false)}>{item.title}</Link>
                    </li>
                )   
            })}
      </ul>
    </div>
  )
}

export default CommunityDropDown













