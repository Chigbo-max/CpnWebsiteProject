import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTopic, clearFilters } from './podCastSlice';
import Style from "../../styles/Listen.module.css"

const TopicsFilter = () => {
  const dispatch = useDispatch();
  const { podcasts, selectedTopic } = useSelector(state => state.podcasts);

  const topics = [...new Set(podcasts.map(podcast => podcast.topic))];

  return (
    <div className="topics-filter">

        
      {/* {topics.map(topic => (
        <button
          key={topic}
          className={`topic-btn ${selectedTopic === topic.toLowerCase() ? 'active' : ''}`}
          onClick={() => dispatch(setSelectedTopic(topic))}
        >
          {topic}
        </button>
      ))} */}


      <button 
        className="clear-btn"
        onClick={() => dispatch(clearFilters())}
      >
        Clear Filters
      </button>
      <select
        value={selectedTopic}
        onChange={(e) => dispatch(setSelectedTopic(e.target.value))}
        className={Style.topicDropdown}
      >
        <option value="">All Topics</option>
        {topics.map(topic => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopicsFilter;