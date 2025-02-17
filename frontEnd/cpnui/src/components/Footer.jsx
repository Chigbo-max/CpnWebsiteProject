import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import FooterLogo from "../assets/ChristianProfessionalsNetwork.png";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const list = [
    { title: "Community", path: "/community" },
    { title: "Knowledge Hub", path: "/knowledgeHub" },
    { title: "Events", path: "/events" },
    { title: "Contact us", path: "/contactUs" },
    { title: "About", path: "/about" }
];

function Footer() {
    return (
        <div className="footer">
            <div className="leftSideFooter">
                <img src={FooterLogo} alt="Footer Logo" />
                <ul className="footerLinks">
                    <h3>Explore</h3>
                    {list.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path}><h5>{item.title}</h5></Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="rightSideFooter">
                <div className="contact">
                    <p>Contact with us</p>
                    <p>+2347033288115</p>
                    <p>cpnrofessionalsnetwork@gmail.com</p>
                    <div className="socials">
                        <Link to="/"><FontAwesomeIcon icon={faInstagram} style={{ color: "#F5F5DC" }} /></Link>
                        <Link to="/"><FontAwesomeIcon icon={faFacebook} style={{ color: "#F5F5DC" }} /></Link>
                        <Link to="/"><FontAwesomeIcon icon={faSquareXTwitter} style={{ color: "#F5F5DC" }} /></Link>
                    </div>
                    <div className="copyRight">
                        <p>&copy; 2025 CPN. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;