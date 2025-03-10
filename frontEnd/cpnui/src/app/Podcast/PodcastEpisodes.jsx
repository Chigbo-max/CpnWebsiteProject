import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPodcasts, setEpisodesPerPage, setCurrentPage } from "./PodcastSlice";
import Style from "./PodcastEpisode.module.css";
import { ClipLoader } from 'react-spinners';

const PodcastEpisodes = () => {
  const dispatch = useDispatch();
  const { episodes, searchQuery, cachedEpisodes, selectedTopic, status, error, episodesPerPage, currentPage } = useSelector(
    (state) => state.podcasts
  );


  const [playingId, setPlayingId] = useState(null);

  const handlePageSizeChange = (e) => {
    dispatch(setEpisodesPerPage(Number(e.target.value)));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    dispatch(fetchPodcasts());
  }, [dispatch, currentPage, episodesPerPage]);

  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;

  const filteredEpisodes = (cachedEpisodes[currentPage] || episodes).filter((ep) => {

    const matchesTopic =
      !selectedTopic ||
      (ep.name && ep.name.toLowerCase() === selectedTopic.toLowerCase());

    const matchesSearch =
      !searchQuery || ep.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesSearch;
  });

  const totalEpisodes = episodes.filter((ep) => {

    const matchesTopic =
      !selectedTopic ||
      (ep.name && ep.name.toLowerCase() === selectedTopic.toLowerCase());

    const matchesSearch =
      !searchQuery || ep.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesSearch;
  }).length;

  const totalPages = Math.ceil(totalEpisodes / episodesPerPage)


  const handlePlayPause = (epId) => {
    if (playingId === epId) {
      setPlayingId(null);
    } else {
      setPlayingId(epId);
    }
  };



  if (status === "loading") return (
    <div className={Style.loadingContainer}>
      <ClipLoader color="#ffff" size={50} />
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
        filteredEpisodes.slice(startIndex, endIndex).map((ep) => (
          <div
            key={ep.id}
            className={`${Style.episodeCard} ${playingId === ep.id ? Style.playing : Style.paused
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

{ep.external_urls?.spotify && (
    <a
      href={ep.external_urls.spotify}
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
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {
          Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? Style.activePage : ""}> {index + 1}

            </button>
          ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>

      </div>
    </div>
  );




};

export default PodcastEpisodes;
