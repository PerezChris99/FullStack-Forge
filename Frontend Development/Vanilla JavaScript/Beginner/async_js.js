// async_js.js

// Asynchronous JavaScript allows us to perform tasks without blocking the execution of other code. 
// This is particularly useful for operations like fetching data from a server or reading files.

// Example of using setTimeout to simulate asynchronous behavior
console.log("Start");

setTimeout(() => {
    console.log("This message is delayed by 2 seconds");
}, 2000);

console.log("End");

// Example of using Promises
const fetchData = new Promise((resolve, reject) => {
    const data = { name: "John", age: 30 }; // Simulated data
    const success = true; // Simulate success or failure

    if (success) {
        resolve(data);
    } else {
        reject("Error fetching data");
    }
});

fetchData
    .then(data => {
        console.log("Data fetched:", data);
    })
    .catch(error => {
        console.error(error);
    });

// Example of using async/await
const fetchDataAsync = async () => {
    try {
        const data = await fetchData; // Wait for the promise to resolve
        console.log("Data fetched with async/await:", data);
    } catch (error) {
        console.error(error);
    }
};

fetchDataAsync();