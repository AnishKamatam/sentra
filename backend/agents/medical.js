// agents/medical.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function medicalAgentHandler(userInput) {
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

  return response.data.choices[0].message.content;
}
