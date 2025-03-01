import React from 'react';
import PodcastSearch from "../app/Podcast/PodcastSearch.jsx";
import TopicsFilter from '../app/Podcast/TopicsFilter.jsx'
import PodcastEpisodes from '../app/Podcast/PodcastEpisodes';
import Styles from '../styles/Home.module.css';
import Style from '../styles/Listen.module.css';
import { useSelector } from 'react-redux';

const Listen = () => {


  const podcast = useSelector((state) => state.podcast);

  return (
    <>
      <div className={Styles.otherHeroSection}>
        <h1>Subscribe to <span style={{color: '#deb887ff'}}>Christian Professionals Network</span></h1>
        <h3>Our Podcast Channel</h3>
        <p>Listen to inspiring discussions of how your peers have embraced their marketplace calling and continue to seek ways to steward their faith and work toward righteousness.</p>

      </div>

      <div className={Style.pageContainer}>
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
