import React from 'react'
import { FaBookOpen, FaPodcast } from "react-icons/fa";
import {useNavigate} from "react-router-dom"

function FreeContent() {
    const navigate = useNavigate();
    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch p-8 sm:p-12 lg:p-16 bg-gray-900 mt-24 lg:mt-32 mb-12 lg:mb-16">
                <div className="w-full lg:w-1/4 text-center lg:text-left max-w-xs lg:max-w-none mb-8 lg:mb-0 lg:mr-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-4">
                        Explore Our <span className="text-amber-600">Free Content</span>
                    </h2>
                </div>
                
                <div 
                  className="relative w-full sm:w-80 lg:w-96 xl:w-1/4 min-w-64 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer group"
                  onClick={() => navigate("knowledgeHub/read")}
                >
                    <FaBookOpen className="absolute top-6 left-6 text-3xl text-gray-900" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 mt-12">Read</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 leading-relaxed">
                        Read our thought leadership and blogs for a redemptive approach to culture, justice, profit, and other challenges we face integrating faith and work.
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/knowledgeHub/read");
                      }}
                      className="w-full bg-gray-900 hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-lg border-2 border-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                    >
                        WHAT TO READ
                    </button>
                </div>

                <div 
                  className="relative w-full sm:w-80 lg:w-96 xl:w-1/4 min-w-64 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer group"
                  onClick={() => navigate("/knowledgeHub/listen")}
                >
                    <FaPodcast className="absolute top-6 left-6 text-3xl text-gray-900" />
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 mt-12">Our Series</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 leading-relaxed">
                        Discover our podcast series with real-life testimonies from business leaders integrating faith and work, plus practical theology and thought leadership to inspire and guide you in your marketplace calling.
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/knowledgeHub/listen");
                      }}
                      className="w-full bg-gray-900 hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-lg border-2 border-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                    >
                        VIEW SERIES
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FreeContent
