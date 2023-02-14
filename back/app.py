from flask import Flask, make_response

app = Flask(__name__)

# 
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.route("/")
def home():
    response = make_response("Hello World!")
    return add_cors_headers(response)

if __name__ == "__main__":
    app.run()