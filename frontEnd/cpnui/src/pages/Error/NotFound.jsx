import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-16">
    <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 text-6xl mb-6 animate-bounce" />
    <h1 className="text-5xl font-black mb-4">404</h1>
    <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
    <p className="text-gray-300 mb-8 text-center max-w-md">
      Sorry, the page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="inline-flex items-center bg-amber-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-amber-700 transition-colors"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
      Go Back Home
    </Link>
  </div>
);

export default NotFound; 