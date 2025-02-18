# deployment.py

from flask import Flask
import os

app = Flask(__name__)

# Configuration for deployment
app.config['DEBUG'] = False
app.config['ENV'] = 'production'

# Define a simple route
@app.route('/')
def home():
    return "Welcome to the Flask Application!"

if __name__ == '__main__':
    # Get the host and port from environment variables or use defaults
    host = os.environ.get('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_RUN_PORT', 5000))
    
    # Run the application
    app.run(host=host, port=port)