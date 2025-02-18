# File: /full-stack-learning-path/full-stack-learning-path/Python Beginner Refresher/File Handling/file_handling.py

# File Handling in Python

# This script demonstrates how to handle files in Python, including reading from and writing to files.

# Writing to a file
def write_to_file(filename, content):
    with open(filename, 'w') as file:
        file.write(content)
    print(f"Content written to {filename}")

# Reading from a file
def read_from_file(filename):
    try:
        with open(filename, 'r') as file:
            content = file.read()
        print(f"Content read from {filename}:\n{content}")
    except FileNotFoundError:
        print(f"The file {filename} does not exist.")

# Example usage
if __name__ == "__main__":
    # Define the filename
    filename = 'example.txt'
    
    # Write content to the file
    write_to_file(filename, "Hello, this is a test file.\nWelcome to file handling in Python!")
    
    # Read content from the file
    read_from_file(filename)