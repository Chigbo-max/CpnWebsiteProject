import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

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
      });

    console.log("🎉 New Token Fetched:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Error Fetching Spotify Token:", error.response?.data || error);
  }
};

fetchNewAccessToken("2vmyOcrq7cFcKBMepGbpZP");
