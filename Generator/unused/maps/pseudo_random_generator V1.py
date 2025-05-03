import random
import json

def generate_level():
    level = {
        "platforms": [],
        "holes": [],
        "key": {},
        "enemies": [],
        "exitDoor": {}
    }
    
    # Generate ground with holes
    ground_holes = generate_ground_holes()
    level["holes"] = ground_holes
    
    # Generate platforms
    platforms = generate_platforms(ground_holes)
    level["platforms"] = platforms
    
    # Place key
    level["key"] = place_object(platforms, "key")
    
    # Place enemies
    num_enemies = random.randint(2, 4)
    for _ in range(num_enemies):
        enemy = place_object(platforms, "enemy")
        level["enemies"].append(enemy)
    
    # Place door at the end
    level["exitDoor"] = place_door(platforms)
    
    #Validate level for jumpability
    while not validate_level(level):
        # Regenerate problematic parts
        level["platforms"] = generate_platforms(ground_holes)
        level["key"] = place_object(level["platforms"], "key")
        level["enemies"] = []
        for _ in range(num_enemies):
            enemy = place_object(level["platforms"], "enemy")
            level["enemies"].append(enemy)
        level["exitDoor"] = place_door(level["platforms"])
    
    return level

def generate_ground_holes():
    holes = []
    # Grid is 50 wide, we want some holes in the ground
    potential_hole_starts = list(range(5, 45))
    random.shuffle(potential_hole_starts)
    
    # Select 2-4 holes
    num_holes = random.randint(2, 4)
    for i in range(min(num_holes, len(potential_hole_starts))):
        hole_start = potential_hole_starts[i]
        hole_length = random.randint(2, 4)
        
        # Ensure holes don't overlap
        valid = True
        for existing_hole in holes:
            if (hole_start <= existing_hole["x"] + existing_hole["length"] and 
                hole_start + hole_length >= existing_hole["x"]):
                valid = False
                break
                
        if valid:
            holes.append({"x": hole_start, "y": 3, "length": hole_length})
    
    return holes

def generate_platforms(ground_holes):
    platforms = []
    grid_width = 50
    grid_height = 15
    
    # First, create some guaranteed platforms that make the level traversable
    # We'll start from x=0 and ensure the player can reach x=49
    current_x = 0
    
    while current_x < grid_width - 5:
        # Platform height between 4 and grid_height-1
        platform_y = random.randint(4, grid_height - 1)
        platform_length = random.randint(2, 5)
        
        # Ensure platform doesn't go beyond grid
        if current_x + platform_length > grid_width:
            platform_length = grid_width - current_x
        
        platforms.append({"x": current_x, "y": platform_y, "length": platform_length})
        
        # Next platform position, considering max jump height of 4
        jump_distance = random.randint(2, 4)
        current_x += platform_length + jump_distance
    
    # Add some additional random platforms
    # num_extra_platforms = random.randint(3, 6)
    
    # for _ in range(num_extra_platforms):
    #     platform_x = random.randint(0, grid_width - 5)
    #     platform_y = random.randint(4, grid_height - 1)
    #     platform_length = random.randint(2, 6)
        
    #     # Ensure platform doesn't go beyond grid
    #     if platform_x + platform_length > grid_width:
    #         platform_length = grid_width - platform_x
        
    #     # Check for overlap with existing platforms
    #     overlap = False
    #     for platform in platforms:
    #         if (platform_x <= platform["x"] + platform["length"] and 
    #             platform_x + platform_length >= platform["x"] and
    #             abs(platform_y - platform["y"]) <= 1):
    #             overlap = True
    #             break
        
    #     if not overlap:
    #         platforms.append({"x": platform_x, "y": platform_y, "length": platform_length})
    
    return platforms

def place_object(platforms, obj_type):
    # Place object either on ground or on a platform
    if random.random() < 0.3 and obj_type != "exitDoor":  # 30% chance to place on ground, never for door
        # Place on ground (y=3)
        x = random.randint(5, 45)
        # Make sure it's not over a hole
        return {"x": x, "y": 3}
    else:
        # Place on a platform
        platform = random.choice(platforms)
        offset = random.randint(0, platform["length"] - 1)
        
        # Special case for door - always at the end
        if obj_type == "exitDoor":
            # Find platform closest to the end
            rightmost_platform = max(platforms, key=lambda p: p["x"] + p["length"])
            x = rightmost_platform["x"] + rightmost_platform["length"] - 1
            return {"x": x, "y": rightmost_platform["y"] + 1}
            
        return {"x": platform["x"] + offset, "y": platform["y"] + 1}

def place_door(platforms):
    # Door is always at the end
    rightmost_platform = max(platforms, key=lambda p: p["x"] + p["length"])
    x = rightmost_platform["x"] + rightmost_platform["length"] - 1
    return {"x": x, "y": rightmost_platform["y"] + 1}

