"""
Introduction to Flask
=====================

Flask is a lightweight WSGI web application framework for Python. It is designed
to make getting started quick and easy, with the ability to scale up to complex
applications.
"""

# Basic Flask application
from flask import Flask

# Create a Flask application instance
app = Flask(__name__)

# Define a route and associated function
@app.route('/')
def hello_world():
    """Return a friendly HTTP greeting."""
    return 'Hello, World! Welcome to Flask!'

# Additional route example
@app.route('/about')
def about():
    """Return information about this application."""
    return 'This is a simple Flask application demonstrating the basics.'

if __name__ == '__main__':
    # Run the application in debug mode for development
    print("Starting Flask development server...")
    print("To install Flask: pip install Flask")
    print("Access the application at http://127.0.0.1:5000/")
    app.run(debug=True)