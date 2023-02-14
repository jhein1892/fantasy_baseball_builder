from flask import Flask, make_response, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# @app.after_request
# def after_request(response):
#     response.headers["Access-Control-Allow-Origin"] = "*"
#     response.headers["Access-Control-Allow-Headers"] = "Content-Type"
#     response.headers["Access-Control-Allow-Methods"] = "GET, HEAD, POST, PUT"
#     return response

# This route sends values to the front when called
@app.route("/")
def home():
    response = make_response("Hello World!")
    return response

@app.route("/", methods=["PUT"])
def signIn():
    print("Hello")
    data = request.get_json()
    print(data)

    response = make_response({"message": "Successfully updated", "status" : 200})
    return response

if __name__ == "__main__":
    app.run()