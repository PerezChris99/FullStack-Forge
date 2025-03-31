/**
 * ES6+ (Modern JavaScript) Features
 * ================================
 * This file demonstrates key features introduced in ES6 (ES2015) and newer versions
 */

// ===========================================
// 1. Let and Const Declarations
// ===========================================
console.log('1. Let and Const Declarations:');

// Old way with var (function scoped)
function varExample() {
    var x = 1;
    
    if (true) {
        var x = 2;  // Same variable!
        console.log('Inside block:', x);  // 2
    }
    
    console.log('Outside block:', x);  // 2 - the value changed
}
varExample();

// New way with let (block scoped)
function letExample() {
    let y = 1;
    
    if (true) {
        let y = 2;  // Different variable - block scoped
        console.log('Inside block:', y);  // 2
    }
    
    console.log('Outside block:', y);  // 1 - unchanged
}
letExample();

// Constants (cannot be reassigned)
function constExample() {
    const PI = 3.14159;
    // PI = 3; // Would throw an error
    
    // But for objects and arrays, their properties can be modified
    const person = { name: 'John' };
    person.name = 'Jane';  // This works!
    console.log('Modified const object:', person);
    
    const numbers = [1, 2, 3];
    numbers.push(4);  // This works too!
    console.log('Modified const array:', numbers);
}
constExample();

// ===========================================
// 2. Template Literals
// ===========================================
console.log('\n2. Template Literals:');

// Old way
const oldConcatenation = 'Hello ' + 'World' + '!';
console.log(oldConcatenation);

// New way with template literals
const name = 'World';
const greeting = `Hello ${name}!`;
console.log(greeting);

// Multi-line strings
const oldMultiline = 'Line 1\n' +
                     'Line 2\n' +
                     'Line 3';

const newMultiline = `Line 1
Line 2
Line 3`;

console.log('Old way:');
console.log(oldMultiline);
console.log('New way:');
console.log(newMultiline);

// Expression evaluation in template literals
const a = 10;
const b = 5;
console.log(`${a} + ${b} = ${a + b}`);

// ===========================================
// 3. Arrow Functions
// ===========================================
console.log('\n3. Arrow Functions:');

// Traditional function expression
const traditionalFunc = function(x) {
    return x * 2;
};

// Arrow function
const arrowFunc = (x) => {
    return x * 2;
};

// Simplified arrow function with implicit return
const simplifiedArrowFunc = x => x * 2;

console.log('Traditional:', traditionalFunc(5));
console.log('Arrow:', arrowFunc(5));
console.log('Simplified Arrow:', simplifiedArrowFunc(5));

// 'this' behavior difference
function ThisExample() {
    this.value = 42;
    
    // Traditional function - 'this' is redefined
    setTimeout(function() {
        console.log('Traditional function:');
        console.log('this.value:', this.value);  // undefined or global value
    }, 100);
    
    // Arrow function - 'this' is lexically bound
    setTimeout(() => {
        console.log('Arrow function:');
        console.log('this.value:', this.value);  // 42
    }, 100);
}

new ThisExample();

// ===========================================
// 4. Destructuring
// ===========================================
console.log('\n4. Destructuring:');

// Object destructuring
const person = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    address: {
        city: 'New York',
        country: 'USA'
    }
};

// Old way
const firstNameOld = person.firstName;
const lastNameOld = person.lastName;
console.log('Old way:', firstNameOld, lastNameOld);

// New way with destructuring
const { firstName, lastName, age = 25 } = person;  // with default value
console.log('Destructured:', firstName, lastName, age);

// Nested destructuring
const { address: { city2, country } } = person;
console.log('Nested destructuring:', city, country);

// Renaming variables while destructuring
const { firstName: fName, lastName: lName } = person;
console.log('Renamed variables:', fName, lName);

// Array destructuring
const colors = ['red', 'green', 'blue'];

// Old way
const firstColorOld = colors[0];
const secondColorOld = colors[1];
console.log('Old way:', firstColorOld, secondColorOld);

