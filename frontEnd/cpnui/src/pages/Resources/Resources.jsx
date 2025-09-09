import { motion } from "framer-motion";
import SoundWave from "../../assets/soundWave.png";
import bgImage from "../../assets/listen.jpeg";
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import JoinCommunityBanner from "../../components/JoinCommunityBanner";

function Resources() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(rgba(17, 24, 38, 0.9), rgba(17, 24, 38, 0.9)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <motion.h1
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-accent-500 mb-6"
          >
            Resources
          </motion.h1>
          <motion.p
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed"
          >
            CPN offers free access to high-quality, biblically-aligned resources
            that provide practical insights for conducting Kingdom business
            across the globe.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">

          {/* Podcast Section */}
          <section className="mb-24">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center justify-center mb-8 lg:mb-0">
                <div className="w-48 sm:w-56 lg:w-64 xl:w-72 h-48 sm:h-56 lg:h-64 xl:h-72 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl shadow-2xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeadphones} className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-start w-full lg:w-96 xl:w-[400px] bg-primary-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Latest Podcast</h4>
                <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold text-accent-400 mb-4">Conversations that Empower</h5>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed">
                  Tune in to our podcast series where we share empowering conversations with experienced professionals, thought leaders, and industry changemakers. Each episode provides practical advice, spiritual insights, and real-life stories to help you thrive as a professional while living out your faith. Listen, learn, and be inspired to make a meaningful impact in your workplace and community.
                </p>
                <button
                  onClick={() => navigate("/Resources/listen")}
                  className="mb-6 bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-accent-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
                >
                  LISTEN NOW &rarr;
                </button>
                <div className="flex items-center gap-2 text-gray-300 justify-center lg:justify-end">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-xs font-medium">LIVE</span>
                </div>
              </div>
            </div>
          </section>

          {/* Read Section */}
          <section className="mb-24">
            <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-8">
              <div className="flex flex-col items-center justify-center mb-8 lg:mb-0">
                <div className="w-48 sm:w-56 lg:w-64 xl:w-72 h-48 sm:h-56 lg:h-64 xl:h-72 bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-2xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-start w-full lg:w-96 xl:w-[400px] bg-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Latest Read</h4>
                <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold text-accent-400 mb-4">Insights and Inspiration for Professionals</h5>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed">
                  Explore our library of thoughtfully crafted articles designed to inspire, equip, and challenge Christian professionals. From practical career guidance to faith-driven leadership insights, our reads provide actionable wisdom to help you grow in your industry while honoring God’s principles. Stay informed, inspired, and ready to make a Kingdom impact.
                </p>
                <button
                  onClick={() => navigate("/InsideCPN/blog")}
                  className="mb-6 bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-accent-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
                >
                  VIEW SERIES &rarr;
                </button>
                <p className="text-xs sm:text-sm text-gray-400">A CPN INITIATIVE</p>
              </div>
            </div>
          </section>

        </div>
      </div>
      <JoinCommunityBanner />
    </div>
  );
}

export default Resources;
