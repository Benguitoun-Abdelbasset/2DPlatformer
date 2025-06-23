# Very Easy (Difficulty 1)
PROMPT_DIFFICULTY_1 = """
Generate a JSON object representing a level for a 2D platformer game with these properties:
- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground, forming a solid base.
- Holes in ground (y=1 to y=3), 1 to 2 holes, each 1-2 tiles wide, placed only between x=5 and x=45 to avoid player start (x=0 to x=4) and exit door area (x>40).
- Platforms between y=3 and y=8, 2 to 3 platforms, each 2-4 tiles long, placed between x=5 and x=45.
- Platforms must be reachable by a player with a max 4-tile jump height and 4-tile jump distance (horizontally or diagonally). Ensure platforms are spaced 1-4 tiles apart horizontally and vertically for easy jumps.
- No platforms overlap ground or holes, and no platforms are directly above holes to avoid tricky jumps.
- Player starts at x=0, y=3 (on ground).
- Place 1 'key' on ground or a platform, reachable by simple jumps from x=0, y=3, within x=5 to x=30 for early collection.
- Place 1 'exitDoor' on ground (y=3) between x=41 and x=48.
- Place 0 to 1 'enemies' on ground or platforms, between x=10 and x=40, avoiding proximity to key, exitDoor, or player start.
- Difficulty: 1 (Very Easy). Prioritize simplicity, wide platforms, and minimal threats.
- Ensure the level layout is unique, with varied platform and hole positions compared to previously generated levels. Avoid repetitive patterns or clustering.
Return only the JSON object, following this example format:
{
  "platforms": [
    { "x": 10, "y": 5, "length": 4 },
    { "x": 20, "y": 7, "length": 3 }
  ],
  "holes": [
    { "x": 15, "y": 3, "length": 2 }
  ],
  "key": { "x": 11, "y": 5 },
  "enemies": [
    { "x": 25, "y": 3 }
  ],
  "exitDoor": { "x": 45, "y": 3 },
  "difficulty": 1
}
"""

# Easy (Difficulty 2)
PROMPT_DIFFICULTY_2 = """
Generate a JSON object representing a level for a 2D platformer game with these properties:
- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground.
- Holes in ground (y=1 to y=3), 1 to 3 holes, each 1-3 tiles wide, placed between x=5 and x=45 to avoid player start (x=0 to x=4) and exit door area (x>40).
- Platforms between y=3 and y=9, 3 to 4 platforms, each 2-4 tiles long, placed between x=5 and x=45.
- Platforms must be reachable by a player with a max 4-tile jump height and 4-tile jump distance. Ensure platforms form a navigable path with jumps of 2-4 tiles horizontally or vertically.
- Allow slight clustering of platforms (e.g., two platforms 1-2 tiles apart vertically) for mild challenge, but avoid stacking directly above holes.
- No platforms overlap ground or holes.
- Player starts at x=0, y=3 (on ground).
- Place 1 'key' on ground or a platform, reachable from x=0, y=3 via clear jump paths, placed between x=10 and x=35.
- Place 1 'exitDoor' on ground (y=3) between x=41 and x=48.
- Place 1 to 2 'enemies' on ground or platforms, between x=10 and x=40, spaced at least 8 tiles apart, avoiding key, exitDoor, or player start.
- Difficulty: 2 (Easy). Emphasize clear paths, moderate platform variety, and low enemy density.
- Ensure the level layout is unique, with creative platform and hole arrangements. Avoid repetitive or overly similar designs.
Return only the JSON object, following this example format:
{
  "platforms": [
    { "x": 8, "y": 6, "length": 3 },
    { "x": 18, "y": 8, "length": 4 },
    { "x": 30, "y": 5, "length": 3 }
  ],
  "holes": [
    { "x": 12, "y": 3, "length": 2 },
    { "x": 28, "y": 3, "length": 3 }
  ],
  "key": { "x": 19, "y": 8 },
  "enemies": [
    { "x": 10, "y": 3 },
    { "x": 32, "y": 5 }
  ],
  "exitDoor": { "x": 46, "y": 3 },
  "difficulty": 2
}
"""

# Medium (Difficulty 3)
PROMPT_DIFFICULTY_3 = """
Generate a JSON object representing a level for a 2D platformer game with these properties:
- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground.
- Holes in ground (y=1 to y=3), 2 to 3 holes, each 2-4 tiles wide, placed between x=5 and x=45 to avoid player start (x=0 to x=4) and exit door area (x>40).
- Platforms between y=3 and y=10, 3 to 5 platforms, each 2-3 tiles long, placed between x=5 and x=45.
- Platforms must be reachable by a player with a max 4-tile jump height and 4-tile jump distance. Design a mix of easy (2-3 tile) and precise (4-tile) jumps, with some platforms staggered vertically for challenge.
- Allow moderate clustering (e.g., platforms at different heights within 3-4 tiles horizontally), but ensure no platforms are directly above holes unless a safe landing is nearby.
- No platforms overlap ground or holes.
- Player starts at x=0, y=3 (on ground).
- Place 1 'key' on a platform, reachable from x=0, y=3 via a series of jumps, placed between x=15 and x=40, requiring at least one platform-to-platform jump.
- Place 1 'exitDoor' on ground (y=3) between x=41 and x=48.
- Place 2 to 3 'enemies' on ground or platforms, between x=10 and x=40, spaced at least 6 tiles apart, avoiding direct proximity to key or exitDoor.
- Difficulty: 3 (Medium). Focus on varied jump patterns, moderate enemy presence, and strategic key placement.
- Ensure the level layout is unique, with diverse platform heights, hole placements, and enemy positions. Avoid repetitive or predictable designs.
Return only the JSON object, following this example format:
{
  "platforms": [
    { "x": 7, "y": 7, "length": 3 },
    { "x": 15, "y": 9, "length": 2 },
    { "x": 25, "y": 6, "length": 3 },
    { "x": 35, "y": 8, "length": 2 }
  ],
  "holes": [
    { "x": 10, "y": 3, "length": 3 },
    { "x": 30, "y": 3, "length": 2 }
  ],
  "key": { "x": 16, "y": 9 },
  "enemies": [
    { "x": 8, "y": 7 },
    { "x": 26, "y": 6 },
    { "x": 36, "y": 3 }
  ],
  "exitDoor": { "x": 47, "y": 3 },
  "difficulty": 3
}
"""

