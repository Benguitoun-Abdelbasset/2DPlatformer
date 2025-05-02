import os
import glob

# Step 1: Read the content of tempdump.txt
tempdump_path = 'tempdump.txt'
if not os.path.exists(tempdump_path):
    print("Error: tempdump.txt does not exist.")
    exit()

with open(tempdump_path, 'r') as temp_file:
    content = temp_file.read()

# Step 2: Find the next available testX.txt
existing_files = glob.glob('test*.txt')

# Extract numbers from filenames like test4.txt
existing_numbers = []
for filename in existing_files:
    basename = os.path.basename(filename)
    number_part = basename.replace('test', '').replace('.txt', '')
    if number_part.isdigit():
        existing_numbers.append(int(number_part))

next_number = max(existing_numbers, default=0) + 1
new_filename = f'test{next_number}.txt'

# Step 3: Create new testX.txt and write the content
with open(new_filename, 'w') as new_file:
    new_file.write(content)

print(f"Copied content to {new_filename}.")

# Step 4: Empty tempdump.txt
with open(tempdump_path, 'w') as temp_file:
    pass  # Writing nothing empties the file

print("Emptied tempdump.txt.")
