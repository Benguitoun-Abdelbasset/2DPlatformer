from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import uvicorn
import json

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API key
API_KEY = "AIzaSyBU0mYxUE0AJVFZcmN_xXx6MeKDGejS4Rw"


# Gemini client
client = genai.Client(api_key=API_KEY)



# Pydantic model (optional for future data validation)
class EchoRequest(BaseModel):
    pass  # You can add fields if needed

# Remove first and last line (optional cleanup)
def strip_first_and_last_line(text: str) -> str:
    lines = text.split('\n')
    if len(lines) <= 2:
        return ""
    return "\n".join(lines[1:-1])

# Call Gemini
async def call_gemini(diff):
    try:
        difficulty = diff
        # Gemini prompt
        PROMPT = f"""
        Generate a JSON object representing a level for a 2D platformer game with these properties:

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

        This time the level will be of difficulty {difficulty}

        Return only the JSON object without explanation or extra text.

        Example format:
        """
        PROMPT += """
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
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=PROMPT
        )
        return strip_first_and_last_line(response.text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return json.dumps({"error": str(e)})

# API route
@app.post("/api/level")
async def api_echo(request: Request):
    data = await request.json()
    print("Received request:", data)
    reply = await call_gemini(data["difficulty"])
    print("returning reply: ",reply)
    return json.loads(reply)

# Run with Uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