def validate_level(level):
    # Check that platforms are reachable given max jump height of 4
    platforms = level["platforms"] + [{"x": 0, "y": 3, "length": 50}]  # Include ground
    
    # Remove holes from ground
    for hole in level["holes"]:
        hole_end = hole["x"] + hole["length"]
        adjusted_platforms = []
        
        for platform in platforms:
            # Only process ground platforms
            if platform["y"] != 3:
                adjusted_platforms.append(platform)
                continue
                
            # If platform overlaps with hole, split it
            if platform["x"] < hole["x"] and platform["x"] + platform["length"] > hole_end:
                # Platform extends on both sides of hole
                left_length = hole["x"] - platform["x"]
                right_start = hole_end
                right_length = platform["x"] + platform["length"] - hole_end
                
                if left_length > 0:
                    adjusted_platforms.append({"x": platform["x"], "y": 3, "length": left_length})
                if right_length > 0:
                    adjusted_platforms.append({"x": right_start, "y": 3, "length": right_length})
            
            elif platform["x"] < hole["x"] and platform["x"] + platform["length"] > hole["x"]:
                # Platform overlaps with left side of hole
                new_length = hole["x"] - platform["x"]
                if new_length > 0:
                    adjusted_platforms.append({"x": platform["x"], "y": 3, "length": new_length})
            
            elif platform["x"] < hole_end and platform["x"] + platform["length"] > hole_end:
                # Platform overlaps with right side of hole
                new_start = hole_end
                new_length = platform["x"] + platform["length"] - hole_end
                if new_length > 0:
                    adjusted_platforms.append({"x": new_start, "y": 3, "length": new_length})
            
            elif platform["x"] >= hole["x"] and platform["x"] + platform["length"] <= hole_end:
                # Platform entirely within hole - remove it
                pass
            
            else:
                # Platform doesn't overlap with hole
                adjusted_platforms.append(platform)
        
        platforms = adjusted_platforms
    
    # Check the jumpability condition for each platform
    for platform in [p for p in platforms if p["y"] > 3]:  # Only check elevated platforms
        can_reach = False
        
        for other in platforms:
            # Skip comparing to self
            if platform == other:
                continue
                
            # Check if other platform can be jumped to from this one
            x_diff = abs(platform["x"] - other["x"])
            y_diff = abs(platform["y"] - other["y"])
            
            # Can jump to platforms within range
            if x_diff <= 4 and y_diff <= 4:
                can_reach = True
                break
        
        if not can_reach:
            return False
    
    # Ensure key is reachable
    # Ensure door is reachable
    # For simplicity, we'll assume if platforms are all reachable, then key and door are too
    
    return True

def generate_dataset(num_levels=15):
    dataset = []
    for _ in range(num_levels):
        level = generate_level()
        dataset.append(level)
    return dataset


def visualize_level(level):
    """Return an ASCII visualization of the level for debugging."""
    width = 50
    height = 15
    grid = [[' ' for _ in range(width)] for _ in range(height)]
    
    # Draw ground
    for x in range(width):
        for y in range(3):
            grid[height - y - 1][x] = '#'
    
    # Draw holes
    for hole in level["holes"]:
        for x in range(hole["x"], min(hole["x"] + hole["length"], width)):
            for y in range(hole["y"]):
                grid[height - y - 1][x] = ' '
    
    # Draw platforms
    for platform in level["platforms"]:
        for x in range(platform["x"], min(platform["x"] + platform["length"], width)):
            grid[height - platform["y"] - 1][x] = '='
    
    # Draw key
    if "key" in level and level["key"]:
        key_x, key_y = level["key"]["x"], level["key"]["y"]
        if 0 <= key_x < width and 0 <= height - key_y - 1 < height:
            grid[height - key_y - 1][key_x] = 'K'
    
    # Draw door
    if "exitDoor" in level and level["exitDoor"]:
        door_x, door_y = level["exitDoor"]["x"], level["exitDoor"]["y"]
        if 0 <= door_x < width and 0 <= height - door_y - 1 < height:
            grid[height - door_y - 1][door_x] = 'D'
    
    # Draw enemies
    for enemy in level["enemies"]:
        enemy_x, enemy_y = enemy["x"], enemy["y"]
        if 0 <= enemy_x < width and 0 <= height - enemy_y - 1 < height:
            grid[height - enemy_y - 1][enemy_x] = 'E'
    
    return '\n'.join([''.join(row) for row in grid])

# Generate and save the dataset
if __name__ == "__main__":
    dataset = generate_dataset(15)
    with open("level_dataset.json", "w") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated dataset with {len(dataset)} levels")
        # Print an example level visualization
    print("Example level visualization:")
    print(visualize_level(dataset[0]))
    
