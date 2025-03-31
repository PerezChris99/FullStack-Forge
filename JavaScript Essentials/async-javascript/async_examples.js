/**
 * Asynchronous JavaScript Examples
 * ================================
 * This file demonstrates various asynchronous patterns in JavaScript
 */

// Utility function to simulate network delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Example 1: Callbacks
console.log("Example 1: Callbacks");

function fetchUserDataWithCallback(userId, callback) {
    console.log(`Fetching data for user ${userId}...`);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        // Simulate successful response
        const userData = {
            id: userId,
            name: `User ${userId}`,
            email: `user${userId}@example.com`
        };
        
        callback(null, userData);
        
        // To simulate error:
        // callback(new Error('Failed to fetch user data'), null);
    }, 1500);
}

// Using the callback function
fetchUserDataWithCallback(123, (error, user) => {
    if (error) {
        console.error('Error:', error.message);
        return;
    }
    
    console.log('User data received:', user);
});

// Example 2: Promises
console.log("\nExample 2: Promises");

function fetchUserDataWithPromise(userId) {
    console.log(`Fetching data for user ${userId} with Promise...`);
    
    return new Promise((resolve, reject) => {
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Successful case
            if (userId > 0) {
                const userData = {
                    id: userId,
                    name: `User ${userId}`,
                    email: `user${userId}@example.com`
                };
                resolve(userData);
            } 
            // Error case
            else {
                reject(new Error('Invalid user ID'));
            }
        }, 1500);
    });
}

// Using the Promise
fetchUserDataWithPromise(456)
    .then(userData => {
        console.log('User data received (Promise):', userData);
        return fetchUserDataWithPromise(789); // Chain another request
    })
    .then(anotherUser => {
        console.log('Second user data received:', anotherUser);
    })
    .catch(error => {
        console.error('Error with Promise:', error.message);
    })
    .finally(() => {
        console.log('Promise operation completed');
    });

// Example 3: Async/Await
console.log("\nExample 3: Async/Await");

async function fetchMultipleUsers() {
    console.log('Starting to fetch multiple users...');
    
    try {
        console.log('Fetching first user...');
        const user1 = await fetchUserDataWithPromise(111);
        console.log('First user:', user1);
        
        console.log('Fetching second user...');
        const user2 = await fetchUserDataWithPromise(222);
        console.log('Second user:', user2);
        
        return [user1, user2]; // Return both users
    } catch (error) {
        console.error('Error in async function:', error.message);
        throw error; // Re-throw to be caught by caller
    }
}

// Using the async function
fetchMultipleUsers()
    .then(users => {
        console.log('All users:', users);
    })
    .catch(error => {
        console.error('Failed to fetch users:', error.message);
    });

// Example 4: Promise.all (parallel execution)
console.log("\nExample 4: Promise.all");

async function fetchUsersInParallel() {
    const userIds = [333, 444, 555];
    console.log(`Fetching ${userIds.length} users in parallel...`);
    
    try {
        // Create an array of promises
        const userPromises = userIds.map(id => fetchUserDataWithPromise(id));
        
        // Wait for all promises to resolve
        const users = await Promise.all(userPromises);
        console.log('All users fetched in parallel:', users);
        return users;
    } catch (error) {
        console.error('Error fetching users in parallel:', error.message);
        throw error;
    }
}

fetchUsersInParallel().catch(error => {
    console.error('Parallel fetch failed:', error.message);
});

// Example 5: Promise.race
console.log("\nExample 5: Promise.race");

async function demoPromiseRace() {
    console.log('Starting Promise.race demo...');
    
    // Create two promises that resolve at different times
    const promise1 = delay(2000).then(() => 'Promise 1 resolved after 2 seconds');
    const promise2 = delay(1000).then(() => 'Promise 2 resolved after 1 second');
    
    try {
        // Use Promise.race to get the first promise to resolve/reject
        const winner = await Promise.race([promise1, promise2]);
        console.log('The winner is:', winner);
    } catch (error) {
        console.error('Promise.race error:', error.message);
    }
}

demoPromiseRace();

// Example 6: Handling Errors in Async/Await
console.log("\nExample 6: Error Handling");

async function fetchWithErrorHandling() {
    try {
        // Try to fetch a user with an invalid ID
        console.log('Trying to fetch user with invalid ID...');
        const user = await fetchUserDataWithPromise(-1);
        console.log('This should not be printed if there is an error');
    } catch (error) {
        console.error('Caught error in async/await:', error.message);
    } finally {
        console.log('Fetch operation completed, regardless of outcome');
    }
}

fetchWithErrorHandling();

// Example 7: Fetch API (if running in a browser environment)
console.log("\nExample 7: Fetch API");

// Check if we're in a browser environment
if (typeof window !== 'undefined' && window.fetch) {
    async function fetchFromAPI() {
        try {
            console.log('Fetching data from JSONPlaceholder API...');
            const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API data received:', data);
            return data;
        } catch (error) {
            console.error('Fetch API error:', error.message);
            throw error;
        }
    }
    
    fetchFromAPI().catch(error => {
        console.error('fetchFromAPI failed:', error.message);
    });
} else {
    console.log('Fetch API is not available in this environment');
}

// Example 8: Custom Promise methods
console.log("\nExample 8: Custom Promise Methods");

class ImprovedPromise extends Promise {
    // Add a timeout method to any promise
    timeout(ms) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
        });
        
        return Promise.race([this, timeoutPromise]);
    }
}

async function testTimeoutPromise() {
    try {
        // Create a promise that will take 3 seconds
        const slowOperation = new ImprovedPromise(resolve => {
            setTimeout(() => resolve('Operation completed'), 3000);
        });
        
        // Set a 2-second timeout
        console.log('Starting operation with 2-second timeout...');
        const result = await slowOperation.timeout(2000);
        console.log('Result:', result); // This won't be reached
    } catch (error) {
        console.error('Timeout error:', error.message);
    }
}

testTimeoutPromise();

// Display a message when all examples have been scheduled
console.log('\nAll asynchronous examples have been scheduled to run.');
console.log('Watch the console as they complete in the background.');
