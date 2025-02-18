// fetch_api.js

// This file explains how to use the Fetch API for making HTTP requests in JavaScript.

// The Fetch API provides a modern way to make network requests. It is promise-based and allows you to handle responses more easily than older methods like XMLHttpRequest.

// Example of a simple GET request using Fetch API:

fetch('https://api.example.com/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log(data); // Handle the data from the response
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

// Example of a POST request using Fetch API:

const postData = {
    name: 'John Doe',
    age: 30
};

fetch('https://api.example.com/data', {
    method: 'POST', // Specify the request method
    headers: {
        'Content-Type': 'application/json' // Set the content type
    },
    body: JSON.stringify(postData) // Convert the data to JSON
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log('Success:', data); // Handle the data from the response
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

// The Fetch API is a powerful tool for making HTTP requests and handling responses in a clean and efficient way.