import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Function to fetch a new access token
const fetchNewAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to get access token');
  }
};

export const fetchPodcasts = createAsyncThunk(
  'podcasts/fetchPodcasts',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      let token = getState().podcasts.accessToken;

      // If no token, fetch a new one
      if (!token) {
        token = await fetchNewAccessToken();
        dispatch(setAccessToken(token)); // Store in Redux
      }

      const showId = getState().podcasts.showId;
      let episodes = [];
      let offset = 0;
      let limit = 50; 

      while (true) {
        const response = await axios.get(
          `https://api.spotify.com/v1/shows/${showId}/episodes?limit=${limit}&offset=${offset}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        episodes = [...episodes, ...response.data.items];
        if (!response.data.next) break; // Stop if there's no next page
        offset += limit; // Increase offset for next batch
      }

      // ✅ Extract unique topics dynamically from episode descriptions
      const topics = [
        ...new Set(episodes.flatMap((ep) => ep.name)),
      ].filter(Boolean); // Remove undefined values

      return { episodes, topics };
    } catch (error) {
      if (error.response?.status === 401) {
        // If token expired, refresh and retry
        const newToken = await fetchNewAccessToken();
        dispatch(setAccessToken(newToken));
        return dispatch(fetchPodcasts()); // Retry API call
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const podcastSlice = createSlice({
  name: 'podcasts',
  initialState: {
    episodes: [],
    topics: [],
    selectedTopic: '',
    searchQuery: '',
    accessToken: null,
    showId: '2vmyOcrq7cFcKBMepGbpZP', 
    status: 'idle',
    error: null,
  },
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
      })
      .addCase(fetchPodcasts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedTopic, setSearchQuery, clearFilters, setAccessToken } =
  podcastSlice.actions;

export default podcastSlice.reducer;
