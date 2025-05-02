// backend/core/deepl.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

export async function translateToEnglish(text) {
  const res = await axios.post("https://api-free.deepl.com/v2/translate", null, {
    params: {
      auth_key: DEEPL_API_KEY,
      text,
      target_lang: "EN",
    },
  });

  return res.data.translations[0].text;
}

export async function detectLanguage(text) {
  const res = await axios.post("https://api-free.deepl.com/v2/translate", null, {
    params: {
      auth_key: DEEPL_API_KEY,
      text,
      target_lang: "EN", // Required even though we're only detecting
    },
  });

  return res.data.translations[0].detected_source_language || "EN";
}
