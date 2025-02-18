// This file contains the frontend code for a Todo application using vanilla JavaScript.

document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');

    addButton.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            const todoItem = document.createElement('li');
            todoItem.textContent = todoText;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                todoList.removeChild(todoItem);
            });

            todoItem.appendChild(deleteButton);
            todoList.appendChild(todoItem);
            todoInput.value = '';
        }
    });
});