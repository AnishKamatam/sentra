// record.js
import fs from "fs";
import mic from "node-record-lpcm16";

export function recordAudio(filename = "voice.wav", durationSec = 7) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filename, { encoding: "binary" });

    const recorder = mic.record({
      sampleRate: 16000,
      threshold: 0,
      verbose: false,
      recordProgram: "sox", // Ensure 'sox' is installed
    });

    console.log(`🎙️ Recording for ${durationSec} seconds...`);
    recorder.stream().pipe(file);

    setTimeout(() => {
      recorder.stop();
      console.log("🛑 Recording stopped.");
      resolve(filename);
    }, durationSec * 1000);
  });
}
