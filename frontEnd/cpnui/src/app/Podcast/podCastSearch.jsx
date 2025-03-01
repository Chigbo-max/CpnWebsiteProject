import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from './PodcastSlice';
import Style from '../../styles/Listen.module.css';

const PodcastSearch = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.podcasts.searchQuery);

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      placeholder="Search podcasts..."
      className={Style.searchBox}
    />
  );
};

export default PodcastSearch;
