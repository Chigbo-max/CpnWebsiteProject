import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTopic, clearFilters } from './podcastSlice';
import Style from '../../styles/TopicsFilter.module.css';

const TopicsFilter = () => {
  const dispatch = useDispatch();
  const { topics, selectedTopic } = useSelector((state) => state.podcasts);

  return (
    <div className={Style.filterContainer}>
      <button className={Style.clearBtn} onClick={() => dispatch(clearFilters())}>
        Clear Filters
      </button>
      <select
        value={selectedTopic}
        onChange={(e) => dispatch(setSelectedTopic(e.target.value))}
        className={Style.topicDropdown}
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
