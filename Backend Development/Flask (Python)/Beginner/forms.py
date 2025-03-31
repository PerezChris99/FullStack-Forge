"""
Flask Forms
==========

This module demonstrates how to handle forms in Flask, including form validation
and processing using Flask-WTF.
"""

from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField, PasswordField, EmailField, SelectField, BooleanField
from wtforms.validators import DataRequired, Email, Length, EqualTo

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Required for CSRF protection

class ContactForm(FlaskForm):
    """A simple contact form with validation."""
    name = StringField('Name', validators=[DataRequired()])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    message = TextAreaField('Message', validators=[DataRequired(), Length(min=10, max=500)])
    submit = SubmitField('Submit')

class RegistrationForm(FlaskForm):
    """A user registration form with validation."""
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=25)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[
        DataRequired(), 
        Length(min=6, message='Password must be at least 6 characters')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    accept_tos = BooleanField('I accept the Terms of Service', validators=[DataRequired()])
    submit = SubmitField('Register')

class ProductForm(FlaskForm):
    """A form for adding a product."""
    name = StringField('Product Name', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    category = SelectField('Category', choices=[
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('books', 'Books'),
        ('other', 'Other')
    ])
    price = StringField('Price', validators=[DataRequired()])
    submit = SubmitField('Add Product')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Handle the contact form submission."""
    form = ContactForm()
    if form.validate_on_submit():
        # Process the valid form data
        name = form.name.data
        email = form.email.data
        message = form.message.data
        
        # In a real application, you might save this to a database
        # or send an email
        flash(f'Thank you, {name}! Your message has been sent.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html', form=form, title='Contact Us')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration."""
    form = RegistrationForm()
    if form.validate_on_submit():
        # Process the registration data
        # In a real application, you would hash the password and save to a database
        flash('Registration successful! You can now log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form, title='Register')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Simple login route for demonstration."""
    return "Login page would be here"

@app.route('/basic-form', methods=['GET', 'POST'])
def basic_form():
    """Demonstrate a manual form without Flask-WTF."""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        
        # Perform manual validation
        errors = {}
        if not name:
            errors['name'] = 'Name is required'
        if not email:
            errors['email'] = 'Email is required'
        
        if not errors:
            flash(f'Form submitted successfully! Hello, {name}', 'success')
            return redirect(url_for('basic_form'))
        
        return render_template('basic_form.html', errors=errors, name=name, email=email)
    
    return render_template('basic_form.html')

if __name__ == '__main__':
    print("To use Flask-WTF forms, install it first: pip install Flask-WTF")
    print("Templates required: contact.html, register.html, basic_form.html")
    app.run(debug=True)