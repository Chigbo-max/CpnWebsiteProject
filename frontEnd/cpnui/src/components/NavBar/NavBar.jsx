import { navBarItems } from '../../helpers/NavBarItems.jsx'
import { Link } from "react-router-dom"
import Logo from "../../assets/ChristianProfessionalsNetwork.png"
import DropDown from "../DropDown/DropDown.jsx"
import ResourcesDropDown from "../../pages/Resources/ResourcesDropDown.jsx"
import { LiaAngleDownSolid } from "react-icons/lia";
import { useDispatch, useSelector } from 'react-redux';
import { setDropDown, setResourcesDropDown, setCoursesDropDown, setOpenLink } from '../../app/navBar/navBarSlice.jsx'
import Switch from "../Switch.jsx"
import CoursesDropDown from "../DropDown/CoursesDropDown/CoursesDropDown.jsx"
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSpotify, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import clubhouseIcon from "../../assets/clubhouse.svg";



const podcastSource = import.meta.env.VITE_PODCAST_SOURCE;
const whatsappLink = import.meta.env.VITE_WHATSAPP_LINK;
const instagramLink = import.meta.env.VITE_INSTAGRAM_LINK;
const clubhouseLink = import.meta.env.VITE_CLUBHOUSE_LINK;


const socialLinks = [
    { icon: faSpotify, url: podcastSource, label: "Spotify" },
    { icon: faWhatsapp, url: whatsappLink, label: "WhatsApp" },
    { icon: faInstagram, url: instagramLink, label: "Instagram" },
    { icon: clubhouseIcon, url: clubhouseLink, label: "Clubhouse", isSvg: true }
];

