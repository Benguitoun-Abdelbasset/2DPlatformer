import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

   const prompt = `Generate a JSON object representing a level for a 2D platformer game with these properties:

- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground.
- Holes only in ground, up to 4 tiles wide, avoid holes near player start (x=0 to x=4).
- Platforms between y=4 and y=12, not overlapping ground, reachable by player (max 4 tiles jump height and distance).
- Platforms spread across level; some clustering allowed for challenge.
- Between 2 and 6 platforms.
- Between 0 and 3 holes.
- Player starts at x=0, so no holes or enemies near there.
- Place a 'key', 'exitDoor', and up to 4 'enemies' on ground or platforms, not floating.
- Enemies spaced out.
- Exit door near right edge (x > 40).
- Difficulty: integer 1 (easy) to 5 (hard).
- for the platforms you seem to be making them too long
VERY IMPORTANT: Imagine the player jumping through the platforms.

Each generated level should be unique, creative, and varied in layout, avoiding repetitive patterns.

Return only the JSON object without explanation or extra text.


Example format:

{
  "platforms": [
    { "x": 6, "y": 6, "length": 5 },
    { "x": 20, "y": 8, "length": 4 },
    { "x": 35, "y": 7, "length": 3 }
  ],
  "holes": [
    { "x": 15, "y": 0, "length": 3 }
  ],
  "key": { "x": 36, "y": 8 },
  "enemies": [
    { "x": 10, "y": 3 },
    { "x": 25, "y": 9 }
  ],
  "exitDoor": { "x": 47, "y": 3 },
  "difficulty": 3
}
`
const ai = new GoogleGenAI({ apiKey: "AIzaSyBU0mYxUE0AJVFZcmN_xXx6MeKDGejS4Rw" });

function stripFirstAndLastLine(str) {
  const lines = str.split('\n');
  if (lines.length <= 2) return ''; // Not enough lines to keep anything
  const middleLines = lines.slice(1, -1);
  return middleLines.join('\n');
}



const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from your HTML
app.use(express.json()); // Parse JSON bodies

async function callGemini() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return(stripFirstAndLastLine(response.text));
}

// Example POST endpoint
app.post("/api/echo", async(req, res) => {
  const message = await callGemini();
  console.log(message);
  res.json({ reply: message });
});




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});