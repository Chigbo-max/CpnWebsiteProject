import React, { useState } from 'react'
import { KnowledgeHubDropDownItems } from "./KnowledgeHubDropDownItems"
import { Link } from 'react-router-dom'
import style from "../../components/DropDown/DropDown.module.css"

function KnowledgeHubDropDown() {

    const [dropDown, setDropDown] = useState(false);

    return (
        <div>
            <ul className={dropDown ? style.drop_down_clicked : style.drop_down} onClick={() => setDropDown(!dropDown)}>
                {KnowledgeHubDropDownItems.map((item, index) => {
                    return <li key= {index} className={item.cName} >
                        <Link to={item.path} onClick={() => setDropDown(false)} >{item.title}</Link>
                    </li>

                })}
            </ul>


        </div>
    )
}

export default KnowledgeHubDropDown










