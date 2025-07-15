import React, { useEffect, useState } from "react";

const NewsLetter = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    console.log("rendering properly")
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
      <div className="flex flex-col gap-4 items-center p-4">
        <input 
          type="text" 
          name="name" 
          placeholder="Enter your name" 
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
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 ${
            theme === "dark" 
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
              : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <input 
          type="submit" 
          value="Subscribe" 
          className={`w-full px-6 py-3 rounded-lg font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 ${
            theme === "dark" 
              ? "bg-amber-600 hover:bg-amber-700 text-white" 
              : "bg-gray-900 hover:bg-amber-600 text-white"
          }`}
        />
        <p className={`text-xs sm:text-sm text-center ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>
          No spam guaranteed, So please don't send any spam mail.
        </p>
      </div>

      <button 
        onClick={() => setTheme(theme === "light" ? "dark" : "light")} 
        className={`mt-6 px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 mx-auto block ${
          theme === "dark" 
            ? "bg-amber-600 hover:bg-amber-700 text-white" 
            : "bg-gray-900 hover:bg-amber-600 text-white"
        }`}
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
};

export default NewsLetter;
