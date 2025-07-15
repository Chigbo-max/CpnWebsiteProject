import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import icon from "../../assets/clubhouse.svg";
import bgImage from "../../assets/cpnevent1.jpg"

function About() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div
        className="relative w-full rounded-2xl text-center mb-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden"
        style={{
          background: `linear-gradient(rgba(61, 35, 27, 0.85), rgba(61, 35, 27, 0.85)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <header className="w-full max-w-2xl mx-auto py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-400 mb-4">
            About <span className="text-white">Christian Professionals Network</span>
          </h1>
        </header>
      </div>

      <section className="my-12">
        <div className="bg-gray-900 p-8 rounded-xl mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Our Mission</h2>
          <p className="text-white text-lg leading-relaxed">
            Christian Professionals Network (CPN) is a platform to mentor and raise excellent, ethical professionals who will take over their industries and workplaces for The Kingdom, using practical Bible-based principles to rise to positions of influence and power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 text-amber-400 p-6 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold mb-2">Founded</h3>
            <p className="text-white">February 13, 2022</p>
          </div>
          <div className="bg-gray-900 text-amber-400 p-6 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-white">Rising ethical professionals who thrive in their industries through practical Bible-based principles</p>
          </div>
          <div className="bg-gray-900 text-amber-400 p-6 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-xl font-bold mb-2">Our Promise</h3>
            <p className="text-white">GOSHEN - Divine protection and favor (Exodus 8:20-23)</p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Platforms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <a href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 p-6 rounded-xl border border-gray-900 text-center shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center">
            <FontAwesomeIcon icon={faSpotify} className="text-4xl text-amber-400 mb-2" />
            <p className="font-medium">Listen to our podcast on Spotify</p>
          </a>
          <a href="https://www.clubhouse.com/house/christian-professionals-network" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 p-6 rounded-xl border border-gray-900 text-center shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center">
            <img src={icon} className="w-10 h-10 mb-2" alt="Clubhouse Icon" />
            <p className="font-medium">Join our Clubhouse room</p>
          </a>
          <a href="https://www.instagram.com/christianprofessionalsnetwork/" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 p-6 rounded-xl border border-gray-900 text-center shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center">
            <FontAwesomeIcon icon={faInstagram} className="text-4xl text-amber-400 mb-2" />
            <p className="font-medium">Follow us on Instagram</p>
          </a>
          <a href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 p-6 rounded-xl border border-gray-900 text-center shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center">
            <FontAwesomeIcon icon={faWhatsapp} className="text-4xl text-amber-400 mb-2" />
            <p className="font-medium">Join our WhatsApp group</p>
          </a>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 text-white p-6 rounded-xl text-center shadow-lg hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold text-amber-400 mb-2">Prayers</h3>
            <p>Wednesdays 5AM (WhatsApp)</p>
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-xl text-center shadow-lg hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold text-amber-400 mb-2">Podcast</h3>
            <p>Thursdays (All platforms)</p>
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-xl text-center shadow-lg hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold text-amber-400 mb-2">Mentorship</h3>
            <p>Monthly Zoom Sessions</p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">We look forward to sharing in your success story!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">"I have a clearer knowledge of how to stand for Christ at work and everyday life, with my career as a platform."</p>
            <h4 className="text-lg font-bold text-amber-400">- Ezinne Umozurike. USA</h4>
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">"CPN has taught me how to thrive in my career, by applying bible based principles. The podcasts are always relatable and timely."</p>
            <h4 className="text-lg font-bold text-amber-400">- Chika Bob-Agomoh. LAGOS</h4>
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">"It's been amazing. The gift of access to fellow Christians walking same path as been encouraging. "</p>
            <h4 className="text-lg font-bold text-amber-400">- Femi Oke IBADAN.</h4>
          </div>
        </div>
      </section>

      <section className="my-12 bg-gray-900 text-white p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">Connect With Us</h2>
        <div className="flex flex-col items-center gap-4">
          <p><strong>Call or WhatsApp:</strong> <a href="tel:+2347033288115" className="text-amber-400 font-bold hover:underline">+234 703 328 8115</a></p>
          <p><strong>Email:</strong> <a href="mailto:cprofessionalsnetwork@gmail.com" className="text-amber-400 font-bold hover:underline">cprofessionalsnetwork@gmail.com</a></p>
          <p>💬 <strong>Follow us on social media:</strong> Stay updated with our latest programs!</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faSpotify} className="text-4xl text-amber-400" /></a>
            <a href="https://www.clubhouse.com/house/christian-professionals-network" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><img src={icon} className="w-10 h-10" alt="Clubhouse Icon" /></a>
            <a href="https://www.instagram.com/christianprofessionalsnetwork/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faInstagram} className="text-4xl text-amber-400" /></a>
            <a href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faWhatsapp} className="text-4xl text-amber-400" /></a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