function NavBar() {
    const dispatch = useDispatch();
    const { dropDown, resourcesDropDown, coursesDropDown, openLink } = useSelector((state) => state.navBar);
    const [mobileCoursesDropdown, setMobileCoursesDropdown] = useState(false);
    const [mobileResourcesDropdown, setMobileResourcesDropdown] = useState(false);
    const [mobileInsideCPNDropdown, setMobileInsideCPNDropdown] = useState(false);
    const [showFollowModal, setShowFollowModal] = useState(false);
    const mobileMenuRef = useRef(null);

    // Close mobile dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
          setMobileCoursesDropdown(false);
          setMobileResourcesDropdown(false);
          setMobileInsideCPNDropdown(false);
        }
      }
      if (mobileCoursesDropdown || mobileResourcesDropdown || mobileInsideCPNDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileCoursesDropdown, mobileResourcesDropdown, mobileInsideCPNDropdown]);

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
                            if (item.title === "Resources") {
                                return (
                                    <li 
                                        key={index} 
                                        className="relative group"
                                        onMouseEnter={() => handleMouseEnter(setResourcesDropDown)}
                                        onMouseLeave={() => handleMouseLeave(setResourcesDropDown)}
                                    >
                                        <Link 
                                            to={item.path}
                                            className="flex items-center gap-1 text-white text-sm lg:text-base font-medium px-2 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                        >
                                            <span>{item.title}</span>
                                            <LiaAngleDownSolid className="text-xs" />
                                        </Link>
                                        <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                                        {resourcesDropDown && <ResourcesDropDown />}
                                    </li>
                                )
                            }
                            if (item.title === "Courses") {
                                return (
                                    <li 
                                        key={index} 
                                        className="relative group"
                                        onMouseEnter={() => handleMouseEnter(setCoursesDropDown)}
                                        onMouseLeave={() => handleMouseLeave(setCoursesDropDown)}
                                    >
                                        <Link 
                                            to={item.path}
                                            className="flex items-center gap-1 text-white text-sm lg:text-base font-medium px-2 py-1 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                        >
                                            <span>{item.title}</span>
                                            <LiaAngleDownSolid className="text-xs" />
                                        </Link>
                                        <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                                        {coursesDropDown && <CoursesDropDown/>}
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
                    <button
                        className="h-8 w-20 lg:h-10 lg:w-24 text-sm lg:text-base font-bold text-gray-900 bg-white rounded-full transition-all duration-300 hover:bg-gray-900 hover:text-white hover:border-2 hover:border-white focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                        onClick={() => setShowFollowModal(true)}
                        aria-label="Follow us on social media"
                    >
                        Follow us
                    </button>
                </div>
                
                {/* Only show toggle on mobile/tablet */}
                <div className="lg:hidden">
                    <Switch open={openLink} onClick={toggleBar} />
                </div>
            </div>
            
            {/* Mobile Menu Overlay */}
            {openLink && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleBar}>
                    <div className="absolute top-20 left-0 w-full bg-gray-900 border-2 border-white rounded-b-xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()} ref={mobileMenuRef}>
                        <ul className="flex flex-col gap-4">
                            {navBarItems.map((item, index) => (
                                <li key={index}>
                                    {item.title === 'Courses' ? (
                                        <>
                                            <button
                                                className="block w-full text-left text-white text-base font-medium px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100 focus:outline-none"
                                                onClick={() => {
                                                    setMobileCoursesDropdown((open) => !open);
                                                    setMobileResourcesDropdown(false);
                                                    setMobileInsideCPNDropdown(false);
                                                }}
                                            >
                                                {item.title}
                                                <LiaAngleDownSolid className="inline ml-2 text-xs" />
                                            </button>
                                            {mobileCoursesDropdown && (
                                                <div className="pl-6 pt-2">
                                                    <CoursesDropDown onItemClick={() => setMobileCoursesDropdown(false)} />
                                                </div>
                                            )}
                                        </>
                                    ) : item.title === 'Resources' ? (
                                        <>
                                            <button
                                                className="block w-full text-left text-white text-base font-medium px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100 focus:outline-none"
                                                onClick={() => {
                                                    setMobileResourcesDropdown((open) => !open);
                                                    setMobileCoursesDropdown(false);
                                                    setMobileInsideCPNDropdown(false);
                                                }}
                                            >
                                                {item.title}
                                                <LiaAngleDownSolid className="inline ml-2 text-xs" />
                                            </button>
                                            {mobileResourcesDropdown && (
                                                <div className="pl-6 pt-2">
                                                    <ResourcesDropDown onItemClick={() => setMobileResourcesDropdown(false)} />
                                                </div>
                                            )}
                                        </>
                                    ) : item.title === 'Inside CPN' ? (
                                        <>
                                            <button
                                                className="block w-full text-left text-white text-base font-medium px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100 focus:outline-none"
                                                onClick={() => {
                                                    setMobileInsideCPNDropdown((open) => !open);
                                                    setMobileCoursesDropdown(false);
                                                    setMobileResourcesDropdown(false);
                                                }}
                                            >
                                                {item.title}
                                                <LiaAngleDownSolid className="inline ml-2 text-xs" />
                                            </button>
                                            {mobileInsideCPNDropdown && (
                                                <div className="pl-6 pt-2">
                                                    <DropDown onItemClick={() => setMobileInsideCPNDropdown(false)} />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link 
                                            to={item.path}
                                            className="block text-white text-base font-medium px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 hover:text-amber-100"
                                            onClick={toggleBar}
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Follow Us Modal */}
            {showFollowModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950 bg-opacity-80 backdrop-blur-sm transition-all duration-300">
                    <div className="relative bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-xs w-full mx-4 animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl focus:outline-none"
                            onClick={() => setShowFollowModal(false)}
                            aria-label="Close social modal"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Follow Us</h2>
                        <div className="flex flex-wrap justify-center gap-6 mb-2">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center group"
                                    aria-label={social.label}
                                >
                                    <span className="bg-gray-800 group-hover:bg-amber-600 text-white p-4 rounded-full transition-all duration-300 shadow-lg mb-2">
                                        {social.isSvg ? (
                                            <img src={social.icon} alt={social.label} className="w-6 h-6" />
                                        ) : (
                                            <FontAwesomeIcon icon={social.icon} className="text-2xl" />
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-300 group-hover:text-amber-400 font-semibold">{social.label}</span>
                                </a>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">Connect with us on your favorite platform!</p>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar
