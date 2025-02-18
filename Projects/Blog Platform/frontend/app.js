// This file contains the frontend code for a Blog platform using vanilla JavaScript.

document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-container');
    const form = document.getElementById('blog-form');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    // Function to fetch and display blog posts
    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const posts = await response.json();
            blogContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                `;
                blogContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Function to handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = titleInput.value;
        const content = contentInput.value;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });
            if (response.ok) {
                titleInput.value = '';
                contentInput.value = '';
                fetchPosts(); // Refresh the posts after submission
            } else {
                console.error('Error creating post:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    // Initial fetch of blog posts
    fetchPosts();
});