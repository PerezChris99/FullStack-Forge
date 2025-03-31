def add(a, b):
    """Add two numbers."""
    return a + b

def subtract(a, b):
    """Subtract second number from the first."""
    return a - b

def multiply(a, b):
    """Multiply two numbers."""
    return a * b

def divide(a, b):
    """Divide the first number by the second. Raises an error if the second number is zero."""
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b

def factorial(n):
    """Calculate factorial using recursion."""
    if n == 0 or n == 1:
        return 1
    return n * factorial(n-1)

def fibonacci(n):
    """Return the nth Fibonacci number."""
    if n < 0:
        raise ValueError("Fibonacci is not defined for negative numbers.")
    if n == 0:
        return 0
    elif n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Python Functions
# ===============

# Basic function definition
def greet(name):
    """Returns a greeting message."""
    return f"Hello, {name}!"

print(greet("Alex"))

# Function with default parameters
def greet_with_time(name, time_of_day="day"):
    """Returns a greeting with time of day."""
    return f"Good {time_of_day}, {name}!"

print(greet_with_time("Sam"))
print(greet_with_time("Sam", "evening"))

# Function with multiple parameters
def calculate_rectangle_area(length, width):
    """Calculate the area of a rectangle."""
    return length * width

print(f"Rectangle area: {calculate_rectangle_area(5, 3)}")

# Function with variable number of arguments
def sum_all(*numbers):
    """Sum all the numbers provided as arguments."""
    total = 0
    for num in numbers:
        total += num
    return total

print(f"Sum of 1, 2, 3: {sum_all(1, 2, 3)}")
print(f"Sum of 5, 10, 15, 20: {sum_all(5, 10, 15, 20)}")

# Function with keyword arguments
def build_profile(**user_info):
    """Build a dictionary containing user information."""
    return user_info

user = build_profile(name="John", age=30, occupation="Developer")
print(f"User profile: {user}")

# Lambda functions (anonymous functions)
square = lambda x: x**2
print(f"Square of 5: {square(5)}")

# Higher-order functions
def apply_operation(number, operation):
    """Apply an operation to a number."""
    return operation(number)

print(f"Applying square to 4: {apply_operation(4, square)}")
print(f"Applying double to 4: {apply_operation(4, lambda x: x*2)}")

# Example usage
if __name__ == "__main__":
    print("Addition:", add(5, 3))
    print("Subtraction:", subtract(5, 3))
    print("Multiplication:", multiply(5, 3))
    print("Division:", divide(5, 3))
    print("Factorial of 5:", factorial(5))
    print("Fibonacci of 5:", fibonacci(5))