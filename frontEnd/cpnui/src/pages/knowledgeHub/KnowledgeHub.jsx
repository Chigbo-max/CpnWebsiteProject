import React from "react";
import { motion } from "framer-motion"; 
import SoundWave from "../../assets/soundWave.png";
import bgImage from "../../assets/listen.jpeg";
import {useNavigate} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faBookOpen } from "@fortawesome/free-solid-svg-icons";

function KnowledgeHub() {
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-amber-400 mb-6"
          >
            Knowledge Hub
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
                <div className="w-48 sm:w-56 lg:w-64 xl:w-72 h-48 sm:h-56 lg:h-64 xl:h-72 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-2xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeadphones} className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-start w-full lg:w-96 xl:w-[400px] bg-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Latest Podcast</h4>
                <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold text-amber-400 mb-4">How to be a good leader</h5>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed">
                  Leadership is a skill that can be learned. Here are some tips on how to be a good leader.
                </p>
                <button 
                  onClick={() => navigate("/knowledgeHub/listen")}
                  className="mb-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                >
                  LISTEN NOW &rarr;
                </button>
                <img src={SoundWave} alt="Sound Wave" className="w-48 sm:w-64 lg:w-80" />
              </div>
            </div>
          </section>

          {/* Read Section */}
          <section className="mb-24">
            <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-8">
              <div className="flex flex-col items-center justify-center mb-8 lg:mb-0">
                <div className="w-48 sm:w-56 lg:w-64 xl:w-72 h-48 sm:h-56 lg:h-64 xl:h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-start w-full lg:w-96 xl:w-[400px] bg-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Latest Read</h4>
                <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold text-amber-400 mb-4">How to be a good leader</h5>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed">
                  Leadership is a skill that can be learned. Here are some tips on how to be a good leader.
                </p>
                <button 
                  onClick={() => navigate("/blog")}
                  className="mb-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                >
                  VIEW SERIES &rarr;
                </button>
                <p className="text-xs sm:text-sm text-gray-400">A CPN INITIATIVE</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default KnowledgeHub;
