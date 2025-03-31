"""
Python Functions Examples
========================

This module demonstrates various ways to define and use functions in Python.
"""

# Basic function definition
def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}!"

# Function with default parameters
def create_profile(name, age=18, occupation="Student"):
    """Create a profile with optional default values"""
    return {
        "name": name,
        "age": age,
        "occupation": occupation
    }

# Function with *args (variable positional arguments)
def sum_all(*numbers):
    """Sum all numbers passed to the function"""
    total = 0
    for num in numbers:
        total += num
    return total

# Function with **kwargs (variable keyword arguments)
def build_person(**attributes):
    """Build a person dictionary with arbitrary attributes"""
    return attributes

# Function with both positional and keyword arguments
def format_address(street, city, state, **additional_info):
    """Format an address with required fields and optional additional info"""
    address = f"{street}, {city}, {state}"
    
    # Add any additional information that was provided
    extra_info = []
    for key, value in additional_info.items():
        extra_info.append(f"{key}: {value}")
    
    if extra_info:
        address += " (" + ", ".join(extra_info) + ")"
    
    return address

# Lambda functions (anonymous functions)
square = lambda x: x ** 2
multiply = lambda x, y: x * y

# Higher-order functions (functions that accept or return other functions)
def create_multiplier(factor):
    """Return a function that multiplies its input by the given factor"""
    def multiplier(x):
        return x * factor
    return multiplier

# Example of using a higher-order function
double = create_multiplier(2)
triple = create_multiplier(3)

# Recursive function
def factorial(n):
    """Calculate the factorial of n using recursion"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Usage examples
if __name__ == "__main__":
    # Basic function
    print(greet("Alice"))
    
    # Default parameters
    print(create_profile("Bob"))
    print(create_profile("Charlie", 25, "Developer"))
    
    # *args example
    print(f"Sum: {sum_all(1, 2, 3, 4, 5)}")
    
    # **kwargs example
    person = build_person(name="David", age=30, job="Engineer", hobby="Reading")
    print(f"Person: {person}")
    
    # Mixed arguments
    address = format_address("123 Main St", "Anytown", "CA", zip="12345", country="USA")
    print(f"Address: {address}")
    
    # Lambda functions
    print(f"Square of 7: {square(7)}")
    print(f"5 x 6 = {multiply(5, 6)}")
    
    # Higher-order functions
    print(f"Double 10: {double(10)}")
    print(f"Triple 10: {triple(10)}")
    
    # Recursive function
    print(f"Factorial of 5: {factorial(5)}")
