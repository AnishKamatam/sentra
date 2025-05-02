// agents/fire.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function fireAgentHandler(userInput) {
  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `
You are a command-level fire response AI.
Your job is to assist emergency authorities in managing:
- Wildfires
- Urban fires
- Building collapse
- Rescue operations

Respond with:
- Strategic fire control actions
- Rescue/evacuation plans
- Inter-agency coordination needs
DO NOT provide civilian advice.
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
