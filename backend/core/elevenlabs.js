// elevenlabs.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export async function transcribeAudio(filePath) {
  const form = new FormData();
  form.append("audio", fs.createReadStream(filePath), {
    filename: "voice.wav",
    contentType: "audio/wav",
  });
  form.append("file", fs.createReadStream(filePath), {
    filename: "voice.wav",
    contentType: "audio/wav",
  });
  form.append("model_id", "scribe_v1");

  console.log("📤 Uploading to ElevenLabs...");

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      ...form.getHeaders(),
    },
    body: form,
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    if (json.text) return json.text;
    console.error("❌ No 'text' field in response.");
    return "";
  } catch (err) {
    console.error("❌ Failed to parse ElevenLabs response as JSON:", err.message);
    return "";
  }
}