// New way with destructuring
const [firstColor, secondColor, thirdColor, fourthColor = 'yellow'] = colors;
console.log('Array destructuring:', firstColor, secondColor, thirdColor, fourthColor);

// Skipping elements
const [first, , third] = colors;
console.log('Skipping elements:', first, third);

// Swapping variables
let x = 1;
let y = 2;
[x, y] = [y, x];
console.log('After swap:', x, y);  // 2, 1

// Function parameter destructuring
function printPersonInfo({ firstName, lastName, age = 'unknown' }) {
    console.log(`${firstName} ${lastName}, Age: ${age}`);
}

printPersonInfo(person);

// ===========================================
// 5. Spread and Rest Operators
// ===========================================
console.log('\n5. Spread and Rest Operators:');

// Spread operator with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];
console.log('Combined arrays:', combined);

// Clone an array
const clonedArray = [...arr1];
console.log('Cloned array:', clonedArray);

// Spread with objects (ES2018)
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Combine objects
const combinedObj = { ...obj1, ...obj2 };
console.log('Combined objects:', combinedObj);

// Clone an object
const clonedObj = { ...obj1 };
console.log('Cloned object:', clonedObj);

// Override properties
const overriddenObj = { ...obj1, b: 42 };
console.log('Object with overridden property:', overriddenObj);

// Rest operator in functions (collect remaining arguments)
function sum(first, ...rest) {
    console.log('First argument:', first);
    console.log('Rest of arguments:', rest);
    return first + rest.reduce((total, current) => total + current, 0);
}

console.log('Sum:', sum(1, 2, 3, 4, 5));

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log('Head:', head);
console.log('Tail:', tail);

// ===========================================
// 6. Default Parameters
// ===========================================
console.log('\n6. Default Parameters:');

function greet(name = 'Guest', greeting = 'Hello') {
    return `${greeting}, ${name}!`;
}

console.log(greet());          // Hello, Guest!
console.log(greet('John'));    // Hello, John!
console.log(greet('Jane', 'Welcome')); // Welcome, Jane!

// ===========================================
// 7. Classes
// ===========================================
console.log('\n7. Classes:');

// ES6 Class syntax
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, my name is ${this.name} and I'm ${this.age} years old.`;
    }
    
    // Static method
    static createAnonymous() {
        return new Person('Anonymous', 0);
    }
}

const john = new Person('John', 30);
console.log(john.greet());

// Inheritance
class Employee extends Person {
    constructor(name, age, position) {
        super(name, age); // Call parent constructor
        this.position = position;
    }
    
    greet() {
        return `${super.greet()} I work as a ${this.position}.`;
    }
}

const jane = new Employee('Jane', 28, 'Developer');
console.log(jane.greet());

// Static method call
const anonymous = Person.createAnonymous();
console.log(anonymous);

// ===========================================
// 8. Promises
// ===========================================
console.log('\n8. Promises:');

// Creating a Promise
function fetchData(success = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve({ id: 1, name: 'Data Item' });
            } else {
                reject(new Error('Failed to fetch data'));
            }
        }, 1000);
    });
}

console.log('Fetching data...');
fetchData()
    .then(data => {
        console.log('Data received:', data);
        return 'Processed data';
    })
    .then(processedData => {
        console.log('Next step with:', processedData);
    })
    .catch(error => {
        console.error('Error:', error.message);
    })
    .finally(() => {
        console.log('Operation completed');
    });

// Promise combinators
const promise1 = Promise.resolve('First');
const promise2 = new Promise((resolve) => setTimeout(() => resolve('Second'), 100));
const promise3 = new Promise((resolve) => setTimeout(() => resolve('Third'), 50));

// Promise.all - wait for all promises to resolve
Promise.all([promise1, promise2, promise3])
    .then(values => {
        console.log('Promise.all result:', values);
    });

// Promise.race - wait for the first promise to settle
Promise.race([promise1, promise2, promise3])
    .then(value => {
        console.log('Promise.race winner:', value);
    });

