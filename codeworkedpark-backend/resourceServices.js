// services/resourceService.js
const axios = require("axios");

async function fetchDynamicResources(query) {
  try {
    // Fetch YouTube tutorials
    const youtubeRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        q: `${query} tutorial`,
        part: "snippet",
        maxResults: 2,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const youtubeResources = youtubeRes.data.items.map(item => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    // Fetch GitHub Repositories
    const githubRes = await axios.get(`https://api.github.com/search/repositories`, {
      params: { q: `${query} project`, sort: "stars", order: "desc" }
    });

    const githubResources = githubRes.data.items.slice(0, 2).map(repo => ({
      title: repo.name,
      url: repo.html_url
    }));

    return [...youtubeResources, ...githubResources];
  } catch (error) {
    console.error("Error fetching resources:", error.message);
    return [];
  }
}

module.exports = { fetchDynamicResources };
