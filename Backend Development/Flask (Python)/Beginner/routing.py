"""
Flask Routing
=============

This module demonstrates different routing techniques in Flask.
"""

from flask import Flask, redirect, url_for, request

app = Flask(__name__)

# Basic route
@app.route('/')
def home():
    """Handle requests to the root URL."""
    return "Welcome to the Flask Routing Tutorial!"

# Route with a static path
@app.route('/about')
def about():
    """Handle requests to the about page."""
    return "This is the about page."

# Route with a variable - string
@app.route('/user/<username>')
def user_profile(username):
    """
    Handle requests with a username parameter.
    
    Args:
        username: The username provided in the URL
    """
    return f"User profile for {username}"

# Route with a variable - integer
@app.route('/post/<int:post_id>')
def show_post(post_id):
    """
    Display a post with the specified ID.
    
    Args:
        post_id: The ID of the post (converted to integer)
    """
    return f"Post ID: {post_id}"

# Route with a variable - float
@app.route('/price/<float:amount>')
def show_price(amount):
    """
    Display a price with currency symbol.
    
    Args:
        amount: The price amount (converted to float)
    """
    return f"Price: ${amount:.2f}"

# Multiple routes for the same function
@app.route('/contact')
@app.route('/get-in-touch')
def contact():
    """Handle multiple URL patterns pointing to the same page."""
    return "Contact us page"

# Redirecting to another route
@app.route('/go-home')
def go_home():
    """Redirect to the home page."""
    return redirect(url_for('home'))

# HTTP Methods
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle both GET and POST requests.
    
    GET: Display the login form
    POST: Process the form data
    """
    if request.method == 'POST':
        # This would normally process login data
        return "Logged in successfully"
    else:
        return "Please log in"

if __name__ == '__main__':
    app.run(debug=True)