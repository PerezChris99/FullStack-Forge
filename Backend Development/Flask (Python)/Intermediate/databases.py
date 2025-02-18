# Content for /full-stack-learning-path/full-stack-learning-path/Backend Development/Flask (Python)/Intermediate/databases.py

"""
This file explains how to integrate databases with Flask using SQLAlchemy.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Example using SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define a User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

# Create the database and the database table
with app.app_context():
    db.create_all()

# Example of adding a new user
def add_user(username, email):
    new_user = User(username=username, email=email)
    db.session.add(new_user)
    db.session.commit()

# Example of querying users
def get_users():
    return User.query.all()

if __name__ == "__main__":
    app.run(debug=True)