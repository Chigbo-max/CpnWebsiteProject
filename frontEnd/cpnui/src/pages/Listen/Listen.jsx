import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faHeadphones, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';
import ServerDown from '../Error/ServerDown';

function Listen() {
  const podcast = useSelector((state) => state.podcast);

  return (
    <div className="w-full">
      {/* Full-Width Hero Section */}
      <section className="relative w-full min-h-screen flex items-start justify-center text-center overflow-hidden pt-20 sm:pt-24 md:pt-32">
        <div className="absolute inset-0 w-full h-full bg-gray-900" />
        <div className="relative z-20 flex flex-col justify-start items-center w-full px-6 py-20 mx-auto">
          <motion.h1
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight mx-auto"
          >
            Subscribe to <span className="text-amber-400">Christian Professionals Network</span>
          </motion.h1>
          <motion.h3 
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6"
          >Our Podcast Channel</motion.h3>
          <motion.p 
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 mx-auto drop-shadow leading-relaxed max-w-4xl"
          >
            Listen to inspiring discussions of how your peers have embraced their marketplace calling and continue to seek ways to steward their faith and work toward righteousness.
          </motion.p>
          <motion.div 
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 text-gray-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-amber-500 hover:scale-105 transition-all duration-300 border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
            >
              <FontAwesomeIcon icon={faSpotify} className="text-2xl" /> 
              <span>Listen on Spotify</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Content Header */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">What to <span className="text-amber-400">Listen to</span></h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Be inspired by discussions with business leaders who have embraced their marketplace calling and continue to seek ways to steward what God has given them.
              </p>
            </div>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 mb-8">
              <div className="w-full sm:w-auto">
                <PodcastSearch />
              </div>
              <div className="w-full sm:w-auto">
                <TopicsFilter />
              </div>
            </div>
          </section>

          {/* Podcast Episodes Section */}
          <section className="mb-24">
            <PodcastEpisodes />
          </section>

        </div>
      </div>
    </div>
  );
};

export default Listen;
