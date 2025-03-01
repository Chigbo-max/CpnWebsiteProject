import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPodcasts } from "./PodcastSlice";
import Style from "./PodcastEpisode.module.css";

const PodcastEpisodes = () => {
  const dispatch = useDispatch();
  const { episodes, searchQuery, selectedTopic, status, error } = useSelector(
    (state) => state.podcasts
  );


  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPodcasts());
  }, [dispatch]);

  const filteredEpisodes = episodes.filter((ep) => {
  
    const matchesTopic =
      !selectedTopic ||
      (ep.name && ep.name.toLowerCase() === selectedTopic.toLowerCase());
  
    const matchesSearch =
      !searchQuery || ep.name.toLowerCase().includes(searchQuery.toLowerCase());
  
    return matchesTopic && matchesSearch;
  });

  const handlePlayPause = (epId) => {
    if (playingId === epId) {
      setPlayingId(null);
    } else {
      setPlayingId(epId);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className={Style.episodesContainer}>
      {filteredEpisodes.length === 0 ? (
        <p>No episodes found.</p>
      ) : (
        filteredEpisodes.map((ep) => (
          <div
            key={ep.id}
            className={`${Style.episodeCard} ${
              playingId === ep.id ? Style.playing : Style.paused
            }`}
          >
            <h3>{ep.name}</h3>
            <p>{ep.description}</p>

            {ep.images?.length > 0 && (
              <img
                src={ep.images[0].url}
                alt={ep.name}
                className={Style.episodeImage}
              />
            )}

            {ep.audio_preview_url ? (
              <button onClick={() => handlePlayPause(ep.id)}>
                {playingId === ep.id ? "⏸ Pause" : "▶ Play"}
              </button>
            ) : (
              <p>No preview available.</p>
            )}

            {ep.audio_preview_url && playingId === ep.id && (
              <audio autoPlay controls className={Style.audioPlayer}>
                <source src={ep.audio_preview_url} type="audio/mpeg" />
              </audio>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PodcastEpisodes;
