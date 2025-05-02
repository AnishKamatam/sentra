// backend/core/apify.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;

export async function findNearbyHospitals(location = "Los Angeles, USA", limit = 5) {
  try {
    const input = {
      searchStringsArray: ["hospital"],
      locationQuery: location,
      maxCrawledPlacesPerSearch: limit,
      language: "en",
      searchMatching: "all",
      scrapePlaceDetailPage: true
    };

    const res = await axios.post(
      `https://api.apify.com/v2/acts/nwua9Gu5YrADL7ZDj/runs?token=${APIFY_TOKEN}`,
      input,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const runId = res.data.data.id;

    // Wait for results
    const datasetUrl = `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`;
    console.log("⏳ Waiting for Apify actor run to finish...");

    let data = [];
    while (data.length === 0) {
      const datasetRes = await axios.get(datasetUrl);
      data = datasetRes.data;
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s
    }

    return data.slice(0, limit).map(place => ({
      name: place.title,
      address: place.address,
      rating: place.totalScore,
      url: place.url
    }));
  } catch (err) {
    console.error("❌ Apify hospital lookup failed:", err.response?.data || err.message);
    return [];
  }
}
