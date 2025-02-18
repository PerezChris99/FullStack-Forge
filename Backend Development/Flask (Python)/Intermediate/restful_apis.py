# restful_apis.py

from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data to simulate a database
todos = [
    {'id': 1, 'task': 'Learn Flask', 'done': False},
    {'id': 2, 'task': 'Build a RESTful API', 'done': False}
]

# Get all todos
@app.route('/api/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

# Get a single todo by ID
@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = next((todo for todo in todos if todo['id'] == todo_id), None)
    if todo is not None:
        return jsonify(todo)
    return jsonify({'error': 'Todo not found'}), 404

# Create a new todo
@app.route('/api/todos', methods=['POST'])
def create_todo():
    new_todo = request.get_json()
    new_todo['id'] = len(todos) + 1
    new_todo['done'] = False
    todos.append(new_todo)
    return jsonify(new_todo), 201

# Update an existing todo
@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = next((todo for todo in todos if todo['id'] == todo_id), None)
    if todo is not None:
        updated_data = request.get_json()
        todo.update(updated_data)
        return jsonify(todo)
    return jsonify({'error': 'Todo not found'}), 404

# Delete a todo
@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return jsonify({'result': 'Todo deleted'}), 204

if __name__ == '__main__':
    app.run(debug=True)