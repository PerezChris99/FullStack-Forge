// DOM Manipulation in Vanilla JavaScript

// Selecting elements
const title = document.getElementById('title');
const button = document.querySelector('.button');
const list = document.querySelector('.list');

// Changing text content
title.textContent = 'Welcome to DOM Manipulation!';

// Changing styles
title.style.color = 'blue';
title.style.fontSize = '2em';

// Creating new elements
const newItem = document.createElement('li');
newItem.textContent = 'New List Item';
list.appendChild(newItem);

// Adding event listeners
button.addEventListener('click', () => {
    alert('Button was clicked!');
});

// Removing elements
const firstItem = list.firstElementChild;
if (firstItem) {
    list.removeChild(firstItem);
}