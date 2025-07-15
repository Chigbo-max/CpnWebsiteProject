import React from 'react'
import NewsLetter from "../../components/newLetter/NewsLetter";
import bgImage from "../../assets/contact.jpeg"
import { motion } from "framer-motion"; 

const Contact = () => {
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
        <motion.h1 
          initial={{ x: "-100vw", opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-400 mb-4"
        >
          <span className="text-amber-400">Contact</span> Us
        </motion.h1>
        <motion.p
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-white text-lg mt-4"
        >
          Do you have questions about how to take our resources into your community? Do you have a topic suggestion? Do you want to know more about how you can engage further in the faith and work space in your region or are there other initiatives that you want us to know about? Please get in touch!
        </motion.p>
      </div>
      <section id="contact" className="py-12 bg-gray-50 rounded-xl">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="mb-6 text-gray-700">Our support team will get back to you ASAP via email.</p>
            <form>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input type="text" placeholder="Enter your name" id="name" className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div className="flex-1 flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <input type="email" placeholder="Enter your email" id="email" className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea name="message" rows={5} placeholder="Enter your Message" id="message" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg border-2 border-gray-900 transition-all duration-300 hover:bg-amber-600 hover:text-gray-900 hover:border-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50">Submit Ticket</button>
            </form>
          </div>
          <div className="flex-1 flex flex-col gap-8">
            <div className="mb-8">
              <NewsLetter/>
            </div>
            <div className="flex flex-col items-center w-full text-center bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Nigeria Data Protection Regulation (NDPR), 2019</h3>
              <p className="text-gray-700 max-w-xl mx-auto">
                We are committed to protecting your privacy. Whenever you use our website, complete an application form or contact us electronically, you consent to our processing of your personal information in accordance with the requirements of NDPR. In the event that you wish to revoke your consent, please send an email to cprofessionalsnetwork@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;




