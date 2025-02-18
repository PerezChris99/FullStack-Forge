// modules.js

// JavaScript Modules

// Introduction to JavaScript modules
// Modules are a way to divide your code into separate files, making it easier to manage and maintain. 
// They allow you to encapsulate functionality and reuse code across different parts of your application.

// Exporting a module
// You can export variables, functions, or classes from a module using the `export` keyword.

export const greeting = "Hello, World!";

export function add(a, b) {
    return a + b;
}

// Exporting a class
export class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log(`${greeting} My name is ${this.name}.`);
    }
}

// Importing a module
// To use the exported members from a module, you can import them into another module using the `import` keyword.

import { greeting, add, Person } from './modules.js';

const person = new Person("Alice");
person.sayHello(); // Outputs: Hello, World! My name is Alice.

console.log(add(5, 10)); // Outputs: 15

// Default exports
// You can also have a default export in a module, which allows you to export a single value or object.

const defaultExport = "This is the default export.";
export default defaultExport;