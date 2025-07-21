import { useState } from 'react';
import NewsLetter from "../../components/newLetter/NewsLetter";
import bgImage from "../../assets/contact.jpeg";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useSubmitContactMutation } from '../../features/contact/contactApi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      await submitContact(formData).unwrap();
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="w-full">
      {/* Full-Width Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 sm:pt-24 md:pt-32">
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight mx-auto"
          >
            <span className="text-amber-400">Contact</span> Us
          </motion.h1>
          <motion.p
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 mx-auto drop-shadow leading-relaxed max-w-4xl"
          >
            Do you have questions about how to take our resources into your community? Do you have a topic suggestion? Do you want to know more about how you can engage further in the faith and work space in your region or are there other initiatives that you want us to know about? Please get in touch!
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <section id="contact" className="py-12 bg-white rounded-2xl shadow-xl">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 px-6">
              <div className="flex-1 bg-gray-50 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="mb-6 text-gray-700">Our support team will get back to you ASAP via email.</p>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-3" />
                    <span className="text-green-800">Message sent successfully! We&apos;ll get back to you soon.</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mr-3" />
                    <span className="text-red-800">Failed to send message. Please try again.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 flex flex-col">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your name" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">Your Email</label>
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400" 
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <textarea 
                      name="message" 
                      rows={5} 
                      placeholder="Enter your Message" 
                      id="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg border-2 border-gray-900 transition-all duration-300 hover:bg-amber-600 hover:text-gray-900 hover:border-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Submit Ticket'}
                  </button>
                </form>
              </div>
              <div className="flex-1 flex flex-col gap-8">
                <div className="mb-8">
                  <NewsLetter/>
                </div>
                <div className="flex flex-col items-center w-full text-center bg-gray-50 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Nigeria Data Protection Regulation (NDPR), 2019</h3>
                  <p className="text-gray-700 max-w-xl mx-auto">
                    We are committed to protecting your privacy. Whenever you use our website, complete an application form or contact us electronically, you consent to our processing of your personal information in accordance with the requirements of NDPR. In the event that you wish to revoke your consent, please send an email to cprofessionalsnetwork@gmail.com.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;




