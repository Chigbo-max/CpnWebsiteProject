import React from "react";
import Style from "./about.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import icon from "../../assets/clubhouse.svg";
import bgImage from "../../assets/cpnevent1.jpg"

function About() {
  return (
    <div className={Style.aboutContainer}>
      <div className={Style.otherHeroSection}
      style={{
        background: `linear-gradient(rgba(61, 35, 27, 0.85), rgba(61, 35, 27, 0.85)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <header className={Style.heroHeader}>
          <h1>About <span>Christian Professionals Network</span></h1>
        </header>
      </div>

      <section className={Style.contentSection}>
        <div className={Style.missionBlock}>
          <h2>Our Mission</h2>
          <p>
            Christian Professionals Network (CPN) is a platform to mentor and raise excellent, ethical professionals who will take over their industries and workplaces for The Kingdom, using practical Bible-based principles to rise to positions of influence and power.
          </p>
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
            <FontAwesomeIcon icon={faSpotify} className={Style.icon} />
            <p>Listen to our podcast on Spotify</p>
          </a>
          <a href="https://www.clubhouse.com/house/christian-professionals-network" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
            <img src={icon} className={Style.clubhouseIcon} alt="Clubhouse Icon" />
            <p>Join our Clubhouse room</p>
          </a>
          <a href="https://www.instagram.com/christianprofessionalsnetwork/" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
            <FontAwesomeIcon icon={faInstagram} className={Style.icon} />
            <p>Follow us on Instagram</p>
          </a>
          <a href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ" target="_blank" rel="noopener noreferrer" className={Style.platformCard}>
            <FontAwesomeIcon icon={faWhatsapp} className={Style.icon} />
            <p>Join our WhatsApp group</p>
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

      <section className={Style.testimonialsSection}>
        <h2>We look forward to sharing in your success story!</h2>
        <div className={Style.testimonialsGrid}>
          <div className={Style.testimonialCard}>
            <p>"I have a clearer knowledge of how to stand for Christ at work and everyday life, with my career as a platform."</p>
            <h4>- Ezinne Umozurike. USA</h4>
          </div>
          <div className={Style.testimonialCard}>
            <p>"CPN has taught me how to thrive in my career, by applying bible based principles. The podcasts are always relatable and timely."</p>
            <h4>- Chika Bob-Agomoh. LAGOS</h4>
          </div>
          <div className={Style.testimonialCard}>
            <p>"It's been amazing. The gift of access to fellow Christians walking same path as been encouraging. "</p>
            <h4>- Femi Oke IBADAN.</h4>
          </div>
        </div>
      </section>

      <section className={Style.contactSection}>
        <h2>Connect With Us</h2>
        <div className={Style.contactContent}>
          <p><strong>Call or WhatsApp:</strong> <a href="tel:+2347033288115">+234 703 328 8115</a></p>
          <p><strong>Email:</strong> <a href="mailto:cprofessionalsnetwork@gmail.com">cprofessionalsnetwork@gmail.com</a></p>
          <p>💬 <strong>Follow us on social media:</strong> Stay updated with our latest programs!</p>
          <div className={Style.followUs}>
          <a href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP" target="_blank" rel="noopener noreferrer" className={Style.followUs}>
            <FontAwesomeIcon icon={faSpotify} className={Style.followUsIcon} />
          </a>
          <a href="https://www.clubhouse.com/house/christian-professionals-network" target="_blank" rel="noopener noreferrer" className={Style.followUs}>
            <img src={icon} className={Style.clubhouseIcon2} alt="Clubhouse Icon" />
          </a>
          <a href="https://www.instagram.com/christianprofessionalsnetwork/" target="_blank" rel="noopener noreferrer" className={Style.followUs}>
            <FontAwesomeIcon icon={faInstagram} className={Style.followUsIcon} />
          </a>
          <a href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ" target="_blank" rel="noopener noreferrer" className={Style.followUs}>
            <FontAwesomeIcon icon={faWhatsapp} className={Style.followUsIcon} />
          </a>
        </div>
        </div>
      </section>

      
    </div>
  );
}

export default About;
