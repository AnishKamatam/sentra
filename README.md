# 🌐 SentraAI – Real-Time, Voice-Driven Disaster Response

SentraAI is a multilingual, voice-activated disaster response system that leverages AI agents to route emergencies to the appropriate responders in real time. Built during the AWS Startup Loft: MCP + A2A hackathon, SentraAI bridges communication gaps and accelerates crisis coordination.

## 🚨 What It Does

When disaster strikes, SentraAI enables users to report emergencies through voice input in any language. The system:

- **Transcribes** the voice input using ElevenLabs.
- **Translates** the transcription to English via DeepL, if necessary.
- **Determines** the appropriate response agent (Fire, Police, Medical, NGO) using Perplexity Sonar Pro.
- **Dispatches** structured data to the selected agent handler.
- **Retrieves** contextual information (e.g., nearby hospitals) using Apify.
- **Displays** the incident on a live map along with the agent's response.

## 🧱 How We Built It

- **Voice Input**: ElevenLabs API for high-accuracy transcription.
- **Translation**: DeepL API for handling multilingual inputs.
- **AI Reasoning**: Perplexity Sonar Pro to select the appropriate agent.
- **Routing Engine**: A central dispatcher that formats data into MCP and routes it to modular agent handlers.
- **Location Intelligence**: Apify API to fetch real-world context (e.g., nearest emergency facilities).
- **Frontend**: React + Tailwind CSS with Google Maps integration.

## ⚠️ Challenges We Faced

- Building a modular agent system that could interact via MCP format.
- Extracting structured location data from unstructured voice input.
- Orchestrating multiple asynchronous APIs in real time.
- Creating a usable voice interface with minimal friction.

## 🏆 Accomplishments

- Developed a fully functional multi-agent disaster response system in under 6 hours.
- Seamlessly integrated three sponsor tools: DeepL, Perplexity, and Apify.
- Enabled voice-based emergency reporting with real-time map visualization.
- Designed a dispatcher architecture that mimics real-world emergency communication systems.

## 📚 What We Learned

- Designing and implementing a multi-agent coordination system using MCP.
- Managing asynchronous API calls effectively.
- Enhancing user experience through voice interfaces.
