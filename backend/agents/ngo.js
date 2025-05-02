// agents/ngo.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function ngoAgentHandler(userInput) {
  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `
You are a humanitarian operations AI supporting NGOs.
Your role is to:
- Mobilize volunteers
- Coordinate food, water, shelter logistics
- Set up relief camps
- Support displaced civilians

Respond with logistics-oriented directives. Do not advise civilians directly.
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
