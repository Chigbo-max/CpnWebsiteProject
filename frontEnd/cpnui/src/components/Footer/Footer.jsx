import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faFacebook, faInstagram, faSpotify, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import FooterLogo from "../../assets/ChristianProfessionalsNetwork.png";
import { Link } from "react-router-dom";

const quickLinks = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "Community", path: "/community" },
    { title: "Knowledge Hub", path: "/knowledgeHub" },
    { title: "Events", path: "/events" },
    { title: "Contact Us", path: "/contactUs" }
];

const resources = [
    { title: "Latest Podcast", path: "/knowledgeHub/listen" },
    { title: "Blog Articles", path: "/blog" },
    { title: "Leadership Resources", path: "/knowledgeHub" },
    { title: "Bible Study Series", path: "/events" },
    { title: "Professional Development", path: "/knowledgeHub" }
];

const socialLinks = [
    { icon: faSpotify, url: "https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP", label: "Spotify" },
    { icon: faWhatsapp, url: "https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ", label: "WhatsApp" },
    { icon: faInstagram, url: "https://www.instagram.com/christianprofessionalsnetwork/", label: "Instagram" },
    { icon: faFacebook, url: "#", label: "Facebook" },
    { icon: faSquareXTwitter, url: "#", label: "Twitter" }
];

function Footer() {
    return (
        <footer className="bg-gray-900 text-white w-full">
            {/* Main Footer Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        
                        {/* Company Info */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <img 
                                src={FooterLogo} 
                                alt="CPN Logo" 
                                className="w-32 sm:w-40 h-auto mb-4 sm:mb-6"
                            />
                            <p className="text-gray-300 text-sm leading-relaxed mb-4 sm:mb-6">
                                Empowering professionals to excel in their industries through biblical principles, 
                                ethical leadership, and Kingdom-focused excellence.
                            </p>
                            <div className="flex space-x-3 sm:space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-800 hover:bg-amber-600 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                                        aria-label={social.label}
                                    >
                                        <FontAwesomeIcon icon={social.icon} className="text-sm sm:text-lg" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="sm:col-span-1">
                            <h3 className="text-base sm:text-lg font-bold text-amber-400 mb-4 sm:mb-6">Quick Links</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {quickLinks.concat([
                                    { title: "Terms of Service", path: "/terms" },
                                    { title: "Privacy Policy", path: "/privacy" }
                                ]).map((link, idx) => (
                                    <li key={idx}>
                                        <Link 
                                            to={link.path}
                                            className="text-gray-300 hover:text-amber-400 transition-colors duration-200 block py-1"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="sm:col-span-1">
                            <h3 className="text-base sm:text-lg font-bold text-amber-400 mb-4 sm:mb-6">Resources</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {resources.map((resource, index) => (
                                    <li key={index}>
                                        <Link 
                                            to={resource.path}
                                            className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                                        >
                                            {resource.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Information */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <h3 className="text-base sm:text-lg font-bold text-amber-400 mb-4 sm:mb-6">Contact Info</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-start space-x-3">
                                    <FontAwesomeIcon icon={faPhone} className="text-amber-400 mt-1 text-sm" />
                                    <div>
                                        <p className="text-gray-300 text-sm font-medium">Phone</p>
                                        <p className="text-gray-400 text-sm">+234 703 328 8115</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-amber-400 mt-1 text-sm" />
                                    <div>
                                        <p className="text-gray-300 text-sm font-medium">Email</p>
                                        <p className="text-gray-400 text-sm">cprofessionalsnetwork@gmail.com</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <FontAwesomeIcon icon={faClock} className="text-amber-400 mt-1 text-sm" />
                                    <div>
                                        <p className="text-gray-300 text-sm font-medium">Prayer Time</p>
                                        <p className="text-gray-400 text-sm">Wednesdays 5AM (WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                            <div className="text-center sm:text-left">
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    &copy; 2025 Christian Professionals Network. All Rights Reserved.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
                                <Link to="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                                    Terms of Service
                                </Link>
                                <Link to="/contactUs" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                                    Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;