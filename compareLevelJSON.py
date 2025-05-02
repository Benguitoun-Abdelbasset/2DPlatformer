import json

# Load the JSON arrays from the two files
with open('Test/test1.txt', 'r') as f1, open('Test2/test2.txt', 'r') as f2:
    data1 = json.load(f1)
    data2 = json.load(f2)

# Convert JSON objects to strings (sorted keys) for easier comparison
set1 = {json.dumps(obj, sort_keys=True) for obj in data1}
set2 = {json.dumps(obj, sort_keys=True) for obj in data2}

# Find common JSONs
common_jsons = set1.intersection(set2)

# Optional: Load them back as dicts if needed
common_jsons = [json.loads(obj) for obj in common_jsons]

# Print results
print(f"Found {len(common_jsons)} common JSON objects:")
for obj in common_jsons:
    print(json.dumps(obj, indent=2))
