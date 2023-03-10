from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/registration', methods=["GET", "POST"])
def registration():
    if request.method == "GET":
        return render_template('registration.html')
    else:
        return render_template('registration.html')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template('login.html')
    else:
        return render_template('login.html')


@app.route('/voting-statistics')
def voting():
    return render_template('voting-statistics.html')


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )