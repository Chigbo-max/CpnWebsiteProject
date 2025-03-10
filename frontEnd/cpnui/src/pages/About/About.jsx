import React from 'react';
import Style from "./about.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faInstagram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
// import { faInstagram, faWhatsapp, faClubhouse } from 'react-icons/fa';

import icon from '../../assets/clubhouse.svg';

function About() {
  return (
    <div className={Style.aboutContainer}>
      <div className={Style.otherHeroSection}>
      <header className={Style.heroHeader}>
          <h1>About Christian Professionals Network</h1>
        </header>
   
    </div>
  

      <section className={Style.contentSection}>
        <div className={Style.missionBlock}>
          <h2>Our Mission</h2>
          <p>Christian Professionals Network (CPN) is a platform to mentor and raise excellent, ethical professionals who will take over their industries and workplaces for The Kingdom, using practical Bible-based principles to rise to positions of influence and power.</p>
        </div>

        <div className={Style.detailsGrid}>
          <div className={Style.detailCard}>
            <h3>Founded</h3>
            <p>February 13, 2022</p>
          </div>
          <div className={Style.detailCard}>
            <h3>Our Vision</h3>
            <p>Rising ethical professionals who thrive in their industries through practical Bible-based principles</p>
          </div>
          <div className={Style.detailCard}>
            <h3>Our Promise</h3>
            <p>GOSHEN - Divine protection and favor (Exodus 8:20-23)</p>
          </div>
        </div>
      </section>

      <section className={Style.platformsSection}>
        <h2>Our Platforms</h2>
        <div className={Style.platformsGrid}>
          <a href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
          <FontAwesomeIcon icon={faSpotify} style={{ color: "#3d231b", fontSize: "40px" }} />
          </a>
          <a href="https://www.clubhouse.com/house/christian-professionals-network" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
          {/* < FontAwesomeIcon icon={faClubhouse} className="w-8 h-8" /> */}
        <img src={icon} style={{width: 40}} alt="" />
          </a>
          <a href="https://www.instagram.com/christianprofessionalsnetwork/" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
          <FontAwesomeIcon icon={faInstagram} style={{ color: "#3d231b", fontSize: "40px" }} />
          </a>
          <a href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
          <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#3d231b", fontSize: "40px" }}  />
          </a>
        </div>
      </section>

      <section className={Style.activitiesSection}>
        <h2>Weekly Activities</h2>
        <div className={Style.activitiesGrid}>
          <div className={Style.activityCard}>
            <h3>Prayers</h3>
            <p>Wednesdays 5AM (WhatsApp)</p>
          </div>
          <div className={Style.activityCard}>
            <h3>Podcast</h3>
            <p>Thursdays (All platforms)</p>
          </div>
          <div className={Style.activityCard}>
            <h3>Mentorship</h3>
            <p>Monthly Zoom Sessions</p>
          </div>
        </div>
      </section>

      <section className={Style.contactSection}>
        <h2>Connect With Us</h2>
        <div className={Style.contactContent}>
          <p>Have questions? Reach out to:</p>
          <p>Hadassah: <a href="tel:+2347033288115">+234 703 328 8115</a></p>
          <p>Email: <a href="mailto:cprofessionalsnetwork@gmail.com">cprofessionalsnetwork@gmail.com</a></p>
        </div>
      </section>

      <footer className={Style.footer}>
        <p>We look forward to sharing in your success story! 🙌</p>
      </footer>
    </div>
  );
}

export default About;