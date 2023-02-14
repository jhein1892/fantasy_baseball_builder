from flask import Flask, make_response, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# This route sends values to the front when called
@app.route("/")
def home():
    response = make_response("Hello World!")
    return response

# FILE CALLED: App.js
# Used to get league_id and team_name
@app.route("/", methods=["PUT"])
def signIn():
    print("Hello")
    data = request.get_json()
    print(data)

    response = make_response({"message": "Successfully updated", "status" : 200})
    return response

if __name__ == "__main__":
    app.run()