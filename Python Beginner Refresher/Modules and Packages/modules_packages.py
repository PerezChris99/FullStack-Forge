# modules_packages.py

# This file discusses how to create and use modules and packages in Python.

# Creating a Module
# A module is simply a Python file that contains definitions and statements. 
# You can create a module by saving a Python file with a .py extension.

# Example of a simple module (my_module.py):
def greet(name):
    return f"Hello, {name}!"

# To use this module in another Python file, you can import it:
# import my_module
# print(my_module.greet("Alice"))

# Creating a Package
# A package is a way of organizing related modules into a single directory hierarchy.
# To create a package, you need to create a directory and add an __init__.py file.

# Example of a package structure:
# my_package/
# ├── __init__.py
# ├── module1.py
# └── module2.py

# You can import modules from a package using:
# from my_package import module1
# or
# import my_package.module1

# Using Modules and Packages
# Once you have created your modules and packages, you can use them in your projects.
# This promotes code reusability and better organization of your codebase.

# Example of using a package:
# from my_package import module1
# module1.some_function()