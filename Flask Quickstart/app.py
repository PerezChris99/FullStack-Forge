from flask import Flask, render_template, request, redirect, url_for, jsonify
import os

app = Flask(__name__)
app.secret_key = 'development_secret_key'  # Change in production!

# In-memory data storage for demonstration
tasks = [
    {'id': 1, 'title': 'Learn Flask', 'done': False},
    {'id': 2, 'title': 'Build REST API', 'done': False},
    {'id': 3, 'title': 'Connect with Frontend', 'done': False}
]

# Route for home page
@app.route('/')
def home():
    return render_template('index.html', title='Flask Quickstart', tasks=tasks)

# Route for about page
@app.route('/about')
def about():
    return render_template('about.html', title='About Flask Quickstart')

# REST API routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if task:
        return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks', methods=['POST'])
def create_task():
    if not request.json or 'title' not in request.json:
        return jsonify({"error": "Invalid request"}), 400
    
    # Create new task
    task_id = max(task['id'] for task in tasks) + 1 if tasks else 1
    task = {
        'id': task_id,
        'title': request.json['title'],
        'done': False
    }
    tasks.append(task)
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    if not request.json:
        return jsonify({"error": "Invalid request"}), 400
    
    task['title'] = request.json.get('title', task['title'])
    task['done'] = request.json.get('done', task['done'])
    return jsonify(task)

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({"result": True})

# Error handling
@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

# Run the application
if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    # Create a basic index.html template if it doesn't exist
    index_path = os.path.join('templates', 'index.html')
    if not os.path.exists(index_path):
        with open(index_path, 'w') as f:
            f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; padding: 10px; background: #f4f4f4; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Flask Quickstart</h1>
    <p>Welcome to the Flask Quickstart application!</p>
    
    <h2>Tasks</h2>
    <ul>
    {% for task in tasks %}
        <li>{{ task.title }} - {% if task.done %}Done{% else %}Pending{% endif %}</li>
    {% endfor %}
    </ul>
    
    <p><a href="{{ url_for('about') }}">About</a></p>
</body>
</html>
            """)
    
    # Create a basic about.html template if it doesn't exist
    about_path = os.path.join('templates', 'about.html')
    if not os.path.exists(about_path):
        with open(about_path, 'w') as f:
            f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>About Flask Quickstart</h1>
    <p>This is a simple Flask application to demonstrate basic concepts including:</p>
    <ul>
        <li>Routing</li>
        <li>Templates</li>
        <li>RESTful API endpoints</li>
        <li>Error handling</li>
    </ul>
    <p><a href="{{ url_for('home') }}">Home</a></p>
</body>
</html>
            """)
    
    # Create a basic 404.html template if it doesn't exist
    not_found_path = os.path.join('templates', '404.html')
    if not os.path.exists(not_found_path):
        with open(not_found_path, 'w') as f:
            f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; text-align: center; }
        h1 { color: #d9534f; }
    </style>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
    <p><a href="{{ url_for('home') }}">Return to Home</a></p>
</body>
</html>
            """)
    
    app.run(debug=True)
