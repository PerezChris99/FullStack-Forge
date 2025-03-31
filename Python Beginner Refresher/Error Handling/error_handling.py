# Python Error Handling
# ===================

# Basic try-except block
def basic_try_except():
    print("Basic try-except example:")
    try:
        x = 10 / 0
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")

# Multiple exceptions
def multiple_exceptions():
    print("\nHandling multiple exceptions:")
    try:
        user_input = input("Enter a number: ")
        result = 100 / int(user_input)
        print(f"100 / {user_input} = {result}")
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
    except ValueError:
        print("Error: Invalid input - please enter a number")

# Try-except-else-finally
def try_except_else_finally():
    print("\nTry-except-else-finally example:")
    try:
        print("Try block - attempting to open a file")
        with open('nonexistent_file.txt', 'r') as file:
            content = file.read()
    except FileNotFoundError:
        print("Except block - file not found")
    else:
        print("Else block - no exceptions occurred")
        print(f"File content: {content}")
    finally:
        print("Finally block - this always executes")

# Raising exceptions
def check_age(age):
    print(f"\nChecking age {age}:")
    if age < 0:
        raise ValueError("Age cannot be negative")
    elif age < 18:
        print("You are a minor")
    else:
        print("You are an adult")

# Custom exceptions
class CustomError(Exception):
    """A custom exception class"""
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def custom_exception_example():
    print("\nCustom exception example:")
    try:
        raise CustomError("This is a custom error")
    except CustomError as e:
        print(f"Caught an exception: {e}")

# Using assert statements
def assert_example(x):
    print(f"\nAssert example with x = {x}:")
    assert x > 0, "x must be positive"
    print(f"Continuing with x = {x}")

# Execute the examples
if __name__ == "__main__":
    basic_try_except()
    
    # Uncomment to test with user input
    # multiple_exceptions()
    
    try_except_else_finally()
    
    try:
        check_age(20)
        check_age(15)
        check_age(-5)
    except ValueError as e:
        print(f"Error: {e}")
    
    custom_exception_example()
    
    try:
        assert_example(5)
        assert_example(-1)
    except AssertionError as e:
        print(f"Assertion failed: {e}")