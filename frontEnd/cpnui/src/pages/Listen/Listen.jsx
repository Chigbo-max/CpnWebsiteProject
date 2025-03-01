import React from 'react';
import PodcastSearch from '../../app/Podcast/podCastSearch.jsx';
import TopicsFilter from '../../app/Podcast/topicsFilter.jsx'
import PodcastEpisodes from '../../app/Podcast/PodcastEpisodes.jsx';
import Style from './Listen.module.css';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from 'react-router-dom';


const Listen = () => {


  const navigate = useNavigate();

  const podcast = useSelector((state) => state.podcast);

  return (
    <>
      <div className={Style.otherHeroSection}>
        <h1>Subscribe to <span style={{color: '#deb887ff'}}>Christian Professionals Network</span></h1>
        <h3>Our Podcast Channel</h3>
        <p>Listen to inspiring discussions of how your peers have embraced their marketplace calling and continue to seek ways to steward their faith and work toward righteousness.</p>
        <div className={Style.icons}>
          <a href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP"><FontAwesomeIcon icon={faSpotify} style={{ color: "#ffff", fontSize: "40px" }} /> <span>Spotify</span></a>
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
