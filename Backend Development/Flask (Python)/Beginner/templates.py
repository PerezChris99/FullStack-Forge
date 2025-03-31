"""
Flask Templates
==============

This module demonstrates how to use templates in Flask with Jinja2.
"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    """Render the index page with dynamic content."""
    return render_template('index.html', 
                          title='Flask Templates',
                          heading='Welcome to Flask',
                          content='This is a simple example of using templates in Flask.')

@app.route('/user/<username>')
def user_profile(username):
    """Render a user profile page with user-specific data."""
    # Sample user data - in a real app, this would come from a database
    user = {
        'username': username,
        'bio': f'This is {username}\'s bio',
        'joined': 'January 2023'
    }
    return render_template('user_profile.html', user=user, title=f'{username}\'s Profile')

@app.route('/products')
def products():
    """Render a page with multiple products using loops in the template."""
    products = [
        {'id': 1, 'name': 'Product A', 'price': 19.99},
        {'id': 2, 'name': 'Product B', 'price': 29.99},
        {'id': 3, 'name': 'Product C', 'price': 39.99}
    ]
    return render_template('products.html', products=products, title='Our Products')

@app.route('/conditional')
def conditional_example():
    """Demonstrate conditional rendering in templates."""
    show_section = True
    user_type = 'admin'
    return render_template('conditional.html', 
                          show_section=show_section, 
                          user_type=user_type,
                          title='Conditional Example')

def template_directory_structure():
    """
    Print a guide to the expected template directory structure.
    
    In a Flask application, templates should be placed in a 'templates' directory
    in the root of the project.
    """
    print("""
    Expected directory structure:
    
    project_folder/
    ├── app.py
    ├── templates/
    │   ├── index.html
    │   ├── user_profile.html
    │   ├── products.html
    │   ├── conditional.html
    │   └── base.html (optional for template inheritance)
    └── static/
        ├── css/
        ├── js/
        └── images/
    """)

if __name__ == '__main__':
    template_directory_structure()
    print("\nTo run this example, make sure you have created the necessary template files.")
    app.run(debug=True)