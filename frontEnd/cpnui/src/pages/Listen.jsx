import Styles from "../styles/Home.module.css"
import React from 'react';
import { useSelector} from 'react-redux';
import Podcast from '../app/Podcast/Podcast';
import PodcastSearch from '../app/Podcast/podCastSearch';
import TopicsFilter from '../app/Podcast/topicsFilter';
import Style from "../styles/Listen.module.css"

const Listen = () => {

    const { podcasts, searchQuery, selectedTopic } = useSelector(state => state.podcasts);

    const filteredPodcasts = podcasts.filter(podcast => {
        const matchesSearch = podcast.title.toLowerCase().includes(searchQuery);
        const matchesTopic = selectedTopic ? podcast.topic.toLowerCase() === selectedTopic : true;
        return matchesSearch && matchesTopic;
      });


    return (

        <>
        <div className={Styles.otherHeroSection}>
                <h1>Listen</h1>         
        </div>
        <div className={Style.pageContainer}>
             
            <h1>Podcasts</h1>
            <div className={Style.search_container}>
            <PodcastSearch />
            <TopicsFilter />
            </div>

            {filteredPodcasts.length === 0 ? (
                    <div className={Style.noPodcasts}>
                        <h1>😪Oops, it seems we don't have what you're looking for</h1>
                       
                    </div>
                ) : (
                    <div className={Style.podcastsGrid}>
                        {filteredPodcasts.map((podcast, index) => (
                            <Podcast
                                key={index}
                                title={podcast.title}
                                embedUrl={podcast.embedUrl}
                                topic={podcast.topic}
                            />
                ))}
            </div>
        )}
        </div>
        </>
    );
};

export default Listen;

