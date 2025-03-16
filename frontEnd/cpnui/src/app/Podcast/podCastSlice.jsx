import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewAccessToken } from './NewAccessToken';
import axios from 'axios';

// Fetch all episodes of a specific show
export const fetchPodcasts = createAsyncThunk(
  'podcasts/fetchPodcasts',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      let token = getState().podcasts.accessToken;

      if (!token) {
        token = await fetchNewAccessToken();
        dispatch(setAccessToken(token));
      }

      const showId = getState().podcasts.showId;
      let episodes = [];
      let offset = 0;
      const limit = 50;

      while (true) {
        const response = await axios.get(
          `https://api.spotify.com/v1/shows/${showId}/episodes?limit=${limit}&offset=${offset}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        episodes = [...episodes, ...response.data.items];
        if (!response.data.next) break;
        offset += limit;
      }

      const topics = [...new Set(episodes.map((ep) => ep.name))].filter(Boolean);

      return { episodes, topics };
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await fetchNewAccessToken();
        dispatch(setAccessToken(newToken));
        return dispatch(fetchPodcasts());
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch search results from Spotify API
export const fetchPodcastSearch = createAsyncThunk(
  'podcasts/fetchPodcastSearch',
  async (query, { getState, dispatch, rejectWithValue }) => {
    try {
      let token = getState().podcasts.accessToken;

      if (!token) {
        token = await fetchNewAccessToken();
        dispatch(setAccessToken(token));
      }

      const showId = getState().podcasts.showId;

      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=episode&limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filteredEpisodes = response.data.episodes.items.filter((ep) =>
        ep.show.id === showId
      );

      return filteredEpisodes;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  episodes: [],
  searchedEpisodes: [],
  cachedEpisodes: {},
  topics: [],
  selectedTopic: '',
  searchQuery: '',
  accessToken: null,
  showId: '2vmyOcrq7cFcKBMepGbpZP',
  status: 'idle',
  searchStatus: 'idle',
  error: null,
  episodesPerPage: 10,
  currentPage: 1,
};

const podcastSlice = createSlice({
  name: 'podcasts',
  initialState,
  reducers: {
    setSelectedTopic: (state, action) => {
      state.selectedTopic = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.selectedTopic = '';
      state.searchQuery = '';
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setEpisodesPerPage: (state, action) => {
      state.episodesPerPage = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPodcasts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPodcasts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.episodes = action.payload.episodes;
        state.topics = action.payload.topics;
        state.cachedEpisodes[state.currentPage] = action.payload.episodes;
      })
      .addCase(fetchPodcasts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPodcastSearch.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(fetchPodcastSearch.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchedEpisodes = action.payload;
      })
      .addCase(fetchPodcastSearch.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedTopic,
  setSearchQuery,
  clearFilters,
  setAccessToken,
  setCurrentPage,
  setEpisodesPerPage,
} = podcastSlice.actions;

export default podcastSlice.reducer;
