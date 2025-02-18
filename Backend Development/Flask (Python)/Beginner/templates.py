# templates.py

from flask import render_template

# Function to render a template
def render_my_template(template_name, context=None):
    """
    Renders a specified template with the given context.

    :param template_name: Name of the template file to render (e.g., 'index.html').
    :param context: A dictionary containing context variables to pass to the template.
    :return: Rendered HTML of the template.
    """
    return render_template(template_name, **(context or {}))

# Example usage
if __name__ == "__main__":
    # This is just an example; in a real Flask app, this would be handled by the Flask routing.
    example_context = {
        'title': 'Welcome to My Flask App',
        'content': 'This is a simple example of using templates in Flask.'
    }
    print(render_my_template('index.html', example_context))  # Replace 'index.html' with your actual template file name.