import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPodcasts, setEpisodesPerPage, setCurrentPage } from "./PodcastSlice";
import SimpleSpinner from "../../components/SimpleSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

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
    const matchesSearch = searchQuery.length < 2 || episodeName.includes(searchQuery.toLowerCase());
    const matchesTopic = !selectedTopic || episodeName.includes(selectedTopic.toLowerCase());
    return matchesSearch && matchesTopic;
  });

  const totalEpisodes = filteredEpisodes.length;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);

  const handlePlayPause = (epId) => {
    setPlayingId(playingId === epId ? null : epId);
  };

  if (status === "loading")
    return <SimpleSpinner message="Loading episodes..." />;
  if (status === "failed") return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-gray-200 font-semibold">Episodes per page:</label>
        <select 
          value={episodesPerPage} 
          onChange={handlePageSizeChange}
          className="rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 bg-white shadow-sm"
        >
          <option value={12}>12</option>
          <option value={16}>16</option>
          <option value={20}>20</option>
        </select>
      </div>

      {filteredEpisodes.length === 0 ? (
        <p className="text-gray-300">No episodes found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEpisodes.slice(startIndex, endIndex).map((episode) => (
            <div
              key={episode.id}
              className={`rounded-xl shadow-lg text-white p-4 flex flex-col gap-3 border-2 border-gray-700 hover:shadow-xl transition-all duration-300 ${playingId === episode.id ? 'ring-4 ring-amber-400' : ''}`}
              style={{backgroundColor: '#111826ff'}}
            >
              {episode.images?.length > 0 && (
                <img
                  src={episode.images[0].url}
                  alt={episode.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}

              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">{episode.name}</h3>
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">{episode.description}</p>
              </div>

              <div className="flex flex-col gap-2">
                {episode.audio_preview_url ? (
                  <button 
                    onClick={() => handlePlayPause(episode.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300 text-sm shadow-md hover:shadow-lg"
                    style={{backgroundColor: '#111826ff'}}
                  >
                    <FontAwesomeIcon 
                      icon={playingId === episode.id ? faPause : faPlay} 
                      className="text-sm" 
                    />
                    {playingId === episode.id ? "Pause" : "Play"}
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm">No preview available.</p>
                )}

                {episode.external_urls?.spotify && (
                  <a
                    href={episode.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 text-sm shadow-md hover:shadow-lg"
                  >
                    <FontAwesomeIcon icon={faSpotify} className="text-sm" />
                    Spotify
                  </a>
                )}
              </div>

              {episode.audio_preview_url && playingId === episode.id && (
                <audio autoPlay controls className="w-full mt-2">
                  <source src={episode.audio_preview_url} type="audio/mpeg" />
                </audio>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center items-center mt-8">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md bg-gray-900 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-2 rounded-md font-semibold border-2 ${currentPage === index + 1 ? 'bg-amber-400 text-gray-900 border-amber-400' : 'bg-white text-gray-900 border-gray-300 hover:bg-amber-100'} transition-colors`}
          >
            {index + 1}
          </button>
        ))}
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md bg-gray-900 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PodcastEpisodes;
