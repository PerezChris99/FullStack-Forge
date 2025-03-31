/**
 * DOM Manipulation Examples
 * This file demonstrates various techniques for manipulating the DOM with JavaScript
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded. Running examples...');
    
    // Example 1: Selecting elements
    console.log("Example 1: Selecting Elements");
    
    // By ID
    const header = document.getElementById('header');
    if (header) {
        header.style.color = '#0066cc';
        console.log('Changed header color');
    }
    
    // By class name
    const items = document.getElementsByClassName('item');
    console.log(`Found ${items.length} items with class 'item'`);
    
    // By tag name
    const paragraphs = document.getElementsByTagName('p');
    console.log(`Found ${paragraphs.length} paragraph elements`);
    
    // Using querySelector and querySelectorAll
    const firstButton = document.querySelector('button');
    const allButtons = document.querySelectorAll('button');
    console.log(`Found ${allButtons.length} buttons, first button text: ${firstButton ? firstButton.textContent : 'none found'}`);
    
    // Example 2: Creating and adding elements
    console.log("\nExample 2: Creating and adding elements");
    
    const newParagraph = document.createElement('p');
    newParagraph.textContent = 'This paragraph was created with JavaScript!';
    newParagraph.className = 'dynamic-content';
    
    const content = document.getElementById('content');
    if (content) {
        content.appendChild(newParagraph);
        console.log('Added new paragraph to content div');
    }
    
    // Create a list dynamically
    const newList = document.createElement('ul');
    newList.className = 'dynamic-list';
    
    const fruits = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'];
    
    fruits.forEach(fruit => {
        const listItem = document.createElement('li');
        listItem.textContent = fruit;
        newList.appendChild(listItem);
    });
    
    if (content) {
        content.appendChild(newList);
        console.log('Added dynamic list with 5 fruits');
    }
    
    // Example 3: Modifying elements
    console.log("\nExample 3: Modifying elements");
    
    const subtitle = document.getElementById('subtitle');
    if (subtitle) {
        // Change the text
        subtitle.textContent = 'Modified with JavaScript!';
        
        // Add/remove/toggle classes
        subtitle.classList.add('highlighted');
        console.log('Added "highlighted" class to subtitle');
        
        // Set attributes
        subtitle.setAttribute('data-modified', 'true');
        console.log('Added data-modified attribute');
        
        // Inline styles
        subtitle.style.padding = '10px';
        subtitle.style.border = '1px solid #ccc';
        subtitle.style.borderRadius = '5px';
        console.log('Added inline styles to subtitle');
    }
    
    // Example 4: Event Handling
    console.log("\nExample 4: Event Handling");
    
    const clickMeButton = document.getElementById('click-me');
    if (clickMeButton) {
        clickMeButton.addEventListener('click', function(event) {
            alert('Button was clicked!');
            console.log('Click event fired', event);
        });
        console.log('Added click event listener');
        
        // Multiple events
        clickMeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#4CAF50';
        });
        
        clickMeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '';
        });
        console.log('Added hover effects');
    }
    
    // Example 5: Form Handling
    console.log("\nExample 5: Form Handling");
    
    const form = document.getElementById('example-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            let isValid = true;
            
            // Simple validation
            if (!nameInput.value.trim()) {
                alert('Name is required');
                isValid = false;
            }
            
            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                alert('Please enter a valid email address');
                isValid = false;
            }
            
            if (isValid) {
                const resultDiv = document.getElementById('form-result');
                resultDiv.innerHTML = `
                    <h3>Form Submitted Successfully!</h3>
                    <p>Name: ${nameInput.value}</p>
                    <p>Email: ${emailInput.value}</p>
                `;
                form.reset();
            }
        });
        console.log('Added form submit handler');
    }
    
    // Create sample HTML if needed
    if (!document.getElementById('click-me') && content) {
        // Create example button
        const exampleButton = document.createElement('button');
        exampleButton.id = 'click-me';
        exampleButton.textContent = 'Click Me!';
        exampleButton.style.padding = '10px 15px';
        exampleButton.style.margin = '20px 0';
        content.appendChild(exampleButton);
        
        // Create example form
        const exampleForm = document.createElement('form');
        exampleForm.id = 'example-form';
        exampleForm.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name">
            </div>
            <div style="margin-bottom: 10px;">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
            </div>
            <button type="submit">Submit</button>
        `;
        content.appendChild(exampleForm);
        
        // Create form result div
        const resultDiv = document.createElement('div');
        resultDiv.id = 'form-result';
        content.appendChild(resultDiv);
        
        // Re-run the examples for newly created elements
        console.log('Created sample HTML elements. Re-running examples...');
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
});