# Hard (Difficulty 4)
PROMPT_DIFFICULTY_4 = """
Generate a JSON object representing a level for a 2D platformer game with these properties:
- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground.
- Holes in ground (y=1 to y=3), 2 to 4 holes, each 2-4 tiles wide, placed between x=5 and x=45 to avoid player start (x=0 to x=4) and exit door area (x>40).
- Platforms between y=3 and y=11, 4 to 6 platforms, each 1-3 tiles long, placed between x=5 and x=45.
- Platforms must be reachable by a player with a max 4-tile jump height and 4-tile jump distance. Include a mix of short platforms requiring precise 3-4 tile jumps, with some staggered at different heights (1-4 tiles vertically apart).
- Allow platforms to be near (but not directly above) holes for added risk, with safe alternate paths available.
- No platforms overlap ground or holes.
- Player starts at x=0, y=3 (on ground).
- Place 1 'key' on a platform, reachable from x=0, y=3 via a challenging series of jumps, placed between x=20 and x=40, requiring at least two platform-to-platform jumps and one precise jump.
- Place 1 'exitDoor' on ground (y=3) between x=41 and x=48.
- Place 3 to 4 'enemies' on ground or platforms, between x=10 and x=40, spaced at least 5 tiles apart, with at least one enemy near a key jump path (but not on the key’s platform).
- Difficulty: 4 (Hard). Emphasize precision jumps, strategic enemy placement, and a challenging key path.
- Ensure the level layout is unique, with varied platform arrangements, hole patterns, and enemy positions. Avoid repetitive or overly simple designs.
Return only the JSON object, following this example format:
{
  "platforms": [
    { "x": 6, "y": 6, "length": 2 },
    { "x": 12, "y": 9, "length": 3 },
    { "x": 20, "y": 7, "length": 2 },
    { "x": 30, "y": 10, "length": 2 },
    { "x": 38, "y": 8, "length": 3 }
  ],
  "holes": [
    { "x": 8, "y": 3, "length": 4 },
    { "x": 25, "y": 3, "length": 3 },
    { "x": 35, "y": 3, "length": 2 }
  ],
  "key": { "x": 31, "y": 10 },
  "enemies": [
    { "x": 7, "y": 6 },
    { "x": 13, "y": 9 },
    { "x": 21, "y": 7 },
    { "x": 39, "y": 3 }
  ],
  "exitDoor": { "x": 46, "y": 3 },
  "difficulty": 4
}
"""

# Very Hard (Difficulty 5)
PROMPT_DIFFICULTY_5 = """
Generate a JSON object representing a level for a 2D platformer game with these properties:
- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground.
- Holes in ground (y=1 to y=3), 3 to 4 holes, each 3-4 tiles wide, placed between x=5 and x=45 to avoid player start (x=0 to x=4) and exit door area (x>40).
- Platforms between y=3 and y=12, 4 to 6 platforms, each 1-2 tiles long, placed between x=5 and x=45.
- Platforms must be reachable by a player with a max 4-tile jump height and 4-tile jump distance. Design for maximum challenge with precise 4-tile jumps (horizontally or vertically), platforms staggered at varying heights, and some near holes for high risk.
- Ensure a navigable path exists, but allow platforms above or near holes to test precision, with minimal safe landings.
- No platforms overlap ground or holes.
- Player starts at x=0, y=3 (on ground).
- Place 1 'key' on a platform, reachable from x=0, y=3 via a highly challenging series of jumps, placed between x=25 and x=40, requiring at least three platform-to-platform jumps, including two precise 4-tile jumps.
- Place 1 'exitDoor' on ground (y=3) between x=41 and x=48.
- Place 4 'enemies' on ground or platforms, between x=10 and x=40, spaced at least 4 tiles apart, with at least two enemies along the key’s jump path (but not on the key’s platform).
- Difficulty: 5 (Very Hard). Prioritize tight platforming, high enemy density, and a perilous key path.
- Ensure the level layout is unique, with highly varied platform placements, hole patterns, and enemy positions. Avoid any repetitive or predictable designs.
Return only the JSON object, following this example format:
{
  "platforms": [
    { "x": 5, "y": 7, "length": 2 },
    { "x": 11, "y": 10, "length": 1 },
    { "x": 18, "y": 8, "length": 2 },
    { "x": 25, "y": 11, "length": 1 },
    { "x": 33, "y": 9, "length": 2 }
  ],
  "holes": [
    { "x": 7, "y": 3, "length": 4 },
    { "x": 15, "y": 3, "length": 3 },
    { "x": 28, "y": 3, "length": 4 },
    { "x": 38, "y": 3, "length": 3 }
  ],
  "key": { "x": 26, "y": 11 },
  "enemies": [
    { "x": 6, "y": 7 },
    { "x": 12, "y": 10 },
    { "x": 19, "y": 8 },
    { "x": 34, "y": 9 }
  ],
  "exitDoor": { "x": 47, "y": 3 },
  "difficulty": 5
}
"""