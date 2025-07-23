import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useSubscribeNewsletterMutation } from '../../features/newsletter/newsletterApi';

const NewsLetter = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [subscribe,  { isLoading}] = useSubscribeNewsletterMutation();
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
      await subscribe(formData).unwrap();
      setSubmitStatus('success');
      setFormData({ name: '', email: '' });
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className={`relative p-6 sm:p-8 md:p-10 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${
      theme === "dark" 
        ? "bg-gray-800 text-white" 
        : "bg-white text-gray-900 border border-gray-200"
    }`}>
      <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}>
        Subscribe to receive future updates
      </h3>
      <p className={`text-sm sm:text-base md:text-lg mb-6 pb-4 border-b ${
        theme === "dark" ? "text-gray-300 border-gray-600" : "text-gray-600 border-gray-300"
      }`}>
        Stay up-to-date with our latest news, tips, and resources.
      </p>
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          theme === "dark" ? "bg-green-900/20 border border-green-700" : "bg-green-50 border border-green-200"
        }`}>
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-3" />
          <span className={theme === "dark" ? "text-green-300" : "text-green-800"}>
            Successfully subscribed to newsletter!
          </span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          theme === "dark" ? "bg-red-900/20 border border-red-700" : "bg-red-50 border border-red-200"
        }`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mr-3" />
          <span className={theme === "dark" ? "text-red-300" : "text-red-800"}>
      Failed to subscribe. Please try again.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center p-4">
        <input 
          type="text" 
          name="name" 
          placeholder="Enter your name" 
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
              : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email" 
          value={formData.email}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
              : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full px-6 py-3 rounded-lg font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === "dark" 
              ? "bg-amber-600 hover:bg-amber-700 text-white" 
              : "bg-gray-900 hover:bg-amber-600 text-white"
          }`}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
        <p className={`text-xs sm:text-sm text-center ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>
          No spam guaranteed, So please don&apos;t send any spam mail.
        </p>
      </form>
      <button 
        onClick={() => setTheme(theme === "light" ? "dark" : "light")} 
        className={`mt-6 px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 mx-auto block ${
          theme === "dark" 
            ? "bg-amber-600 hover:bg-amber-700 text-white" 
            : "bg-gray-900 hover:bg-amber-600 text-white"
        }`}
      >
        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
};

export default NewsLetter;
