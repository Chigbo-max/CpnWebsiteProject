import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPodcasts, setEpisodesPerPage, setCurrentPage } from "./podCastSlice";
import SimpleSpinner from "../../components/SimpleSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const PodcastEpisodes = () => {
  const dispatch = useDispatch();
  const {
    episodes = [],
    searchQuery = '',
    cachedEpisodes = {},
    selectedTopic = '',
    status = 'idle',
    error = '',
    episodesPerPage = 12,
    currentPage = 1,
  } = useSelector((state) => state?.podcasts || {});

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

  const episodeList = cachedEpisodes[currentPage] || episodes || [];
  const filteredEpisodes = episodeList.filter((episode) => {
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
        <label className="text-gray-900 font-semibold">Episodes per page:</label>
        <select 
          value={episodesPerPage} 
          onChange={handlePageSizeChange}
          className="rounded-md px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-400 text-white bg-primary-900 shadow-sm"
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
              className={`rounded-2xl shadow-xl text-white p-0 flex flex-col gap-0 border-0 bg-gradient-to-br from-primary-800 to-primary-900 hover:scale-[1.025] hover:shadow-2xl transition-all duration-300 ${playingId === episode.id ? 'ring-4 ring-amber-400' : ''}`}
              style={{ minHeight: '370px', position: 'relative' }}
            >
              {episode.images?.length > 0 && (
                <img
                  src={episode.images[0].url}
                  alt={episode.name}
                  className="w-full h-40 object-cover rounded-t-2xl shadow-md border-b-2 border-gray-800"
                  style={{ objectPosition: 'center' }}
                />
              )}

              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white tracking-tight leading-snug">{episode.name}</h3>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">{episode.description}</p>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {episode.audio_preview_url ? (
                    <button 
                      onClick={() => handlePlayPause(episode.id)}
                      className={`modernAmberBtn flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 text-sm ${playingId === episode.id ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <FontAwesomeIcon 
                        icon={playingId === episode.id ? faPause : faPlay} 
                        className="text-base" 
                      />
                      {playingId === episode.id ? "Pause Preview" : "Play Preview"}
                    </button>
                  ) : (
                    <p className="text-gray-400 text-sm">No preview available.</p>
                  )}

                  {episode.external_urls?.spotify && (
                    <a
                      href={episode.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`modernGreenBtn flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 text-sm`}
                    >
                      <FontAwesomeIcon icon={faSpotify} className="text-base" />
                      {playingId === episode.id ? "Play full episode on Spotify" : "Spotify"}
                    </a>
                  )}
                </div>
              </div>

              {episode.audio_preview_url && playingId === episode.id && (
                <audio autoPlay controls className="w-full mt-2 rounded-b-2xl bg-gray-900">
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
