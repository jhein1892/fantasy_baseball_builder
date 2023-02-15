from flask import Flask, make_response, request, jsonify
from flask_cors import CORS

# player_id: the is for the specific player
# name: name of player
# position_type: B for batter, P for pitcher
# eligible_positions: eligable positions for the player
# selected_position: the selected position for the player
# status: injury status

myPlayer = [{'player_id': 8578, 'name': 'John Doe', 'position_type': 'B',
 'eligible_positions': ['C','1B'], 'selected_position': 'C',
 'status': ''},
 {'player_id': 8967, 'name': 'Joe Baseball', 'position_type': 'B',
 'eligible_positions': ['SS'], 'selected_position': 'SS',
 'status': 'DTD'},
 {'player_id': 9961, 'name': 'Ed Reliever', 'position_type': 'P',
 'eligible_positions': ['RP'], 'status': ''}]

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



    # Call yahoo_fantasy_api with league_id and team_id to get roster data

    response = make_response(myPlayer)
    return response

if __name__ == "__main__":
    app.run()