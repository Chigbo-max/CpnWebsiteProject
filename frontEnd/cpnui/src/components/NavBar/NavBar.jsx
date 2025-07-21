import { navBarItems } from '../../helpers/NavBarItems.jsx'
import { Link } from "react-router-dom"
import Logo from "../../assets/ChristianProfessionalsNetwork.png"
import DropDown from "../DropDown/DropDown.jsx"
import KnowledgeHubDropDown from "../../pages/knowledgeHub/KnowledgeHubDropDown.jsx"
import { LiaAngleDownSolid } from "react-icons/lia";
import { useDispatch, useSelector } from 'react-redux';
import { setDropDown, setKnowledgeHubDropDown, setOpenLink } from '../../app/navBar/navBarSlice.jsx'
import Switch from "../Switch.jsx"
import CoursesDropDown from "../DropDown/CoursesDropDown/CoursesDropDown.jsx"

function NavBar() {
    const dispatch = useDispatch();
    const { dropDown, knowledgeHubDropDown, openLink } = useSelector((state) => state.navBar);

    function toggleBar() {
        dispatch(setOpenLink(!openLink));
    };

    const handleMouseEnter = (dropdownType) => {
        dispatch(dropdownType(true));
    };

    const handleMouseLeave = (dropdownType) => {
        // Add a small delay to allow users to move to the dropdown
        setTimeout(() => {
            dispatch(dropdownType(false));
        }, 150);
    };

    return (
        <nav className="w-full">
            <div className="flex justify-center items-center gap-8 lg:gap-16 xl:gap-24 w-full h-20 lg:h-24 fixed top-0 left-0 z-50 bg-gray-900 px-4 sm:px-6 lg:px-8">
                <div className="flex-shrink-0">
                    <Link to="/" className="block">
                        <img src={Logo} alt="CPN Logo" className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto" />
                    </Link>
                </div>
                
                <div className="flex-1 flex justify-center">
                    {/* Only show nav items inline on large screens */}
                    <ul className={"hidden lg:flex justify-around items-center list-none gap-4 sm:gap-6 lg:gap-8"}>
                        {navBarItems.map((item, index) => {
                            if (item.title === "Inside CPN") {
                                return (
                                    <li 
                                        key={index} 
                                        className="relative group"
                                        onMouseEnter={() => handleMouseEnter(setDropDown)}
                                        onMouseLeave={() => handleMouseLeave(setDropDown)}
                                    >
                                        <div className="flex items-center gap-1 text-white text-sm lg:text-base font-medium cursor-pointer px-2 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100">
                                            <span>{item.title}</span>
                                            <LiaAngleDownSolid className="text-xs" />
                                        </div>
                                        <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                                        {dropDown && <DropDown />}
                                    </li>
                                )
                            }
                            if (item.title === "Knowledge Hub") {
                                return (
                                    <li 
                                        key={index} 
                                        className="relative group"
                                        onMouseEnter={() => handleMouseEnter(setKnowledgeHubDropDown)}
                                        onMouseLeave={() => handleMouseLeave(setKnowledgeHubDropDown)}
                                    >
                                        <Link 
                                            to={item.path}
                                            className="flex items-center gap-1 text-white text-sm lg:text-base font-medium px-2 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                        >
                                            <span>{item.title}</span>
                                            <LiaAngleDownSolid className="text-xs" />
                                        </Link>
                                        <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                                        {knowledgeHubDropDown && <KnowledgeHubDropDown />}
                                    </li>
                                )
                            }
                            if (item.title === "Courses") {
                                return (
                                    <li 
                                        key={index} 
                                        className="relative group"
                                    >
                                        <Link 
                                            to={item.path}
                                            className="flex items-center gap-1 text-white text-sm lg:text-base font-medium px-2 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                        >
                                            <span>{item.title}</span>
                                            <LiaAngleDownSolid className="text-xs" />
                                        </Link>
                                        <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                                        <CoursesDropDown />
                                    </li>
                                )
                            }
                            return (
                                <li key={index} className="relative">
                                    <Link 
                                        to={item.path}
                                        className="text-white text-sm lg:text-base font-medium px-2 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                
                <div className="hidden lg:block">
                    <Link to="/">
                        <button className="h-8 w-20 lg:h-10 lg:w-24 text-sm lg:text-base font-bold text-gray-900 bg-white rounded-full transition-all duration-300 hover:bg-gray-900 hover:text-white hover:border-2 hover:border-white focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50">
                            Follow us
                        </button>
                    </Link>
                </div>
                
                {/* Only show toggle on mobile/tablet */}
                <div className="lg:hidden">
                    <Switch open={openLink} onClick={toggleBar} />
                </div>
            </div>
            
            {/* Mobile Menu Overlay */}
            {openLink && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleBar}>
                    <div className="absolute top-20 left-0 w-full bg-gray-900 border-2 border-white rounded-b-xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
                        <ul className="flex flex-col gap-4">
                            {navBarItems.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        to={item.path}
                                        className="block text-white text-base font-medium px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                        onClick={toggleBar}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar
