# Python File Handling
# ==================

import os
import json
import csv

# Creating a file path
file_path = os.path.join(os.path.dirname(__file__), "sample.txt")
json_path = os.path.join(os.path.dirname(__file__), "sample.json")
csv_path = os.path.join(os.path.dirname(__file__), "sample.csv")

# Writing to a file
def write_file():
    print("Writing to file...")
    with open(file_path, 'w') as file:
        file.write("Hello, this is a sample file.\n")
        file.write("Python makes file handling easy.\n")
        file.write("This is the third line of the file.")
    print(f"Successfully wrote to {file_path}")

# Reading from a file
def read_file():
    print("\nReading entire file:")
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            print(content)
    except FileNotFoundError:
        print(f"Error: The file {file_path} does not exist.")

# Reading file line by line
def read_file_lines():
    print("\nReading file line by line:")
    try:
        with open(file_path, 'r') as file:
            for line_number, line in enumerate(file, 1):
                print(f"Line {line_number}: {line.strip()}")
    except FileNotFoundError:
        print(f"Error: The file {file_path} does not exist.")

# Appending to a file
def append_file():
    print("\nAppending to file...")
    with open(file_path, 'a') as file:
        file.write("\nThis line was appended later.")
    print(f"Successfully appended to {file_path}")

# Working with JSON files
def json_file_example():
    print("\nWorking with JSON files...")
    
    # Sample data
    data = {
        "name": "John Doe",
        "age": 30,
        "skills": ["Python", "JavaScript", "SQL"],
        "active": True
    }
    
    # Write JSON data
    with open(json_path, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"Wrote JSON data to {json_path}")
    
    # Read JSON data
    with open(json_path, 'r') as file:
        loaded_data = json.load(file)
        print(f"Read JSON data: {loaded_data}")
    
    # Clean up
    os.remove(json_path)
    print(f"Removed {json_path}")

# Working with CSV files
def csv_file_example():
    print("\nWorking with CSV files...")
    
    # Sample data
    header = ['name', 'department', 'salary']
    rows = [
        ['Alice', 'Engineering', 75000],
        ['Bob', 'Marketing', 65000],
        ['Charlie', 'HR', 55000]
    ]
    
    # Write CSV data
    with open(csv_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerows(rows)
    print(f"Wrote CSV data to {csv_path}")
    
    # Read CSV data
    with open(csv_path, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            print(row)
    
    # Clean up
    os.remove(csv_path)
    print(f"Removed {csv_path}")

# Working with binary files
def binary_file_example():
    binary_path = os.path.join(os.path.dirname(__file__), "sample.bin")
    print("\nWorking with binary files...")
    
    # Write binary data
    with open(binary_path, 'wb') as file:
        file.write(bytes([0, 1, 2, 3, 4, 5]))
    print(f"Wrote binary data to {binary_path}")
    
    # Read binary data
    with open(binary_path, 'rb') as file:
        data = file.read()
        print(f"Read binary data: {data}")
    
    # Clean up
    os.remove(binary_path)
    print(f"Removed {binary_path}")

# Execute the examples
if __name__ == "__main__":
    write_file()
    read_file()
    read_file_lines()
    append_file()
    read_file()
    json_file_example()
    csv_file_example()
    binary_file_example()
    
    # Clean up
    os.remove(file_path)
    print(f"\nRemoved {file_path}")