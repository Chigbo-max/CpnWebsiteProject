import React from 'react'
import { navBarItems } from '../../helpers/NavBarItems.jsx'
import { Link } from "react-router-dom"
import Logo from "../../assets/ChristianProfessionalsNetwork.png"
import style from "./NavBar.module.css"
import DropDown from "../DropDown/DropDown.jsx"
import KnowledgeHubDropDown from "../../pages/knowledgeHub/KnowledgeHubDropDown.jsx"
import { LiaAngleDownSolid, LiaBarsSolid } from "react-icons/lia";
import { IndeterminateCheckBoxRounded } from '@mui/icons-material'
import CommunityDropDown from '../DropDown/CommunityDropDown/CommunityDropDown.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { setDropDown, setKnowledgeHubDropDown, setCommunityDropDown, setOpenLink } from '../../app/navBar/navBarSlice.jsx'


function NavBar() {
    const dispatch = useDispatch();
    const { dropDown, knowledgeHubDropDown, communityDropDown, openLink } = useSelector((state) => state.navBar);

    // const[dropDown, setDropDown] = useState(false);
    // const[openLink, setOpenLink] = useState(false);
    // const[knowledgeHubDropDown, setKnowledgeHubDropDown] = useState(false);
    // const[communityDropDown, setCommunityDropDown] = useState(false);

    function toggleBar() {
        dispatch(setOpenLink(!openLink));
    };

    return (

        <nav>
            <div className={style.navBar}>
                <div className={style.logo}>
                    <Link to="/"> <img src={Logo} /> </Link>
                </div>
                <div >
                    <ul className={`${style.navBarOptions} ${openLink ? style.open : ''}`}>
                        {navBarItems.map((item, index) => {

                            if (item.title === "Inside CPN") {
                                return (

                                    <li key={index} className={item.cName}
                                        onMouseEnter={() => dispatch(setDropDown(true))}
                                        onMouseLeave={() => dispatch(setDropDown(false))}>
                                        <Link to={item.path}>{item.title}<LiaAngleDownSolid /></Link>
                                        {dropDown && <DropDown />}
                                    </li>
                                )
                            }


                            if (item.title === "Knowledge Hub") {
                                return (
                                    <li key={index} className={item.cName}
                                        onMouseEnter={() => dispatch(setKnowledgeHubDropDown(true))}
                                        onMouseLeave={() => dispatch(setKnowledgeHubDropDown(false))}>
                                        <Link to={item.path}>{item.title}<LiaAngleDownSolid /></Link>
                                        {knowledgeHubDropDown && <KnowledgeHubDropDown />}
                                    </li>
                                )
                            }

                            if (item.title === "Community") {
                                return (
                                    <li key={index} className={item.cName}
                                        onMouseEnter={() => dispatch(setCommunityDropDown(true))}
                                        onMouseLeave={() => dispatch(setCommunityDropDown(false))}>
                                        <Link to={item.path}>{item.title}<LiaAngleDownSolid /></Link>
                                        {communityDropDown && <CommunityDropDown />}
                                    </li>
                                )
                            }

                            return (
                                <li stlye={IndeterminateCheckBoxRounded} key={index} className={item.cName}>
                                    <div className={style.displayItems}>
                                        <Link to={item.path}>{item.title}{item.title === "Inside CPN" ? <LiaAngleDownSolid /> : ""}</Link>
                                    </div>

                                </li>
                            )

                        })}
                    </ul>

                </div>
                <div className={style.followButton}>
                    <Link to="/" > <button>Follow us</button></Link>
                </div>
                <div onClick={toggleBar} className={style.hiddenButton}>
                    <button><LiaBarsSolid /></button>
                </div>
            </div>
        </nav>




    )
}

export default NavBar
