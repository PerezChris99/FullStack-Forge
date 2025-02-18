# forms.py

from flask import Flask, render_template, request, redirect, url_for
from wtforms import Form, StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired

app = Flask(__name__)

class MyForm(Form):
    name = StringField('Name', [DataRequired()])
    message = TextAreaField('Message', [DataRequired()])
    submit = SubmitField('Submit')

@app.route('/form', methods=['GET', 'POST'])
def form():
    form = MyForm(request.form)
    if request.method == 'POST' and form.validate():
        # Process the data from the form
        name = form.name.data
        message = form.message.data
        # Here you can add code to save the data or send it somewhere
        return redirect(url_for('success'))
    return render_template('form.html', form=form)

@app.route('/success')
def success():
    return "Form submitted successfully!"