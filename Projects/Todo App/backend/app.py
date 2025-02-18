from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory storage for the todo items
todos = []

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos), 200

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    if 'task' not in data:
        return jsonify({'error': 'Task is required'}), 400
    todo = {
        'id': len(todos) + 1,
        'task': data['task'],
        'completed': False
    }
    todos.append(todo)
    return jsonify(todo), 201

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    for todo in todos:
        if todo['id'] == todo_id:
            todo['completed'] = data.get('completed', todo['completed'])
            return jsonify(todo), 200
    return jsonify({'error': 'Todo not found'}), 404

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return jsonify({'message': 'Todo deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)