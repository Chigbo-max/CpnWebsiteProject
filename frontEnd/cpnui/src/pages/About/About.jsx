import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Target, Eye, Handshake, Leaf, Users, HandHeart, Scale, User as UserTie, CheckCircle, Church } from 'lucide-react';
import { faInstagram, faSpotify, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import icon from "../../assets/clubhouse.svg";
import bgImage from "../../assets/cpnevent1.jpg";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ceo from "../../assets/Hadassah.jpg";
import commanager from "../../assets/Uju.jpg";
import chigbo from "../../assets/chigbo.jpg"
import JoinCommunityBanner from "../../components/JoinCommunityBanner";


const podcastSource = import.meta.env.VITE_PODCAST_SOURCE;
const instagramLink = import.meta.env.VITE_INSTAGRAM_LINK;
const clubhouseLink = import.meta.env.VITE_CLUBHOUSE_LINK;

const team = [
  { name: 'Hadassah', role: 'Convener', img: ceo },
  { name: 'Uju', role: 'Community Manager', img: commanager },
  { name: 'Chigbo', role: 'Software Engineer', img: chigbo },

];

const values = [
  { icon: <Leaf className="text-3xl mb-2 text-amber-600" />, label: 'God-honouring stewardship' },
  { icon: <Users className="text-3xl mb-2 text-amber-600" />, label: 'Authentic relationship' },
  { icon: <HandHeart className="text-3xl mb-2 text-amber-600" />, label: 'Collaboration and co-creation' },
  { icon: <Scale className="text-3xl mb-2 text-amber-600" />, label: 'Humility and integrity' },
  { icon: <UserTie className="text-3xl mb-2 text-amber-600" />, label: 'Excellent and diligent work' },
];

function About() {
  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-10" />
        </div>
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-accent-400 text-lg sm:text-xl md:text-2xl font-semibold mb-4 mt-16 tracking-wide"
          >
            Empowering Professionals for Kingdom Impact
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight mx-auto"
          >
            About <span className="text-accent-600">Christian Professionals Network</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-12 mx-auto drop-shadow leading-relaxed max-w-5xl"
          >
            Christian Professionals Network (CPN) is a platform to mentor and raise excellent, ethical professionals who will take over their industries and workplaces for The Kingdom, using practical Bible-based principles to rise to positions of influence and power.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-accent-600">Who We Are</h2>
        <p className="text-2xl sm:text-3xl text-primary-900 mb-6 font-semibold">
          Christian Professionals Network (CPN) is a vibrant community of faith-driven professionals dedicated to making a Kingdom impact in the marketplace.
        </p>
        <p className="text-xl sm:text-2xl text-gray-700">
          The name “CPN” stands for <b>Christian Professionals Network</b>, representing a place of refreshment, community, and growth for Christian leaders and professionals.
        </p>
      </section>

      {/* Mission, Vision, Promise with Icons and Contact Button */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-primary-900 p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <Target className="w-12 h-12 text-accent-600 mb-4" />
            <h3 className="text-2xl text-white font-bold mb-2">Our Mission</h3>
            <p className="text-lg text-white">To mentor and raise excellent, ethical professionals who will take over their industries and workplaces for The Kingdom, using practical Bible-based principles to rise to positions of influence and power.</p>
          </div>
          <div className="bg-primary p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <Eye className="w-12 h-12 text-accent-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
            <p className="text-lg text-gray-700">Rising ethical professionals who thrive in their industries through practical Bible-based principles.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <Handshake className="w-12 h-12 text-accent-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Promise</h3>
            <p className="text-lg text-gray-700">GOSHEN - Divine protection and favor (Exodus 8:20-23)</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Link to="/contactUs">
            <button className="bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50">
              Contact Us
            </button>
          </Link>
        </div>
      </section>

      {/* Values - Responsive layout with icons, icon stands alone */}
<section className="w-full bg-white py-12 px-4 sm:px-6">
  <h3 className="text-3xl font-extrabold text-primary-900 mb-8 text-center">
    Our Values
  </h3>
  <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-7xl mx-auto flex-wrap">
    {values.map((val, idx) => (
      <motion.div
        key={idx}
        className="flex flex-col items-center justify-center w-full max-w-xs min-h-[180px] text-center flex-shrink-0 mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.2, duration: 0.6, type: 'spring' }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent-600 mb-4 shadow-lg">
          {React.cloneElement(val.icon, { className: 'w-10 h-10 text-white' })}
        </div>
        <span className="text-lg font-semibold text-white mt-2 bg-primary-900 px-2 py-2 rounded-lg">
          {val.label}
        </span>
      </motion.div>
    ))}
  </div>
</section>

      {/* Commitments + Statement of Faith - joined, dark background */}
      <section className="w-full bg-gradient-to-br from-primary-800 to-primary-900 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-3"><CheckCircle className="w-8 h-8 text-accent-600" /> Our Commitments</h3>
            <ol className="list-decimal list-inside text-lg text-gray-200 space-y-3 font-medium">
              <li>Esteem the local church – we value and work to see it flourish.</li>
              <li>Remain apolitical – we honor and submit to local authorities as those put in place by God.</li>
              <li>Treat others with respect and dignity – we foster authentic relationships and respect all members.</li>
              <li>Promote safe spaces for sharing, learning, and growth in faith and work.</li>
              <li>Promote the common good of the Christian faith and act upon Christian values in the workplace</li>
            </ol>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-3"><Church className="w-8 h-8 text-accent-600" /> Statement of Faith</h3>
            <blockquote className="bg-primary-800 p-6 rounded-lg text-gray-100 italic text-lg font-small">
              So here’s what I want you to do, God helping you: Take your everyday, ordinary life—your sleeping, eating, going-to-work, and walking-around life—and place it before God as an offering. Embracing what God does for you is the best thing you can do for him.
              Don’t become so well-adjusted to your culture that you fit into it without even thinking. Instead, fix your attentio  on God.... -ROM 12: 1-2a MSG </blockquote>
          </div>
        </div>
      </section>

      {/* Team / Contributors */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
        <h3 className="text-3xl font-extrabold text-primary-900 mb-10 text-center">Meet Our Team & Contributors</h3>
        <div className="flex flex-wrap justify-center gap-10">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8">
              <img src={member.img} alt={member.name} className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-accent-600" />
              <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
              <p className="text-gray-600 font-semibold mb-2">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Connected</h3>
        <p className="text-lg text-gray-700 mb-6">Join our community, learn, and be inspired!</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href={podcastSource} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faSpotify} className="w-10 h-10 text-gray-900" /></a>
          <a href={clubhouseLink} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><img src={icon} className="w-10 h-10" alt="Clubhouse Icon" /></a>
          <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faInstagram} className="w-10 h-10 text-gray-900" /></a>
          <Link to="/register" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faWhatsapp} className="w-10 h-10 text-gray-900" /></Link>
        </div>
      </section>

      <JoinCommunityBanner />
    </div>
  );
}

export default About;
