# routing.py

from flask import Flask

app = Flask(__name__)

# Define a route for the home page
@app.route('/')
def home():
    return "Welcome to the Flask Routing Tutorial!"

# Define a route for the about page
@app.route('/about')
def about():
    return "This is the about page."

# Define a route with a variable
@app.route('/user/<username>')
def user_profile(username):
    return f"User profile for {username}"

if __name__ == '__main__':
    app.run(debug=True)