from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import uvicorn
import json
import verifyLevel
from Prompts import (
    PROMPT_DIFFICULTY_1,
    PROMPT_DIFFICULTY_2,
    PROMPT_DIFFICULTY_3,
    PROMPT_DIFFICULTY_4,
    PROMPT_DIFFICULTY_5
)
# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_level_prompt(difficulty: int) -> str:
    prompt_map = {
        1: PROMPT_DIFFICULTY_1,
        2: PROMPT_DIFFICULTY_2,
        3: PROMPT_DIFFICULTY_3,
        4: PROMPT_DIFFICULTY_4,
        5: PROMPT_DIFFICULTY_5
    }
    
    if difficulty not in prompt_map:
        raise ValueError("Difficulty must be an integer between 1 and 5.")
    
    return prompt_map[difficulty]


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
        PROMPT = get_level_prompt(diff)

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
    reply = await call_gemini(data["difficulty"])
    reply1=verifyLevel.fixLevelItems(json.loads(reply))
    return json.loads(reply)

# Run with Uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
