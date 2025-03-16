import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPodcasts, setEpisodesPerPage, setCurrentPage } from "./PodcastSlice";
import Style from "./PodcastEpisode.module.css";
import { ClipLoader } from "react-spinners";

const PodcastEpisodes = () => {
  const dispatch = useDispatch();
  const {
    episodes,
    searchQuery,
    cachedEpisodes,
    selectedTopic,
    status,
    error,
    episodesPerPage,
    currentPage,
  } = useSelector((state) => state.podcasts);

  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPodcasts());
  }, [dispatch, currentPage, episodesPerPage]);

  const handlePageSizeChange = (e) => {
    dispatch(setEpisodesPerPage(Number(e.target.value)));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;

  const filteredEpisodes = (cachedEpisodes[currentPage] || episodes).filter((episode) => {
    const episodeName = episode.name?.toLowerCase() || "";

    // Search query filtering: Ensure partial matches work correctly
    const matchesSearch = searchQuery.length < 2 || episodeName.includes(searchQuery.toLowerCase());

    // Topic filtering (if selected)
    const matchesTopic =
      !selectedTopic || episodeName.includes(selectedTopic.toLowerCase());

    return matchesSearch && matchesTopic;
  });

  const totalEpisodes = filteredEpisodes.length;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);

  const handlePlayPause = (epId) => {
    setPlayingId(playingId === epId ? null : epId);
  };

  if (status === "loading")
    return (
      <div className={Style.loadingContainer}>
        <ClipLoader color="#ffff" size={100} />
        <p>Loading episodes...</p>
      </div>
    );
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className={Style.episodesContainer}>
      <div className={Style.pageSizeContainer}>
        <label>Episodes per page:</label>
        <select value={episodesPerPage} onChange={handlePageSizeChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {filteredEpisodes.length === 0 ? (
        <p>No episodes found</p>
      ) : (
        filteredEpisodes.slice(startIndex, endIndex).map((episode) => (
          <div
            key={episode.id}
            className={`${Style.episodeCard} ${
              playingId === episode.id ? Style.playing : Style.paused
            }`}
          >
            <h3>{episode.name}</h3>
            <p>{episode.description}</p>

            {episode.images?.length > 0 && (
              <img
                src={episode.images[0].url}
                alt={episode.name}
                className={Style.episodeImage}
              />
            )}

            {episode.audio_preview_url ? (
              <button onClick={() => handlePlayPause(episode.id)}>
                {playingId === episode.id ? "⏸ Pause" : "▶ Play"}
              </button>
            ) : (
              <p>No preview available.</p>
            )}

            {episode.audio_preview_url && playingId === episode.id && (
              <audio autoPlay controls className={Style.audioPlayer}>
                <source src={episode.audio_preview_url} type="audio/mpeg" />
              </audio>
            )}

            {episode.external_urls?.spotify && (
              <a
                href={episode.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={Style.spotifyButton}
              >
                Listen on Spotify
              </a>
            )}
          </div>
        ))
      )}

      <div className={Style.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? Style.activePage : ""}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PodcastEpisodes;
