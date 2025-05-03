import json
import glob
import os
from datetime import datetime

# Get current timestamp for backup filenames
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

# Find all .txt files in the current directory
txt_files = glob.glob("*.txt")
print(f"Found {len(txt_files)} txt files: {txt_files}")

# Dictionary to store all JSON objects with files they appear in
json_occurrences = {}

# Dictionary to store the original data for each file
file_data = {}

# First pass: load and process JSON arrays from each txt file
for filename in txt_files:
    with open(filename, 'r') as f:
        try:
            # Try to load the content as a JSON array
            content = f.read()
            data = json.loads(content)
            
            # Ensure we have a list of objects
            if not isinstance(data, list):
                print(f"Warning: {filename} does not contain a JSON array, skipping.")
                continue
                
            print(f"Processing {filename}: found {len(data)} JSON objects")
            
            # Store the original data
            file_data[filename] = data
            
            # Process each object in the array
            for obj in data:
                # Create a normalized JSON string for comparison
                obj_key = json.dumps(obj, sort_keys=True)
                
                # Add to our tracking dictionary
                if obj_key not in json_occurrences:
                    json_occurrences[obj_key] = {
                        'files': set(),
                        'object': obj
                    }
                json_occurrences[obj_key]['files'].add(filename)
                
        except json.JSONDecodeError as e:
            print(f"Error decoding {filename}: {e}")

# If no files were processed
if not json_occurrences:
    print("No valid JSON arrays found in the txt files.")
    exit()

# Find duplicates (objects that appear in more than one file)
duplicates = {
    obj_key: info 
    for obj_key, info in json_occurrences.items() 
    if len(info['files']) > 1
}

# Print initial file statistics
print("\nBefore removing duplicates:")
for filename in txt_files:
    if filename in file_data:
        print(f"  {filename}: {len(file_data[filename])} objects")

# Print total unique objects
print(f"\nTotal unique objects across all files: {len(json_occurrences)}")

# If there are duplicates, remove them
if duplicates:
    print(f"\nFound {len(duplicates)} duplicate JSON objects across {len(txt_files)} files")
    
    # Create backup files before modifying
    for filename in file_data.keys():
        backup_filename = f"{filename}.{timestamp}.bak"
        with open(backup_filename, 'w') as f:
            json.dump(file_data[filename], f, indent=2)
        print(f"Created backup: {backup_filename}")
    
    # For each duplicate, keep it in only one file (the first alphabetically)
    for obj_key, info in duplicates.items():
        # Sort the files to ensure consistent behavior
        files_with_obj = sorted(info['files'])
        
        # Keep the object in the first file only
        keep_in_file = files_with_obj[0]
        
        # Remove from all other files
        for remove_from_file in files_with_obj[1:]:
            # Find and remove the object
            file_data[remove_from_file] = [
                obj for obj in file_data[remove_from_file]
                if json.dumps(obj, sort_keys=True) != obj_key
            ]
    
    # Write the modified data back to the files
    for filename, data in file_data.items():
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Updated {filename}")
    
    # Print final statistics
    print("\nAfter removing duplicates:")
    for filename in sorted(file_data.keys()):
        print(f"  {filename}: {len(file_data[filename])} objects")
    
    print(f"\nRemoved {len(duplicates)} duplicate objects.")
    print(f"Backups of original files were created with timestamp {timestamp}")
else:
    print("\nNo duplicate JSON objects found across files. No changes were made.")