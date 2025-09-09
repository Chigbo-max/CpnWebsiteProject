import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faRedo } from '@fortawesome/free-solid-svg-icons';

function ServerDown() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-16">
      <FontAwesomeIcon icon={faServer} className="text-amber-500 text-6xl mb-6 animate-pulse" />
      <h1 className="text-3xl sm:text-4xl font-black mb-4">Server Unavailable</h1>
      <h2 className="text-xl font-bold mb-2">Oops! Our server is currently unreachable.</h2>
      <p className="text-gray-300 mb-8 text-center max-w-md">
        Please check your internet connection or try again later. If the problem persists, contact support.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center bg-amber-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-amber-700 transition-colors"
        >
          <FontAwesomeIcon icon={faRedo} className="mr-2" />
          Retry
        </button>
        <a
          href="/"
          className="inline-flex items-center bg-gray-700 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-gray-600 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default ServerDown; 