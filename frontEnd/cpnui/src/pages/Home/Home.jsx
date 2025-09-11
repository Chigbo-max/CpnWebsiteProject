import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify as faSpotifyBrand, faWhatsapp as faWhatsappBrand } from "@fortawesome/free-brands-svg-icons";
import Cpn1 from "../../assets/cpnevent1.jpg";
import Cpn2 from "../../assets/cpnevent2.jpg";
import Cpn3 from "../../assets/cpnevent3.jpg";
import Bookshelf from "../../assets/bookshelf.jpeg";

import Features from "../../components/HomeAbout/Features";
import LatestRelease from "../../components/LatestRelease/LatestRelease";
import JoinCommunityBanner from "../../components/JoinCommunityBanner";
import Courses from "../../components/Courses/Courses";
import FreeContent from "../../components/FreeContent/FreeContent";
import { useGetEventsQuery } from '../../features/event/eventApi';

const podcastSource = import.meta.env.VITE_PODCAST_SOURCE;

const slides = [
  {
    image: Cpn1,
    title: "Christian\nProfessionals Network",
    subtitle: "Raising Kingdom Leaders",
    text: "Empowering professionals to excel in their industries through biblical principles, ethical leadership, and Kingdom-focused excellence.",
    buttonText: "Discover Our Mission",
    buttonLink: "/insideCPN/about",
    buttonType: "link"
  },
  {
    image: Cpn2,
    title: "Resources",
    subtitle: "Biblical Resources for Professionals",
    text: "Access high-quality, biblically-aligned resources designed to help you grow professionally while maintaining Kingdom values.",
    buttonText: "Explore Resources",
    buttonLink: "/Resources",
    buttonType: "link"
  },
  {
    image: Cpn3,
    title: "Join Our Community",
    subtitle: "Connect & Grow Together",
    text: "Connect with like-minded professionals who share your values and commitment to Kingdom excellence in the workplace.",
    buttonText: "Join Community",
    buttonLink: "/register",
    buttonType: "link"
  },
  {
    image: Bookshelf,
    title: "Courses",
    subtitle: "Grow Professionally & Spiritually",
    text: "Explore our range of courses designed to help you do work, leadership, and business differently—anchored in Kingdom values and practical excellence.",
    buttonText: "Learn More",
    buttonLink: "/courses",
    buttonType: "link"
  },
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: eventsData = {}, isLoading: eventsLoading, isError: eventsError } = useGetEventsQuery();
  const events = Array.isArray(eventsData) ? eventsData : (eventsData.events ?? []);

  // Get up to 3 latest upcoming events
  let upcomingEvents = [];
  if (Array.isArray(events) && events.length > 0) {
    const now = new Date();
    upcomingEvents = events
      .filter(event => new Date(event.start_time) > now)
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 3);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        (previousIndex + 1) % slides.length);
    }, 8000)
    return () => clearInterval(interval);
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % slides.length
    );
  };

  return (
    <div className="w-full">
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

        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 pt-40 pb-24 mx-auto">
          <motion.div
            key={slides[currentIndex].subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-accent-400 text-lg sm:text-xl md:text-2xl font-semibold mb-4 tracking-wide"
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
            {slides[currentIndex].buttonType === "link" && (
              <Link
                to={slides[currentIndex].buttonLink}
                className="inline-block px-10 py-4 bg-accent-500 text-gray-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-accent-600 hover:scale-105 transition-all duration-300 border-2 border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
              >
                {slides[currentIndex].buttonText}
              </Link>
            )}
            {slides[currentIndex].buttonType === "external" && (
              <a
                href={slides[currentIndex].buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-accent-500 text-gray-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-amber-500 hover:scale-105 transition-all duration-300 border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
              >
                {slides[currentIndex].buttonText}
              </a>
            )}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-accent-500 scale-125' : 'bg-white bg-opacity-50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-accent-50">
        <Features />

        {/* Community Section */}
        <section className="mb-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black py-8 text-primary-900 mb-6">Our Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who are transforming their workplaces with Kingdom values and biblical principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">WhatsApp Community</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Connect with other Christian professionals in our active WhatsApp community. Share insights, ask questions, and grow together.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-accent-400 font-semibold hover:text-accent-700 transition-colors"
              >
                Join Now <FontAwesomeIcon icon={faWhatsappBrand} className="text-lg" />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Weekly Prayers</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Join our Wednesday 5AM prayer sessions via WhatsApp. Start your day with spiritual strength and community support.
              </p>
              <span className="inline-flex items-center gap-2 text-primary-100 font-semibold">
                Every Wednesday 5AM
              </span>
            </div>

            <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mentorship Sessions</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Participate in our mentorship sessions with the convener. Get guidance, support, and insights.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-accent-400 font-semibold hover:text-accent-700 transition-colors"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Resources Section - Full Width */}
      <section className="w-full bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Resources</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Access high-quality, biblically-aligned resources designed to help you excel in your professional journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Latest Podcasts and Blogs</h3>
              <h4 className="text-xl font-semibold text-accent-400 mb-4">Available on the go!</h4>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Leadership is a skill that can be learned. Discover practical biblical principles for effective leadership in the workplace and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/Resources/listen"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faSpotifyBrand} className="text-lg" /> Listen Now
                </Link>
                <Link
                  to="/Resources"
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-accent-400 text-accent-400 font-semibold rounded-lg hover:bg-accent-400 hover:text-primary-900 transition-colors"
                >
                  Explore All Resources
                </Link>
              </div>
            </div>

            <div className="rounded-2xl p-8 text-white border border-gray-700">
              <h4 className="text-2xl font-bold mb-6 text-white">Available Resources</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                  <span className="text-gray-200">Weekly Podcast Episodes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                  <span className="text-gray-200">Biblical Leadership Articles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                  <span className="text-gray-200">Professional Development Guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                  <span className="text-gray-200">Industry-Specific Insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                  <span className="text-gray-200">Mentorship Resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections Continued */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-accent-50">
        {/* Events Section */}
        {/* Events Section */}
        <section className="mb-24 max-w-7xl mx-auto">
          <div className="w-full text-center mb-8 px-4 sm:px-6 lg:px-8">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">EVENTS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Connect at <span className="text-accent-600">Our Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
              Join us for transformative events designed to equip and inspire Kingdom professionals.
            </p>
          </div>
          {/* Show up to 3 real upcoming events */}
          {eventsLoading ? (
            <div className="flex flex-wrap justify-center gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-pulse w-full max-w-sm">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : eventsError ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Unable to load upcoming events.</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming events at the moment.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {upcomingEvents.map((event, idx) => (
                <div key={event.event_id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 w-full max-w-sm">
                  {event.image_url ? (
                    <div className="h-48 w-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`h-48 bg-gradient-to-br ${idx % 2 === 0 ? 'from-accent-400 to-accent-600' : 'from-primary-800 to-primary-900'} flex items-center justify-center`}>
                      <Calendar className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-600 text-white mb-2">Upcoming Event</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{new Date(event.start_time).toLocaleDateString()}</span>
                      <Link to={`/events/${event.event_id}`} className="text-accent-600 font-semibold hover:text-accent-700">Learn More</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {upcomingEvents.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link to="/events" className="inline-block px-8 py-3 bg-accent-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-accent-700 transition-all duration-300 border-2 border-accent-600 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50">
              View All Events
            </Link>
          </div>
        )}

        {/* Spotify Embed Section */}
        <section className="mb-16 mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Listen to Our Latest Podcast</h2>
            <p className="text-gray-600">Stay inspired with our weekly episodes on Spotify</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <iframe
              className="w-full h-96 border-0"
              src={podcastSource}
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </section>
      </div>

      <LatestRelease />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-accent-50">
        <Courses />
        <FreeContent />
      </div>

      <JoinCommunityBanner />
    </div>
  )
}

export default Home
