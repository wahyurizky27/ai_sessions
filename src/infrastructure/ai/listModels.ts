import { config } from "dotenv";
config();

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");
    return;
  }

  try {
    console.log("Fetching available models...\n");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("Available models:\n");
    
    if (data.models && data.models.length > 0) {
      data.models.forEach((model: any) => {
        console.log(`✅ ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(", ")}`);
        console.log();
      });
    } else {
      console.log("No models found or API key invalid.");
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

listAvailableModels();