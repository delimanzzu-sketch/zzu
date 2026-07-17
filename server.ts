import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Mock Database for MIL-STD and Lessons Learned
const specDatabase = [
  {
    id: "MIL-STD-810H",
    title: "Environmental Engineering Considerations and Laboratory Tests",
    description: "Standard for environmental testing of defense equipment.",
    keywords: ["vibration", "shock", "temperature", "humidity", "salt fog"]
  },
  {
    id: "MIL-STD-1472H",
    title: "Human Engineering",
    description: "Design criteria for human-system integration.",
    keywords: ["ergonomics", "visibility", "reach", "control", "display"]
  }
];

const lessonsLearned = [
  {
    project: "K9 Update",
    issue: "Vibration induced failure in turret control board",
    resolution: "Added dampeners as per MIL-STD-810H Method 514.8",
    tags: ["turret", "vibration", "electronics"]
  }
];

// API Routes
app.post("/api/review-spec", async (req, res) => {
  try {
    const { draft } = req.body;
    
    const prompt = `
      You are a MIL-SPEC expert for Hanwha Aerospace. Review the following design draft and match it with relevant MIL-STD standards and lessons learned from our database.
      
      DATABASE:
      ${JSON.stringify(specDatabase)}
      
      LESSONS LEARNED:
      ${JSON.stringify(lessonsLearned)}
      
      DRAFT:
      ${draft}
      
      Provide a JSON response with:
      - relevantStandards: Array of { id, title, reason }
      - recommendations: Array of strings
      - risks: Array of strings
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Error in review-spec:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: "You are Smart-LAND Designer Assistant, an expert in land defense systems and MIL-SPEC. You help engineers with weight calculations, spec searches, and technical questions. Use professional, precise language."
      }
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