// ===========================================
// 9. Modules (import/export)
// ===========================================
console.log('\n9. Modules:');
console.log('// In a real application, these would be in separate files');

// Named exports (in math.js)
const mathExports = `
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const PI = 3.14159;
`;

// Default export (in user.js)
const userExports = `
export default class User {
  constructor(name) {
    this.name = name;
  }
}
`;

// Importing (in app.js)
const appImports = `
// Named imports
import { add, subtract, PI } from './math.js';
// Default import
import User from './user.js';
// Renaming imports
import { add as sum } from './math.js';
// Import all as namespace
import * as mathFunctions from './math.js';
`;

console.log('Module exports/imports example:');
console.log(mathExports);
console.log(userExports);
console.log(appImports);

// ===========================================
// 10. Async/Await (ES2017)
// ===========================================
console.log('\n10. Async/Await:');

// Using promises
function fetchUserPromise(id) {
    console.log(`Fetching user ${id} details...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, name: `User ${id}` });
        }, 1000);
    });
}

// Using async/await
async function fetchUserData(id) {
    try {
        console.log('Starting async operation...');
        const user = await fetchUserPromise(id);
        console.log('User:', user);
        
        // Sequential await calls
        const posts = await fetchUserPromise(`${id}-posts`);
        console.log('Posts:', posts);
        
        return { user, posts };
    } catch (error) {
        console.error('Error in async function:', error.message);
        throw error;
    }
}

// Call the async function
fetchUserData(42)
    .then(result => console.log('Final result:', result))
    .catch(error => console.error('Error:', error.message));

// ===========================================
// 11. Optional Chaining (ES2020)
// ===========================================
console.log('\n11. Optional Chaining:');

const user = {
    name: 'Alice',
    address: {
        street: '123 Main St'
        // city is missing
    },
    getEmail() {
        return 'alice@example.com';
    }
};

// Old way
const cityOld = user.address && user.address.city ? user.address.city : 'Unknown';
console.log('Old way:', cityOld);

// New way with optional chaining
const city = user.address?.city ?? 'Unknown';
console.log('Optional chaining:', city);

// Works with function calls too
const email = user.getEmail?.() ?? 'No email';
const phone = user.getPhone?.() ?? 'No phone';
console.log('Email:', email);
console.log('Phone:', phone);

// ===========================================
// 12. Nullish Coalescing (ES2020)
// ===========================================
console.log('\n12. Nullish Coalescing:');

// Old way with logical OR
function configOld(options) {
    const port = options.port || 3000; // But 0 would be treated as falsy!
    return { port };
}

// New way with nullish coalescing
function configNew(options) {
    const port = options.port ?? 3000; // Only null/undefined trigger the default
    return { port };
}

console.log('OR operator with 0:', configOld({ port: 0 })); // { port: 3000 }
console.log('Nullish with 0:', configNew({ port: 0 }));     // { port: 0 }
console.log('Nullish with null:', configNew({ port: null }));     // { port: 3000 }

// Examples of modern JavaScript features in real-world scenarios
console.log('\nExample: Combining Multiple Features');

// A function that processes user data
async function processUserData(userData) {
    // Destructuring with default values
    const { id, name = 'Anonymous', metadata = {} } = userData;
    
    // Optional chaining and nullish coalescing
    const userType = metadata?.type ?? 'standard';
    const tier = metadata?.subscription?.tier ?? 'free';
    
    // Rest operator to collect preferences
    const { preferences, ...userBasics } = userData;
    
    // Async/await with template literals
    try {
        const response = await fetchData();
        console.log(`Processed user ${id}: ${name} (${userType} - ${tier})`);
        
        // Return a new object with spread operator
        return {
            ...userBasics,
            processed: true,
            timestamp: new Date().toISOString(),
            subscription: { tier }
        };
    } catch (error) {
        console.error(`Failed to process user ${id}:`, error.message);
        throw error;
    }
}

// Just log the function definition since we don't want to run this example
console.log(processUserData.toString());

console.log('\nES6+ features make JavaScript more powerful, expressive, and concise!');
