import React from 'react';
import PodcastSearch from '../../app/Podcast/podCastSearch.jsx';
import TopicsFilter from '../../app/Podcast/topicsFilter.jsx'
import PodcastEpisodes from '../../app/Podcast/PodcastEpisodes.jsx';
import Style from './Listen.module.css';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"; 



const Listen = () => {


  const navigate = useNavigate();

  const podcast = useSelector((state) => state.podcast);

  return (
    <>
      <div className={Style.otherHeroSection}>

      <motion.h1
          initial={{ x: "-100vw", opacity: 0 }} // Starts off-screen
          animate={{ x: 0, opacity: 1 }} // Moves to the center
          transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
        >
Subscribe to <span style={{color: '#deb887ff'}}>Christian Professionals Network</span>
        </motion.h1>
        <motion.h3 initial={{ x: "-100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }} 
        >Our Podcast Channel</motion.h3>


        <motion.p initial={{ x: "100vw", opacity: 0 }} // Starts off-screen (opposite direction)
          animate={{ x: 0, opacity: 1 }} // Moves to the center
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} >
            Listen to inspiring discussions of how your peers have embraced their marketplace calling and continue to seek ways to steward their faith and work toward righteousness.

        </motion.p>
        <div className={Style.icons}>
          <motion.a
          initial={{ x: "100vw", opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
           href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP"><FontAwesomeIcon icon={faSpotify} style={{ color: "#ffff", fontSize: "40px" }} /> <span>Spotify</span></motion.a>
        </div>
      </div>

      <div className={Style.pageContainer}>
        <div className={Style.introText}>
          <h1> What to <span>Listen to</span>
          </h1>
          <p>Be inspired by discussions with business leaders who have embraced their marketplace calling and continue to seek ways to steward what God has given them.</p>
        </div>
      
        <div className={Style.searchContainer}>
          
          <PodcastSearch />
          <TopicsFilter />
        </div>
        <PodcastEpisodes />
      </div>
    </>
  );
};

export default Listen;
