// PodcastSearch.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from './podCastSlice';

const PodcastSearch = () => {
  const dispatch = useDispatch();

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by topic..."
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />
    </div>
  );
};

export default PodcastSearch;