// This file discusses event handling in vanilla JavaScript.

// Event handling is a crucial part of creating interactive web applications. 
// In this file, we will cover how to add event listeners to elements and respond to user actions.

// Example: Adding a click event listener to a button
const button = document.getElementById('myButton');

button.addEventListener('click', function() {
    alert('Button was clicked!');
});

// Example: Adding a mouseover event listener to an element
const hoverElement = document.getElementById('hoverElement');

hoverElement.addEventListener('mouseover', function() {
    hoverElement.style.backgroundColor = 'yellow';
});

// Example: Adding a keypress event listener to an input field
const inputField = document.getElementById('myInput');

inputField.addEventListener('keypress', function(event) {
    console.log(`Key pressed: ${event.key}`);
});

// Example: Adding a form submit event listener
const form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log('Form submitted!');
});