from flask import Flask, make_response, request, jsonify
from flask_cors import CORS

# player_id: the is for the specific player
# name: name of player
# position_type: B for batter, P for pitcher
# eligible_positions: eligable positions for the player
# selected_position: the selected position for the player
# status: injury status

myPlayer = [
    #Position Players
    {'player_id': 1, 'name': 'Ronald Acuna Jr.', 'position_type': 'B',
 'eligible_positions': ['OF'], 'selected_position': 'OF',
 'status': ''},
    {'player_id': 2, 'name': 'Julio Rodriguez', 'position_type': 'B',
 'eligible_positions': ['OF'], 'selected_position': 'OF',
 'status': ''},
    {'player_id': 3, 'name': 'Aaron Judge', 'position_type': 'B',
 'eligible_positions': ['OF'], 'selected_position': 'OF',
 'status': ''},
    {'player_id': 4, 'name': 'Trea Turner', 'position_type': 'B',
 'eligible_positions': ['SS'], 'selected_position': 'SS',
 'status': ''},
    {'player_id': 5, 'name': 'Jose Ramirez', 'position_type': 'B',
 'eligible_positions': ['3B'], 'selected_position':'3B', 'status': ''},
    {'player_id': 6, 'name': 'Mookie Betts', 'position_type': 'B',
 'eligible_positions': ['OF', '2B'], 'selected_position':'2B', 'status': ''},
    {'player_id': 7, 'name': 'Vladamir Guerrero Jr.', 'position_type': 'B',
 'eligible_positions': ['1B'], 'selected_position': '1B',
 'status': ''},
    {'player_id': 8, 'name': 'JT Realmuto', 'position_type': 'B',
 'eligible_positions': ['C'], 'selected_position': 'C',
 'status': ''},
    {'player_id': 9, 'name': 'Bobby Witt Jr', 'position_type': 'B',
 'eligible_positions': ['3B', 'SS'], 'selected_position':'Util', 'status': ''},

    # Pitchers

    {'player_id': 10, 'name': 'Corbin Burnes', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'SP', 'status': ''},
    {'player_id': 11, 'name': 'Gerrit Cole', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'SP', 'status': ''},
    {'player_id': 12, 'name': 'Jacob deGrom', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'SP', 'status': ''},
    {'player_id': 13, 'name': 'Spencer Strider', 'position_type': 'P',
 'eligible_positions': ['SP', 'RP'], 'selected_position':'RP', 'status': ''},
    {'player_id': 14, 'name': 'Edwin Diaz', 'position_type': 'P',
 'eligible_positions': ['RP'], 'selected_position':'RP', 'status': ''},
    {'player_id': 15, 'name': 'Josh Hader', 'position_type': 'P',
 'eligible_positions': ['RP'], 'selected_position':'P', 'status': ''},
    {'player_id': 16, 'name': 'Aaron Nola', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'P', 'status': ''},
    {'player_id': 17, 'name': 'Shane McClanahan', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'P', 'status': ''},

    # Bench
    {'player_id': 18, 'name': 'Mike Trout', 'position_type': 'B',
 'eligible_positions': ['OF'], 'selected_position':'BN', 'status': ''},
    {'player_id': 19, 'name': 'Matt Olson', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'BN', 'status': ''},
    {'player_id': 20, 'name': 'Jose Altuve', 'position_type': 'B',
 'eligible_positions': ['2B'], 'selected_position':'BN', 'status': ''},

    # Injured List
    {'player_id': 21, 'name': 'Pete Alonso', 'position_type': 'B',
 'eligible_positions': ['1B'], 'selected_position':'IL', 'status': 'DTD'},
    {'player_id': 22, 'name': 'Michael Harris II', 'position_type': 'B',
 'eligible_positions': ['OF'], 'selected_position':'IL', 'status': 'DTD'},
    {'player_id': 23, 'name': 'Dylan Cease', 'position_type': 'P',
 'eligible_positions': ['SP'], 'selected_position':'IL', 'status': 'DTD'},

 ]

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
    data = request.get_json()
    print(data)

    # Call yahoo_fantasy_api with league_id and team_id to get roster data
    # For now, calling local object of fake team for reference on front
    response = make_response(myPlayer)
    return response

# FILE CALLED: teamRoster.js
# Updated Roster being sent here
@app.route("/updateRoster", methods=["PUT"])
def updateRoster():
    # Updated Roster set being passed through here
    data = request.get_json()
    
    print(data)

    response = make_response({"status": 200})
    return response

if __name__ == "__main__":
    app.run()