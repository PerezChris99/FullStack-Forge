"""
Flask Database Integration with SQLAlchemy
==========================================

This module demonstrates how to use SQLAlchemy with Flask to interact with databases.
It showcases model definitions, relationships, migrations, and CRUD operations.
"""

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flask_db.sqlite'  # SQLite for development
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Model Definitions
class User(db.Model):
    """User model with relationships to posts and comments."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy=True, cascade="all, delete-orphan")
    comments = db.relationship('Comment', backref='author', lazy=True, cascade="all, delete-orphan")
    
    def set_password(self, password):
        """Hash the password for secure storage."""
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        """Verify a password against its hash."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user object to dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

class Post(db.Model):
    """Blog post model with relationship to comments."""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    comments = db.relationship('Comment', backref='post', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        """Convert post object to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id,
            'author': self.author.username
        }
    
    def __repr__(self):
        return f"Post('{self.title}', '{self.created_at}')"

class Comment(db.Model):
    """Comment model for blog posts."""
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    
    def to_dict(self):
        """Convert comment object to dictionary."""
        return {
            'id': self.id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id,
            'author': self.author.username,
            'post_id': self.post_id
        }
    
    def __repr__(self):
        return f"Comment('{self.content[:20]}...', '{self.created_at}')"

# API Routes for CRUD operations
@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users or filter by username."""
    username = request.args.get('username')
    
    if username:
        users = User.query.filter(User.username.like(f'%{username}%')).all()
    else:
        users = User.query.all()
        
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID."""
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user."""
    data = request.json
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Invalid data'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@app.route('/api/posts', methods=['GET'])
def get_posts():
    """Get all posts or filter by title."""
    title = request.args.get('title')
    
    if title:
        posts = Post.query.filter(Post.title.like(f'%{title}%')).all()
    else:
        posts = Post.query.all()
        
    return jsonify([post.to_dict() for post in posts])

@app.route('/api/users/<int:user_id>/posts', methods=['POST'])
def create_post(user_id):
    """Create a new post for a specific user."""
    user = User.query.get_or_404(user_id)
    data = request.json
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Invalid data'}), 400
    
    post = Post(
        title=data['title'],
        content=data['content'],
        user_id=user.id
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

# Database Management Operations
def initialize_db():
    """Initialize the database with tables."""
    with app.app_context():
        db.create_all()
        print("Database tables created.")

def seed_sample_data():
    """Add sample data to the database."""
    with app.app_context():
        # Check if data already exists
        if User.query.count() > 0:
            return
        
        # Create sample users
        alice = User(username='alice', email='alice@example.com')
        alice.set_password('password123')
        
        bob = User(username='bob', email='bob@example.com')
        bob.set_password('password123')
        
        # Create sample posts
        post1 = Post(
            title='Flask SQLAlchemy Guide',
            content='This is a comprehensive guide to using SQLAlchemy with Flask...',
            author=alice
        )
        
        post2 = Post(
            title='Web Development Tips',
            content='Here are some tips for effective web development...',
            author=bob
        )
        
        # Create sample comments
        comment1 = Comment(
            content='Great article, very helpful!',
            author=bob,
            post=post1
        )
        
        comment2 = Comment(
            content='Thanks for sharing these tips.',
            author=alice,
            post=post2
        )
        
        # Add all to session and commit
        db.session.add_all([alice, bob, post1, post2, comment1, comment2])
        db.session.commit()
        
        print("Sample data added to the database.")

if __name__ == "__main__":
    # Initialize and seed the database when run directly
    print("SQLAlchemy Database Example")
    print("==========================\n")
    print("Install required packages: pip install flask-sqlalchemy flask-migrate\n")
    
    # Initialize and seed the database
    initialize_db()
    seed_sample_data()
    
    app.run(debug=True)