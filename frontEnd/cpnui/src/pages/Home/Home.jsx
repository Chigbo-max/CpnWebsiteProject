import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import { faUsers, faBookOpen, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faSpotify as faSpotifyBrand, faWhatsapp as faWhatsappBrand } from "@fortawesome/free-brands-svg-icons";
import Cpn1 from "../../assets/cpnevent1.jpg";
import Cpn2 from "../../assets/cpnevent2.jpg";
import Cpn3 from "../../assets/cpnevent3.jpg";
import Features from "../../components/Features/Features";
import LatestRelease from "../../components/LatestRelease/LatestRelease";
import Courses from "../../components/Courses/Courses";
import FreeContent from "../../components/FreeContent/FreeContent";
import NewAndPastEvents from "../../components/NewAndPastEvents/NewAndPastEvents";

const slides = [
  {
    image: Cpn1,
    title: "Christian\nProfessionals Network",
    subtitle: "Raising Kingdom Leaders",
    text: "Empowering professionals to excel in their industries through biblical principles, ethical leadership, and Kingdom-focused excellence.",
    buttonText: "Discover Our Mission",
    buttonLink: "/about",
  },
  {
    image: Cpn2,
    title: "Knowledge Hub",
    subtitle: "Biblical Resources for Professionals",
    text: "Access high-quality, biblically-aligned resources designed to help you grow professionally while maintaining Kingdom values.",
    buttonText: "Explore Resources",
    buttonLink: "/knowledgeHub",
  },
  {
    image: Cpn3,
    title: "Join Our Community",
    subtitle: "Connect & Grow Together",
    text: "Connect with like-minded professionals who share your values and commitment to Kingdom excellence in the workplace.",
    buttonText: "Join Community",
    buttonLink: "/community",
  },
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        (previousIndex + 1) % slides.length);
    }, 8000)
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="w-full">
      {/* Full-Width Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={slides[currentIndex].image}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${slides[currentIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <motion.div
            key={slides[currentIndex].subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-amber-400 text-lg sm:text-xl md:text-2xl font-semibold mb-4 tracking-wide"
          >
            {slides[currentIndex].subtitle}
          </motion.div>
          
          <motion.h1
            key={slides[currentIndex].title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight mx-auto"
          >
            {slides[currentIndex].title.split('\n').map((line, index) => (
              <div key={index} className="whitespace-nowrap">{line}</div>
            ))}
          </motion.h1>
          
          <motion.p
            key={slides[currentIndex].text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-12 mx-auto drop-shadow leading-relaxed max-w-5xl"
          >
            {slides[currentIndex].text}
          </motion.p>
          
          <motion.div
            key={slides[currentIndex].buttonText}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to={slides[currentIndex].buttonLink}
              className="inline-block px-10 py-4 bg-amber-400 text-gray-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-amber-500 hover:scale-105 transition-all duration-300 border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
            >
              {slides[currentIndex].buttonText}
            </Link>
            <a
              href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-transparent text-white font-bold text-lg rounded-xl shadow-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 border-2 border-white focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
            >
              Join WhatsApp Group
            </a>
          </motion.div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-amber-400 scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
                <Features />

        {/* Community Section */}
        <section className="mb-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">Our Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who are transforming their workplaces with Kingdom values and biblical principles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">WhatsApp Community</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect with over 2,000 professionals in our active WhatsApp community. Share insights, ask questions, and grow together.
              </p>
              <a
                href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
              >
                Join Now <FontAwesomeIcon icon={faWhatsappBrand} className="text-lg" />
              </a>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Weekly Prayers</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Join our Wednesday 5AM prayer sessions via WhatsApp. Start your day with spiritual strength and community support.
              </p>
              <span className="inline-flex items-center gap-2 text-gray-500 font-semibold">
                Every Wednesday 5AM
              </span>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Monthly Mentorship</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Participate in our monthly Zoom mentorship sessions with industry leaders and spiritual mentors.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Knowledge Hub Section - Full Width */}
      <section className="w-full" style={{backgroundColor: '#111826ff'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Knowledge Hub</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Access high-quality, biblically-aligned resources designed to help you excel in your professional journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Latest Podcasts and Blogs</h3>
              <h4 className="text-xl font-semibold text-amber-400 mb-4">Available on the go!</h4>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Leadership is a skill that can be learned. Discover practical biblical principles for effective leadership in the workplace and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/knowledgeHub/listen"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faSpotifyBrand} /> Listen Now
                </Link>
                <Link
                  to="/knowledgeHub"
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-amber-400 text-amber-400 font-semibold rounded-lg hover:bg-amber-400 hover:text-gray-900 transition-colors"
                >
                  Explore All Resources
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-8 text-white border border-gray-700">
              <h4 className="text-2xl font-bold mb-6 text-white">Available Resources</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-200">Weekly Podcast Episodes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-200">Biblical Leadership Articles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-200">Professional Development Guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-200">Industry-Specific Insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-gray-200">Mentorship Resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections Continued */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        {/* Events Section */}
        <section className="mb-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join us for transformative events designed to equip and inspire Kingdom professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-6xl text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership Summit 2024</h3>
                <p className="text-gray-600 mb-4">A comprehensive leadership development event featuring industry experts and biblical insights.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">March 15-16, 2024</span>
                  <Link to="/events" className="text-amber-600 font-semibold hover:text-amber-700">Learn More</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-6xl text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Networking</h3>
                <p className="text-gray-600 mb-4">Connect with fellow professionals and expand your network in a faith-based environment.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Monthly</span>
                  <Link to="/events" className="text-amber-600 font-semibold hover:text-amber-700">Learn More</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-white" />
              </div>
              <div className="p-6" style={{backgroundColor: '#111826ff'}}>
                <h3 className="text-xl font-bold text-white mb-2">Bible Study Series</h3>
                <p className="text-gray-300 mb-4">Deep dive into biblical principles for professional excellence and workplace ministry.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Weekly</span>
                  <Link to="/events" className="text-amber-400 font-semibold hover:text-amber-300">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spotify Embed Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Listen to Our Latest Podcast</h2>
            <p className="text-gray-600">Stay inspired with our weekly episodes on Spotify</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <iframe 
              className="w-full h-96" 
              src="https://open.spotify.com/embed/show/2vmyOcrq7cFcKBMepGbpZP?utm_source=generator" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            />
          </div>
        </section>
      </div>

      {/* Additional Components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-amber-50">
        <LatestRelease/>
        <Courses/>
        <FreeContent/>
        <NewAndPastEvents/>
      </div>
    </div>
  )
}

export default Home
