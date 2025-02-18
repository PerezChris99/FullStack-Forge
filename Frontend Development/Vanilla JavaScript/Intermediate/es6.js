// ES6 Features in JavaScript

// 1. Let and Const
// Using let and const for variable declaration
let name = "John"; // mutable
const age = 30; // immutable

// 2. Arrow Functions
// A concise way to write function expressions
const greet = (person) => `Hello, ${person}!`;

// 3. Template Literals
// Multi-line strings and string interpolation
const greeting = `Hello, ${name}. You are ${age} years old.`;

// 4. Destructuring Assignment
// Extracting values from arrays or properties from objects
const person = { firstName: "Jane", lastName: "Doe" };
const { firstName, lastName } = person;

// 5. Default Parameters
// Setting default values for function parameters
const multiply = (a, b = 1) => a * b;

// 6. Spread Operator
// Expanding an iterable into more elements
const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5];

// 7. Rest Parameters
// Collecting all remaining arguments into an array
const sum = (...args) => args.reduce((acc, curr) => acc + curr, 0);

// 8. Modules
// Exporting and importing modules
export const pi = 3.14;
export const area = (radius) => pi * radius * radius;

// Importing in another file
// import { pi, area } from './es6.js';