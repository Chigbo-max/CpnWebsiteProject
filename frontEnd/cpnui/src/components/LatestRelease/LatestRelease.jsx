import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faHeadphones } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'

function LatestRelease() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 -mt-24 lg:-mt-32 bg-gradient-to-br from-gray-50 to-amber-50">
            <div className="flex flex-col justify-center items-center w-full gap-4 sm:gap-6 lg:gap-8">
                
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16">
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        WHAT&apos;S NEW
                    </p>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                        Discover our <span className="text-accent-600">Latest Release</span>
                    </h3>
                </div>

                {/* Latest Read Card */}
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-evenly p-8 sm:p-12 lg:p-16 rounded-3xl shadow-2xl w-full max-w-6xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900">
                    <div className="flex flex-col items-center justify-center mb-8 lg:mb-0">
                        <div className="w-64 sm:w-80 lg:w-96 xl:w-[400px] h-64 sm:h-80 lg:h-96 xl:h-[400px] rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-900">
                            <FontAwesomeIcon icon={faBookOpen} className="text-8xl sm:text-9xl text-accent-600" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center w-full lg:items-start lg:text-start lg:w-96 xl:w-[400px]">
                        <h4 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">Latest Read</h4>
                        <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold text-accent-400 mb-4">Insights and Inspiration for Professionals</h5>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed">
                            Explore our library of thoughtfully crafted articles designed to inspire, equip, and challenge Christian professionals. From practical career guidance to faith-driven leadership insights, our reads provide actionable wisdom to help you grow in your industry while honoring God’s principles. Stay informed, inspired, and ready to make a Kingdom impact.
                        </p>
                        <button
                            onClick={() => navigate("/InsideCPN/blog")}
                            className="mb-6 bg-accent-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-none transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
                        >
                            VIEW SERIES &rarr;
                        </button>
                        <p className="text-xs sm:text-sm text-gray-400">A CPN INITIATIVE</p>
                    </div>
                </div>

                {/* Latest Podcast Card */}
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-evenly p-8 sm:p-12 lg:p-16 rounded-3xl shadow-2xl w-full max-w-6xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900">
                    <div className="flex flex-col items-center justify-center mb-8 lg:mb-0">
                        <div className="w-64 sm:w-80 lg:w-96 xl:w-[400px] h-64 sm:h-80 lg:h-96 xl:h-[400px] rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-900">
                            <FontAwesomeIcon icon={faHeadphones} className="text-8xl sm:text-9xl text-accent-600" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center w-full lg:items-end lg:text-end lg:w-96 xl:w-[400px]">
                        <h4 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">Latest Podcast</h4>
                        <h5 className="text-lg sm:text-xl lg:text-2xl font-semibold text-accent-400 mb-4">Conversations that Empower</h5>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed">
                            Tune in to our podcast series where we share empowering conversations with experienced professionals, thought leaders, and industry changemakers. Each episode provides practical advice, spiritual insights, and real-life stories to help you thrive as a professional while living out your faith. Listen, learn, and be inspired to make a meaningful impact in your workplace and community.
                        </p>
                        <button
                            onClick={() => navigate("/Resources/listen")}
                            className="mb-6 bg-accent-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-none transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
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

            </div>
        </div>
    )
}

export default LatestRelease;
