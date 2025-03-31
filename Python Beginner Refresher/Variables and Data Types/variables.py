# variables.py

# Python Variables and Data Types
# ==============================

# Variables are containers for storing data values
name = "John Doe"  # String
age = 25           # Integer
height = 1.75      # Float
is_student = True  # Boolean

# Python is dynamically typed - no need to declare variable types
print(f"Name: {name}, Type: {type(name)}")
print(f"Age: {age}, Type: {type(age)}")
print(f"Height: {height}, Type: {type(height)}")
print(f"Is Student: {is_student}, Type: {type(is_student)}")

# Multiple assignment
x, y, z = "Orange", "Banana", "Cherry"
print(x, y, z)

# Same value to multiple variables
a = b = c = "Python"
print(a, b, c)

# Type conversion
num_str = "100"
num_int = int(num_str)
print(f"Converted string to int: {num_int}")

# Complex data types
# Lists (mutable, ordered collection)
fruits = ["apple", "banana", "cherry"]
print(f"Fruits list: {fruits}, Type: {type(fruits)}")

# Tuple (immutable, ordered collection)
coordinates = (10.0, 20.0)
print(f"Coordinates: {coordinates}, Type: {type(coordinates)}")

# Dictionary (key-value pairs)
person = {"name": "John", "age": 25, "city": "New York"}
print(f"Person dictionary: {person}, Type: {type(person)}")

# Set (unordered collection of unique items)
colors = {"red", "green", "blue"}
print(f"Colors set: {colors}, Type: {type(colors)}")