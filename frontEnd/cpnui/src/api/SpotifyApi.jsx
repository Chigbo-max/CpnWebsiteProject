import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const base64Credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
console.log(base64Credentials)

export const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }), // Proper URL encoding
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          "Content-Type": "application/x-www-form-urlencoded", // ✅ Valid Header Format
        },
      }
    );

    console.log("🎉 New Token Fetched:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error Fetching Spotify Token:", error.response?.data || error);
    return null;
  }
};
