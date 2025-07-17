import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import icon from "../../assets/clubhouse.svg";
import bgImage from "../../assets/cpnevent1.jpg";
import { motion } from 'framer-motion';
import { FaBullseye, FaEye, FaHandshake, FaLeaf, FaUsers, FaHandsHelping, FaBalanceScale, FaUserTie, FaChurch, FaRegCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Jane Doe', role: 'Founder & CEO', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'John Smith', role: 'Community Manager', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Mary Johnson', role: 'Content Lead', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
];

const values = [
  { icon: <FaLeaf className="text-3xl mb-2 text-amber-600" />, label: 'God-honouring stewardship' },
  { icon: <FaUsers className="text-3xl mb-2 text-amber-600" />, label: 'Authentic relationship' },
  { icon: <FaHandsHelping className="text-3xl mb-2 text-amber-600" />, label: 'Collaboration and co-creation' },
  { icon: <FaBalanceScale className="text-3xl mb-2 text-amber-600" />, label: 'Humility and integrity' },
  { icon: <FaUserTie className="text-3xl mb-2 text-amber-600" />, label: 'Skilful and diligent work' },
];

function About() {
  return (
    <div className="w-full">
      {/* Hero Section - Already updated */}
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
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />
        </div>
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-amber-400 text-lg sm:text-xl md:text-2xl font-semibold mb-4 tracking-wide"
          >
            Empowering Professionals for Kingdom Impact
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight mx-auto"
          >
            About <span className="text-amber-400">Christian Professionals Network</span>
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

      {/* Who We Are / Name Meaning */}
      <section className="max-w-7xl mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-amber-600">Who We Are</h2>
        <p className="text-2xl sm:text-3xl text-gray-700 mb-6 font-semibold">
          Christian Professionals Network (CPN) is a vibrant community of faith-driven professionals dedicated to making a Kingdom impact in the marketplace.
        </p>
        <p className="text-xl sm:text-2xl text-gray-500">
          The name “CPN” stands for <b>Christian Professionals Network</b>, representing a place of refreshment, community, and growth for Christian leaders and professionals.
        </p>
      </section>

      {/* Mission, Vision, Promise with Icons and Contact Button */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <FaBullseye className="text-5xl text-amber-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
            <p className="text-lg text-gray-700">To mentor and raise excellent, ethical professionals who will take over their industries and workplaces for The Kingdom, using practical Bible-based principles to rise to positions of influence and power.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <FaEye className="text-5xl text-amber-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
            <p className="text-lg text-gray-700">Rising ethical professionals who thrive in their industries through practical Bible-based principles.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <FaHandshake className="text-5xl text-amber-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Promise</h3>
            <p className="text-lg text-gray-700">GOSHEN - Divine protection and favor (Exodus 8:20-23)</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Link to="/contactUs">
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50">
              Contact Us
            </button>
          </Link>
        </div>
      </section>

      {/* Values - Horizontal layout with icons, icon stands alone */}
      <section className="w-full bg-gray-900 py-12 px-6">
        <h3 className="text-3xl font-extrabold text-amber-600 mb-8 text-center">Our Values</h3>
        <div className="flex flex-row justify-between gap-0 max-w-7xl mx-auto flex-wrap md:flex-nowrap">
          {values.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center w-64 min-h-[180px] text-center flex-shrink-0">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-600 mb-4 shadow-lg">
                {React.cloneElement(val.icon, { className: 'text-4xl text-white m-0' })}
              </div>
              <span className="text-lg font-semibold text-white mt-2 bg-gray-900 px-2 py-2 rounded-lg">{val.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Commitments + Statement of Faith - joined, dark background */}
      <section className="w-full bg-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-3"><FaRegCheckCircle className="text-amber-600" /> Our Commitments</h3>
            <ol className="list-decimal list-inside text-lg text-gray-200 space-y-3 font-medium">
              <li>Esteem the local church – we value and work to see it flourish.</li>
              <li>Remain apolitical – we honor and submit to local authorities as those put in place by God.</li>
              <li>Treat others with respect and dignity – we foster authentic relationships and respect all members.</li>
              <li>Promote safe spaces for sharing, learning, and growth in faith and work.</li>
              <li>Promote the common good of the Christian faith and act upon Christian values in business.</li>
            </ol>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-3"><FaChurch className="text-amber-600" /> Statement of Faith</h3>
            <blockquote className="bg-gray-800 p-6 rounded-lg text-gray-100 italic text-lg font-medium">
              I believe in God, the Father almighty, Creator of heaven and earth. And in Jesus Christ, his only Son, our Lord. He was conceived by the power of the Holy Spirit, born of the virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried, He descended into hell, on the third day He rose again from the dead, He ascended into heaven, and is seated at the right hand of God, the Father almighty, from there He will come again to judge the living and the dead. I believe in the Holy Spirit, the holy church, the communion of saints, the forgiveness of sins, the resurrection of the body, and the life everlasting. Amen.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Team / Contributors */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">Meet Our Team & Contributors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8">
              <img src={member.img} alt={member.name} className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-amber-600" />
              <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
              <p className="text-gray-600 font-semibold mb-2">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto py-12 px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Connected</h3>
        <p className="text-lg text-gray-700 mb-6">Join our community, learn, and be inspired!</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="https://open.spotify.com/show/2vmyOcrq7cFcKBMepGbpZP" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faSpotify} className="text-4xl text-gray-900" /></a>
          <a href="https://www.clubhouse.com/house/christian-professionals-network" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><img src={icon} className="w-10 h-10" alt="Clubhouse Icon" /></a>
          <a href="https://www.instagram.com/christianprofessionalsnetwork/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faInstagram} className="text-4xl text-gray-900" /></a>
          <a href="https://chat.whatsapp.com/GwBz6QmeDhQ1GhfoAaJ8KQ" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FontAwesomeIcon icon={faWhatsapp} className="text-4xl text-gray-900" /></a>
        </div>
      </section>
    </div>
  );
}

export default About;
