# modules_packages.py

# Python Modules and Packages
# ==========================

# A module is a Python file containing code - functions, classes, variables
# A package is a directory containing multiple modules

# Importing standard modules
import math
import random
import datetime

# Using module functions
print(f"Square root of 16: {math.sqrt(16)}")
print(f"Random number between 1 and 10: {random.randint(1, 10)}")
print(f"Current date: {datetime.date.today()}")

# Importing specific functions or variables from modules
from math import pi, cos
print(f"Value of pi: {pi}")
print(f"Cosine of 0: {cos(0)}")

# Importing with aliases
import datetime as dt
print(f"Current time: {dt.datetime.now().time()}")

# Creating your own module
# -----------------------
# Let's say we have a file named 'mymath.py' with these functions:
"""
# mymath.py
def add(a, b):
    return a + b
    
def subtract(a, b):
    return a - b
"""

# We would import it like this:
# import mymath
# print(mymath.add(10, 5))

# Creating packages
# ----------------
# A package is a directory with an __init__.py file and other modules
# Example structure:
"""
mypackage/
    __init__.py
    module1.py
    module2.py
    subpackage/
        __init__.py
        module3.py
"""

# You would import from the package like this:
# import mypackage.module1
# from mypackage.subpackage import module3

# The __init__.py file can be empty or can contain initialization code
# that runs when the package is imported