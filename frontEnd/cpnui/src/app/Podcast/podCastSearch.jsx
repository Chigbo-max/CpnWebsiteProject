import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from './PodcastSlice';

const PodcastSearch = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.podcasts.searchQuery);

  return (
    <div className="w-full sm:w-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        placeholder="Search podcasts..."
        className="w-full sm:w-64 md:w-80 lg:w-96 h-10 sm:h-11 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 bg-white shadow-sm text-sm sm:text-base"
      />
    </div>
  );
};

export default PodcastSearch;