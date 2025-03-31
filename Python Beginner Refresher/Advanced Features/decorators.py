"""
Python Decorators
================

This module demonstrates the use of decorators in Python.
Decorators are a powerful feature that allows you to modify the behavior of functions or methods.
"""

import functools
import time
from datetime import datetime


# Basic decorator
def simple_decorator(func):
    """A simple decorator that prints messages before and after the function execution."""
    @functools.wraps(func)  # Preserves the original function's metadata
    def wrapper(*args, **kwargs):
        print(f"Before calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"After calling {func.__name__}")
        return result
    return wrapper


# Example of using the basic decorator
@simple_decorator
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}!"


# Decorator with parameters
def repeat(n=1):
    """A decorator that repeats the function call n times."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(n):
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator


# Example of using a decorator with parameters
@repeat(n=3)
def say_hello(name):
    """Return a hello message."""
    return f"Hello, {name}!"


# Practical decorator: Timing execution
def timer(func):
    """Measure the execution time of the decorated function."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} ran in {end_time - start_time:.6f} seconds")
        return result
    return wrapper


# Example of using the timer decorator
@timer
def slow_function():
    """A deliberately slow function to demonstrate the timer."""
    time.sleep(1)
    return "Function completed"


# Logging decorator
def log_function_call(func):
    """Log function calls with timestamp, arguments, and return value."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        arg_str = ", ".join([repr(a) for a in args] + [f"{k}={v!r}" for k, v in kwargs.items()])
        print(f"[{timestamp}] Calling {func.__name__}({arg_str})")
        
        try:
            result = func(*args, **kwargs)
            print(f"[{timestamp}] {func.__name__} returned {result!r}")
            return result
        except Exception as e:
            print(f"[{timestamp}] {func.__name__} raised {e.__class__.__name__}: {e}")
            raise
    return wrapper


# Combining decorators
@timer
@log_function_call
def calculate_sum(n):
    """Calculate the sum of numbers from 1 to n."""
    return sum(range(1, n + 1))


# Class-based decorators
class CountCalls:
    """A decorator class that counts the number of times a function is called."""
    
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func
        self.num_calls = 0
    
    def __call__(self, *args, **kwargs):
        self.num_calls += 1
        print(f"{self.func.__name__} has been called {self.num_calls} times")
        return self.func(*args, **kwargs)


# Example of using a class-based decorator
@CountCalls
def say_hi():
    """Say hi."""
    return "Hi there!"


# Decorator to add attributes to functions
def add_attributes(**attrs):
    """Add attributes to a function."""
    def decorator(func):
        for key, value in attrs.items():
            setattr(func, key, value)
        return func
    return decorator


# Example of using a decorator to add attributes
@add_attributes(version="1.0", author="John Doe")
def multiply(a, b):
    """Multiply two numbers."""
    return a * b


# Decorator to restrict function access based on a condition
def require_authorization(func):
    """A decorator that checks if the user is authorized before calling the function."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # This is a simple example. In real applications, you would
        # check user credentials, tokens, or other authentication mechanisms
        is_authorized = kwargs.pop('is_authorized', False)
        
        if not is_authorized:
            raise PermissionError("You are not authorized to call this function")
        
        return func(*args, **kwargs)
    return wrapper


# Example of using the authorization decorator
@require_authorization
def get_sensitive_data():
    """Return sensitive data."""
    return "This is sensitive data"


# Usage examples
if __name__ == "__main__":
    # Basic decorator
    print("\n=== Basic Decorator ===")
    result = greet("Alice")
    print(f"Result: {result}")
    
    # Decorator with parameters
    print("\n=== Decorator with Parameters ===")
    results = say_hello("Bob")
    for i, result in enumerate(results, 1):
        print(f"Call {i}: {result}")
    
    # Timer decorator
    print("\n=== Timer Decorator ===")
    result = slow_function()
    print(f"Result: {result}")
    
    # Combining decorators
    print("\n=== Combined Decorators ===")
    result = calculate_sum(1000000)
    print(f"Result: {result}")
    
    # Class-based decorator
    print("\n=== Class-Based Decorator ===")
    print(say_hi())
    print(say_hi())
    print(say_hi())
    
    # Decorated function with attributes
    print("\n=== Decorated Function with Attributes ===")
    print(f"multiply(5, 7) = {multiply(5, 7)}")
    print(f"Version: {multiply.version}")
    print(f"Author: {multiply.author}")
    
    # Authorization decorator
    print("\n=== Authorization Decorator ===")
    try:
        get_sensitive_data()
    except PermissionError as e:
        print(f"Error: {e}")
    
    try:
        print(f"Authorized access: {get_sensitive_data(is_authorized=True)}")
    except PermissionError as e:
        print(f"Error: {e}")
    
    # Function metadata preserved by functools.wraps
    print("\n=== Function Metadata ===")
    print(f"Name of greet(): {greet.__name__}")
    print(f"Docstring of greet(): {greet.__doc__}")