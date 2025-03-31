// Todo App - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // API URL (replace with your backend URL)
    const API_URL = 'http://localhost:5000/api/todos';
    
    // State
    let todos = [];
    let currentFilter = 'all';
    
    // Fetch all todos from the API
    async function fetchTodos() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            todos = await response.json();
            renderTodos();
        } catch (error) {
            console.error('Error fetching todos:', error);
            displayError('Failed to load todos. Please try again later.');
        }
    }
    
    // Add a new todo
    async function addTodo(text) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: text })
            });
            
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            
            const newTodo = await response.json();
            todos.push(newTodo);
            renderTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
            displayError('Failed to add todo. Please try again.');
        }
    }
    
    // Toggle todo completion status
    async function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const updatedStatus = !todo.completed;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: updatedStatus })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            
            todo.completed = updatedStatus;
            renderTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
            displayError('Failed to update todo. Please try again.');
        }
    }
    
    // Delete a todo
    async function deleteTodo(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            
            todos = todos.filter(todo => todo.id !== id);
            renderTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            displayError('Failed to delete todo. Please try again.');
        }
    }
    
    // Filter todos based on current filter
    function getFilteredTodos() {
        switch (currentFilter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }
    
    // Render todos to the DOM
    function renderTodos() {
        const filteredTodos = getFilteredTodos();
        
        todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = currentFilter === 'all' 
                ? 'No todos added yet. Add your first todo above!' 
                : currentFilter === 'active' 
                    ? 'No active todos!' 
                    : 'No completed todos!';
            todoList.appendChild(emptyMessage);
            return;
        }
        
        filteredTodos.forEach(todo => {
            // Create todo item
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.dataset.id = todo.id;
            
            // Checkbox for completion status
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodo(todo.id));
            
            // Todo text
            const todoText = document.createElement('span');
            todoText.className = 'todo-text';
            todoText.textContent = todo.task;
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            // Append elements to todo item
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoText);
            todoItem.appendChild(deleteBtn);
            
            // Append todo item to list
            todoList.appendChild(todoItem);
        });
    }
    
    // Display error message
    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        // Insert at the top of the app
        const app = document.querySelector('.app-container');
        app.insertBefore(errorDiv, app.firstChild);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
    
    // Event Listeners
    
    // Form submission for adding new todo
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
        }
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Set current filter and re-render
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });
    
    // Initial load
    fetchTodos();
});