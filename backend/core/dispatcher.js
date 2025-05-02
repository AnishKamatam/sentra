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

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const apiKey = process.env.PERPLEXITY_API_KEY;

// Map known agent types to handlers
const AGENT_HANDLERS = {
  "firefighter department": fireAgentHandler,
  "police department": policeAgentHandler,
  "emergency medical services": medicalAgentHandler,
  "medical department": medicalAgentHandler,
  "ngo": ngoAgentHandler,
  "relief organization": ngoAgentHandler,
};

export async function mediate(inputText) {
  console.log("🧭 Dispatcher received input:", inputText);

  const prompt = `
You are the dispatcher for a national disaster response system.
Given a user's emergency report, determine which departments should respond and provide their action plans.

Respond ONLY with a JSON array like:

[
  {
    "agent": "Police Department",
    "instructions": "Secure evacuation route and control crowd near downtown LA."
  },
  {
    "agent": "Firefighter Department",
    "instructions": "Deploy two strike teams to wildfire front on the western perimeter."
  }
]

Do NOT include markdown, explanation, or commentary.
User Report: "${inputText}"
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
      const agentKey = task.agent.toLowerCase();
      const handler = Object.entries(AGENT_HANDLERS).find(([key]) =>
        agentKey.includes(key)
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
    console.error("❌ Dispatcher error:", err.message);
  }
}
