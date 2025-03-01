import React from "react";
import Style from "./Features.module.css";
import {Link} from "react-router-dom"
import banner from "../../assets/cpnBanner.png"
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBook, FaCalendarAlt } from "react-icons/fa";
import {motion} from "framer-motion";

const Features = () => {

  const navigate = useNavigate();


  return (
    <section className={Style.features}>
      <div className={Style.feature_cards}>
        <div 
          className={Style.imageContainer}
        ><img src={banner} /></div>
        <div className={Style.textContainer}>
          <h5>ABOUT CPN</h5>
          <h2>Empowering Professionals for <span>Kingdom Impact</span></h2>
          <p>
            Christian Professionals Network (CPN) is a platform to mentor and raise
            excellent and ethical professionals, who will take over their industries
            and the workplace for The Kingdom, using practical Bible-based principles
            to rise to positions of influence and power in the workplace.
          </p>
          <div className= {Style.about_button}>
          <Link to ="/insideCPN/about">LEARN MORE &rarr;</Link>
          </div>
        </div>
      </div>
      <div className={Style.threeFeatures}>
        <div className={Style.threeFeaturesBox} onClick ={()=>navigate("/community")} >
        <motion.div 
            className={Style.featureIcon}
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          >
        <FaUsers />
        </motion.div>
          <h3>Community</h3>
          <p>Find resources to equip and conect your community.</p>
        </div>
        <div className={Style.threeFeaturesBox} onClick ={()=>navigate("/knowledgeHub")} >
          <motion.div 
            className={Style.featureIcon} 
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          >
          
          <FaBook/>
          </motion.div>
          <h3>Knowledge Hub</h3>
          <p>Explore our free biblically-aligned resources.</p>
        </div>
        <div className={Style.threeFeaturesBox} onClick ={()=>navigate("/events")} >
        <motion.div 
            className={Style.featureIcon}
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          >
        <FaCalendarAlt/>
        </motion.div>
          <h3>Events</h3>
          <p>Engage with passionate Christian professionals.</p>
        </div>
      </div>
      <iframe style={{borderRadius:"12px"}} src="https://open.spotify.com/embed/episode/5l3Qlf25FxAblRXsKtEkQC?utm_source=generator" width="25%" height="300" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>    </section>
  );
};

export default Features;