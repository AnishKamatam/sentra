// agents/police.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function policeAgentHandler(userInput) {
  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `
You are a public safety coordination AI for police and law enforcement.
Respond to disasters by providing:
- Crowd control actions
- Perimeter security
- Support for evacuation and rescue
- Traffic redirection and law enforcement coordination

Respond with clear strategic directives for on-ground units.
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
