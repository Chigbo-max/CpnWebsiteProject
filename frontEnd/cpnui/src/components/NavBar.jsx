import React from 'react'
import { navBarItems } from '../helpers/NavBarItems'
import { Link } from "react-router-dom"
import Logo from "../assets/ChristianProfessionalsNetwork.png"
import style from "../styles/NavBar.module.css"
import DropDown from "./DropDown.jsx"
import BusinessDropDown from "./BuisnessDropDown.jsx"
import { LiaAngleDownSolid,LiaBarsSolid} from "react-icons/lia";
import {useState} from "react";
import { IndeterminateCheckBoxRounded } from '@mui/icons-material'


function NavBar() {

    const[dropDown, setDropDown] = useState(false);
    const[openLink, setOpenLink] = useState(false);
    const[businessDropDown, setBusinessDropDown] = useState(false);

    function toggleBar(){
        setOpenLink(!openLink)
    }

    return (

        
        <nav>   
           <div className={style.navBar}>
            <div className={style.logo}>
               <Link to = "/"> <img src={Logo} /> </Link>
            </div>
            <div >
                <ul className={`${style.navBarOptions} ${openLink ? style.open : ''}`}>
                {navBarItems.map((item,index)=>{

                    if(item.title === "About"){
                        return (
                            
                            <li key={index} className = {item.cName}
                            onMouseEnter ={()=>setDropDown(true)}
                            onMouseLeave = {()=>setDropDown(false)}>
                            <Link to={item.path}>{item.title}<LiaAngleDownSolid/></Link>
                            {dropDown && <DropDown />}
                            </li>
                             )
                    }


                    if(item.title === "Knowledge Hub"){
                        return (
                            <li key={index} className = {item.cName}
                            onMouseEnter ={()=>setBusinessDropDown(true)}
                            onMouseLeave = {()=>setBusinessDropDown(false)}>
                                <Link to={item.path}>{item.title}<LiaAngleDownSolid/></Link>
                                {businessDropDown && <BusinessDropDown/>}
                            </li>
                        )
                    }

                return (
                    <li key={IndeterminateCheckBoxRounded} className = {item.cName}>
                        <div className={style.displayItems}>
                        <Link to={item.path}>{item.title}{item.title === "About" ? <LiaAngleDownSolid/> : ""}</Link>
                        </div>
                        
                    </li>
                )
            
                })}
                </ul>
                
            </div>
            <div className={style.followButton}>
           <Link to= "/" > <button>Follow us</button></Link>
            </div>
            <div onClick = {toggleBar}className={style.hiddenButton}>
            <button><LiaBarsSolid/></button>
            </div>
        </div>
        </nav>
                


        
    )
}

export default NavBar
