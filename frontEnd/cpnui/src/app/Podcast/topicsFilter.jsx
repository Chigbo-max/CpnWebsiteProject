import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTopic, clearFilters } from './podCastSlice';

const TopicsFilter = () => {
  const dispatch = useDispatch();
  const { topics, selectedTopic } = useSelector((state) => state.podcasts);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <button 
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-amber-600 transition-all duration-300 text-sm sm:text-base shadow-sm"
        onClick={() => dispatch(clearFilters())}
      >
        Clear Filters
      </button>
      <select
        value={selectedTopic}
        onChange={(e) => dispatch(setSelectedTopic(e.target.value))}
        className="w-full sm:w-48 md:w-56 lg:w-64 h-10 sm:h-11 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 bg-white shadow-sm text-sm sm:text-base"
      >
        <option value="">All Topics</option>
        {topics.map((topic, index) => (
          <option key={index} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopicsFilter;
