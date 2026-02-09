import { config } from "dotenv";
config();

import { makeGemini } from "./geminiClient";

async function testModels() {
  const genAI = makeGemini();
  
  const modelsToTry = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
  ];

  console.log("Testing Gemini models...\n");

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const text = result.response.text();
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(`Response: ${text}\n`);
      break;
    } catch (error: any) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`Error: ${error.message}\n`);
    }
  }
}

testModels();