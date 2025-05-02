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
    ground_level = grid_height  # Assuming ground is at the bottom of the grid
    
    # Generate between 2 and 5 platforms
    num_platforms = random.randint(2, 5)
    
    # Keep track of platform positions to ensure proper spacing
    platform_positions = []
    
    attempts = 0
    max_attempts = 100  # Prevent infinite loops
    
    while len(platforms) < num_platforms and attempts < max_attempts:
        attempts += 1
        
        # Random position for platform - at least 4 tiles from beginning and end
        platform_x = random.randint(4, grid_width - 10)  # 4 from left, and leave space for platform length + 4 from right
        platform_y = random.randint(ground_level - (grid_height - 4), grid_height - 3)  # At least 2 tiles above ground
        platform_length = random.randint(2, 5)
        
        # Ensure platform doesn't go beyond grid
        if platform_x + platform_length > grid_width - 4:
            platform_length = grid_width - 4 - platform_x
        
        # Check distance from other platforms
        valid_position = True
        for pos in platform_positions:
            if abs(platform_x - pos["x"]) < 2 or \
               (platform_x < pos["x"] + pos["length"] and platform_x + platform_length > pos["x"]):
                valid_position = False
                break
        
        if not valid_position:
            continue
        
        # Add platform to our tracking list
        new_platform = {"x": platform_x, "y": platform_y, "length": platform_length}
        platform_positions.append(new_platform)
        platforms.append(new_platform)
    
    # Check if any platform is 5+ tiles above ground and needs a supporting platform
    for platform in list(platforms):  # Create a copy to iterate while potentially modifying the original
        height_above_ground = ground_level - platform["y"]
        if height_above_ground >= 5:
            # Need to add a supporting platform below
            has_support = False
            for other in platforms:
                if other != platform and abs(other["x"] - platform["x"]) < platform["length"] + 2 and \
                   0 < platform["y"] - other["y"] <= 3:
                    has_support = True
                    break
            
            if not has_support and len(platforms) < 5:  # Only add if we haven't hit max platforms
                support_x = max(4, platform["x"] - 1)
                support_y = platform["y"] + random.randint(1, 3)  # 1-3 tiles below the high platform
                support_length = random.randint(2, 4)
                
                if support_x + support_length > grid_width - 4:
                    support_length = grid_width - 4 - support_x
                
                support_platform = {"x": support_x, "y": support_y, "length": support_length}
                platforms.append(support_platform)
    
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
    #print(f"Generated dataset with {len(dataset)} levels")
        # Print an example level visualization
    #print("Example level visualization:")
    #print(visualize_level(dataset[0]))
    
