import React from "react";
import { motion } from "framer-motion"; 
import Style from "./knowledgehub.module.css";
import podcast from "../../assets/cpnPodcast.png";
import SoundWave from "../../assets/soundWave.png";
import read from "../../assets/cpnRead.png";
import bgImage from "../../assets/listen.jpeg";

function KnowledgeHub() {
  return (
    <div className={Style.knowledgeContainer}>
      <div
        className={Style.otherHeroSection}
        style={{
          background: `linear-gradient(rgba(61, 35, 27, 0.85), rgba(61, 35, 27, 0.85)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.h1
          initial={{ x: "-100vw", opacity: 0 }} // Starts off-screen
          animate={{ x: 0, opacity: 1 }} // Moves to the center
          transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
        >
          Knowledge Hub
        </motion.h1>

        <motion.p
          initial={{ x: "100vw", opacity: 0 }} // Starts off-screen (opposite direction)
          animate={{ x: 0, opacity: 1 }} // Moves to the center
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} // Delay for smooth entrance
        >
          CPN offers free access to high-quality, biblically-aligned resources
          that provide practical insights for conducting Kingdom business
          across the globe.
        </motion.p>
      </div>

      <div className={Style.latestPodcast}>
        <div className={Style.latestPodcastLeftSide}>
          <img src={podcast} alt="Podcast" />
        </div>
        <div className={Style.latestPodcastRightSide}>
          <h4>Latest Podcast</h4>
          <h5>How to be a good leader</h5>
          <p>
            Leadership is a skill that can be learned. Here are some tips on how
            to be a good leader.
          </p>
          <button onClick={() => navigate("/knowledgeHub/listen")}>
            LISTEN NOW &rarr;
          </button>
          <img src={SoundWave} alt="Sound Wave" />
        </div>
      </div>

      <div className={Style.latestRead}>
        <div className={Style.latestReadLeftSide}>
          <img src={read} alt="Read" />
        </div>
        <div className={Style.latestReadRightSide}>
          <h4>Latest Read</h4>
          <h5>How to be a good leader</h5>
          <p>
            Leadership is a skill that can be learned. Here are some tips on how
            to be a good leader.
          </p>
          <button onClick={() => navigate("/knowledgeHub/listen")}>
            VIEW SERIES &rarr;
          </button>
          <p>A CPN INITIATIVE</p>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeHub;
