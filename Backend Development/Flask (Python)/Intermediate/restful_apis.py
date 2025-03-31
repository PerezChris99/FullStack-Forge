"""
Building RESTful APIs with Flask
================================

This module demonstrates how to build a RESTful API using Flask,
including proper status codes, request validation, and response formatting.
"""

from flask import Flask, jsonify, request, abort, make_response
from functools import wraps
import uuid
import datetime
from http import HTTPStatus

app = Flask(__name__)

# Simulated database
todos = [
    {'id': '1', 'task': 'Learn Flask', 'done': False, 'created_at': '2023-01-15T10:30:00Z'},
    {'id': '2', 'task': 'Build a RESTful API', 'done': False, 'created_at': '2023-01-16T14:45:00Z'}
]

# Custom decorators for request validation
def validate_todo_data(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json()
        
        # Check if data exists and has required fields
        if not data or 'task' not in data:
            return make_response(jsonify({'error': 'Invalid data'}), HTTPStatus.BAD_REQUEST)
        return f(*args, **kwargs)
    return decorated_function

# Get all todos
@app.route('/api/todos', methods=['GET'])
def get_todos():
    return jsonify(todos), HTTPStatus.OK

# Get a single todo by ID
@app.route('/api/todos/<string:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = next((todo for todo in todos if todo['id'] == todo_id), None)
    if todo is not None:
        return jsonify(todo), HTTPStatus.OK
    return jsonify({'error': 'Todo not found'}), HTTPStatus.NOT_FOUND

# Create a new todo
@app.route('/api/todos', methods=['POST'])
@validate_todo_data
def create_todo():
    new_todo = request.get_json()
    new_todo['id'] = str(uuid.uuid4())
    new_todo['done'] = False
    new_todo['created_at'] = datetime.datetime.utcnow().isoformat() + 'Z'
    todos.append(new_todo)
    return jsonify(new_todo), HTTPStatus.CREATED

# Update an existing todo
@app.route('/api/todos/<string:todo_id>', methods=['PUT'])
@validate_todo_data
def update_todo(todo_id):
    todo = next((todo for todo in todos if todo['id'] == todo_id), None)
    if todo is not None:
        updated_data = request.get_json()
        todo.update(updated_data)
        return jsonify(todo), HTTPStatus.OK
    return jsonify({'error': 'Todo not found'}), HTTPStatus.NOT_FOUND

# Delete a todo
@app.route('/api/todos/<string:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return jsonify({'result': 'Todo deleted'}), HTTPStatus.NO_CONTENT

if __name__ == '__main__':
    app.run(debug=True)