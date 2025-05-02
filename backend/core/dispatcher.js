// backend/core/dispatcher.js
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { fireAgentHandler } from "../agents/fire.js";
import { policeAgentHandler } from "../agents/police.js";
import { medicalAgentHandler } from "../agents/medical.js";
import { ngoAgentHandler } from "../agents/ngo.js";
import { printAgentResponse } from "../utils/printer.js";

// Setup .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const apiKey = process.env.PERPLEXITY_API_KEY;

// ✅ Flexible keywords
const AGENT_HANDLERS = {
  fire: fireAgentHandler,
  police: policeAgentHandler,
  medical: medicalAgentHandler,
  ngo: ngoAgentHandler,
};

export async function mediate(inputText) {
  console.log("🧭 Dispatcher received input:", inputText);

  const prompt = `
You are a dispatcher for a national disaster response system.
Given the emergency report, return the list of agents to activate and their instructions in JSON:

[
  {
    "agent": "Fire Department",
    "instructions": "Deploy two strike teams to the wildfire front and coordinate evacuation with police."
  },
  {
    "agent": "Emergency Medical Services",
    "instructions": "Triage children affected by smoke inhalation."
  }
]

Respond ONLY with raw JSON. No markdown or explanations.
Emergency report: "${inputText}"
`;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    let raw = response.data.choices?.[0]?.message?.content;
    raw = raw.replace(/```json|```/g, "").trim();

    const tasks = JSON.parse(raw);
    console.log("\n📦 Dispatcher routing to agents:");

    for (const task of tasks) {
      const normalized = task.agent.toLowerCase().replace("department", "").replace("services", "").trim();

      const handler = Object.entries(AGENT_HANDLERS).find(([key]) =>
        normalized.includes(key)
      )?.[1];

      if (handler) {
        console.log(`→ Activating ${task.agent}`);
        const result = await handler(task.instructions);
        printAgentResponse(task.agent, result);
      } else {
        console.log(`⚠️ No handler found for: ${task.agent}`);
      }
    }
  } catch (err) {
    console.error("❌ Dispatcher error:", err.response?.data || err.message);
  }
}
