// backend/index.js
import { recordAudio } from "./core/record.js";
import { transcribeAudio } from "./core/elevenlabs.js";
import { translateToEnglish, detectLanguage } from "./core/deepl.js";
import { mediate } from "./core/dispatcher.js";

async function run() {
  console.log("🎙️ Recording voice input (7 seconds)...");
  const file = await recordAudio("voice.wav", 7);

  const transcript = await transcribeAudio(file);
  if (!transcript || transcript.trim() === "") {
    console.error("❌ Transcription failed.");
    process.exit(1);
  }

  console.log(`\n📝 Original Transcript: "${transcript}"`);

  const inputLang = await detectLanguage(transcript);
  console.log(`🌍 Detected Language: ${inputLang}`);

  const english = await translateToEnglish(transcript);
  console.log(`🧠 Translated to English: "${english}"`);

  await mediate(english);
}

run();
