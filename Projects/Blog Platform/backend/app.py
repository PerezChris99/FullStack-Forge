from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# In-memory database for demonstration purposes
posts = []

@app.route('/')
def index():
    return render_template('index.html', posts=posts)

@app.route('/post', methods=['GET', 'POST'])
def post():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        posts.append({'title': title, 'content': content})
        return redirect(url_for('index'))
    return render_template('post.html')

if __name__ == '__main__':
    app.run(debug=True)