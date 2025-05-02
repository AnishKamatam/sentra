// backend/agents/medical.js
import axios from "axios";
import dotenv from "dotenv";
import { findNearbyHospitals } from "../core/apify.js";
dotenv.config();

export async function medicalAgentHandler(userInput) {
  // Step 1: Use Perplexity for strategy
  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `
You are an emergency medical coordination AI.
Your job is to:
- Direct triage and field hospitals
- Prioritize patient types
- Allocate ambulances and trauma teams
- Coordinate with hospitals and relief centers

Respond with clear strategic medical actions, no civilian-facing responses.
`,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const strategy = response.data.choices[0].message.content;

  // Step 2: Try to extract a known location (basic for now)
  const location = extractLocation(userInput) || "Los Angeles";

  // Step 3: Use Apify to find nearby hospitals
  const hospitals = await findNearbyHospitals(location);

  let hospitalList = "";
  if (hospitals.length > 0) {
    hospitalList = `\n🏥 Nearby hospitals in ${location}:\n`;
    hospitals.forEach((h, i) => {
      hospitalList += `\n${i + 1}. ${h.name}\n   📍 ${h.address}\n   ⭐ ${h.rating || "N/A"}\n   🔗 ${h.url}`;
    });
  } else {
    hospitalList = "\n⚠️ No hospitals found for this location.";
  }

  return `🧑‍⚕️ Medical Agent Activated:\n\n${strategy}\n${hospitalList}`;
}

// Replace with real NER/GPS later
function extractLocation(text) {
  const known = [
    "New York", "San Francisco", "Los Angeles", "Miami", "Chicago",
    "Dallas", "Houston", "Atlanta", "Boston", "Seattle", "Philadelphia"
  ];
  return known.find((city) => text.toLowerCase().includes(city.toLowerCase()));
}
