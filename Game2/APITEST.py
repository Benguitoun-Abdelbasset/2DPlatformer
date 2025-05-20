import requests
# Define the prompt to be sent
prompt =  """<|system|>
You are a helpful assistant that generates fun, creative, and playable 2D platformer levels in JSON.

<|user|>
Generate a JSON object representing a level for a 2D platformer game with the following properties:

- Level size: 50 tiles wide and 15 tiles high.
- The bottom 3 tiles (y=1 to y=3) are the ground.
- Holes can only appear in the ground and can be up to 4 tiles wide. No holes allowed in the first 5 tiles of the ground (x=0 to x=4).
- Platforms must be **reachable** by the player:
  - The player can jump up to 4 tiles high.
  - The player can jump up to 4 tiles across.
  - Platforms must be between y=4 and y=12 and not overlap with the ground.
- Platforms should be **spread across the level**, not clustered at the beginning.
- Between 2 and 6 platforms allowed.
- Between 0 and 3 holes allowed.
- The player starts at x=0, so no holes or enemies near that spot.
- The `key`, `exitDoor`, and up to 4 `enemies` must be placed:
  - Only on the ground or on a platform.
  - Not floating.
  - Enemies must be spaced out (not all bunched together).
- The `exitDoor` must be near the right edge (x > 40).
- `difficulty` is an integer from 1 (easy) to 5 (hard).

VERY IMPORTANT: IMAGINE THE PLAYER JUMPING THROUGH THE PLATFORMS

Return **only the JSON object** without explanation or extra text.

Follow this example structure, but generate a new, varied layout each time:

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

    <|assistant|>
    """

# Enter E-mail to generate API
api_key = '64e6c1d9457626a89e2d1eeea04ff27f'

# Define the default model if none is specified
default_model = 'gpt-3.5-turbo'

# Uncomment the model you want to use, and comment out the others
# model = 'gpt-4'
# model = 'gpt-4-32k'
# model = 'gpt-3.5-turbo-0125'
model = default_model

# Build the URL to call
api_url = f'http://195.179.229.119/gpt/api.php?prompt={requests.utils.quote(prompt)}&api_key={requests.utils.quote(api_key)}&model={requests.utils.quote(model)}'

try:
    # Execute the HTTP request
    response = requests.get(api_url)
    response.raise_for_status()  # Raise an error for bad HTTP status codes

    # Parse and print the response
    data = response.json()
    print(data)

except requests.RequestException as e:
    # Print any errors
    print(f'Request Error: {e}')
            