# variables.py

# This file contains examples and explanations of variables and data types in Python.

# Variables in Python
# A variable is a name that refers to a value. In Python, you can create a variable by simply assigning a value to it.

# Example of variable assignment
name = "Alice"  # String variable
age = 30        # Integer variable
height = 5.5    # Float variable
is_student = True  # Boolean variable

# Printing variables
print("Name:", name)
print("Age:", age)
print("Height:", height)
print("Is Student:", is_student)

# Data Types in Python
# Python has various built-in data types, including:
# 1. Strings: Text data, e.g., "Hello, World!"
# 2. Integers: Whole numbers, e.g., 42
# 3. Floats: Decimal numbers, e.g., 3.14
# 4. Booleans: True or False values

# Example of different data types
string_example = "Hello, World!"
integer_example = 42
float_example = 3.14
boolean_example = False

# Printing data types
print("String Example:", string_example, "Type:", type(string_example))
print("Integer Example:", integer_example, "Type:", type(integer_example))
print("Float Example:", float_example, "Type:", type(float_example))
print("Boolean Example:", boolean_example, "Type:", type(boolean_example))

# Type Conversion
# You can convert between data types using built-in functions.
# Example of type conversion
num_str = "100"  # String
num_int = int(num_str)  # Convert to integer
print("Converted Integer:", num_int, "Type:", type(num_int))