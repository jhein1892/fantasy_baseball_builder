from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
from flask_sslify import SSLify
from yahoo_api import lg, gm, tm, get_roster, get_transactions, get_waivers, get_playerDetails, get_matchups, get_standings
from customThread import create_threads
import datetime
import json
import math
# import threading

app = Flask(__name__)
sslify = SSLify(app)

CORS(app, origins=['https://localhost:3000'], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

league_stat_map = None
league_categories = None
league_avgs = {
  # Average over 600PA
  'B':{
    'R': 73,
    'H' : 132,
    '2B': 27,
    '3B': 2,
    'HR': 18,
    'RBI': 70,
    'SB': 11,
    'CS': 3,
    'BB': 53,
    'SO':136,
    'H/AB': .248,
    'OBP': .321,
    'SLG': .408,
    'OPS': .728,
    'TB': 218,
    'GDP': 11,
    'HBP': 7,
    'SH': 1,
    'SF': 4,
    'IBB':1
  },
  # Average per 180IP
  'P':{
    'W': 10,
    'L': 10,
    'W-L%': .500,
    'ERA': 4.32,
    'G': 86,
    'GS': 20,
    'GF': 20,
    'CG': 0,
    'SHO': 0,
    'SV+H': 5,
    'IP': 180,
    'H': 170,
    'R':93,
    'ER':86,
    'HR': 23,
    'BB': 68,
    'IBB': 2,
    'K': 175,
    'HBP': 9,
    'BLK': 1,
    'WP': 7,
    'BF': 770,
    'ERA+': 102,
    'FIP': 4.32,
    'WHIP':1.321,
    'H9': 8.5,
    'HR9': 1.2,
    'BB9': 3.4,
    'SO9': 8.7,
    'SO/W': 2.58
  }
}

def calc_PA(player):
  stats = player['player_stats']['stats']
  freePasses = 0
  PA = 0
  for stat in stats:
    stat_id = stat['stat']['stat_id']
    # Add all Free Passes
    if stat_id in ['18', '19', '20', '88']:
      freePasses += int(stat['stat']['value'])

    # split H/AB
    if stat_id == '60':
      abVals = stat['stat']['value'].split('/', 1)
      PA += int(abVals[1])

    PA += freePasses
    return float(PA/600)
  
def getRosterIds(roster = tm.roster()):
  rosterIDs = []

  for player in roster:
    rosterIDs.append(player['player_id'])
    
  return rosterIDs

def getStatMap():
  print('Categories')
  global league_stat_map
  global league_categories
  league_categories = lg.stat_categories()

  league_stat_map = lg._get_static_mlb_id_map()
  league_stat_map[30] = 'CG'
  league_stat_map[44] = 'BLK'
  league_stat_map[46] = 'GIDP'
  league_stat_map[60] = 'H/AB'
  league_stat_map[72] = 'PICK'
  league_stat_map[88] = 'CI'
  league_stat_map[89] = 'SV+H'

  temp_cat = league_categories

  for key, value in league_stat_map.items():
    if key == 60:
      league_stat_map[key] = {'display_name': value, 'position_type': 'B'}
      continue
    if key == 50:
      league_stat_map[key] = {'display_name': value, 'position_type': 'P'}
      continue

    updated = False
    for cat in temp_cat:
      if cat['display_name'] == value:
        league_stat_map[key] = cat
        temp_cat.remove(cat)
        updated = True
        break
      else:
        continue
    if not updated:
      league_stat_map[key] = {'display_name': value}

@app.route("/")
def signIn():
  global league_stat_map
  global league_categories
  global league_avgs

  response = create_threads(['standings', 'matchups', 'roster'], [get_standings, get_matchups, get_roster])
  # response = getLeagueInfo()
  standings = response['standings']
  matchups = response['matchups']
  roster = response['roster']

  if league_categories is None:
    getStatMap()
  
  rosterIDs = getRosterIds(roster)
  # rosterDetails = lg.player_details(rosterIDs)
  rosterDetails = get_playerDetails(rosterIDs)

  for player in rosterDetails:
    PAVal = calc_PA(player)
    player['player_stats']['stats'].append({'stat':{'stat_id': '65', 'value':f'{PAVal}'}})
    playerid = player['player_id']
    index = -1
    for i,x in enumerate(roster):
        if x['player_id'] == int(playerid):
          index = i
        
    if index >= 0:
        player['selected_position'] = roster[index]['selected_position']

  # Call yahoo_fantasy_api with league_id and team_id to get roster data

  response = make_response(
    {'roster': rosterDetails, 
      'standings': standings,
      'matchups': matchups, 
      'stat_map': league_stat_map,
      'league_avg': league_avgs})
  return response

@app.route("/weekStats", methods=["GET"])
def  getWeekStats():
    # Section to get the week stats for each player
  date_range = lg.week_date_range(lg.current_week())
  # date_range = lg.week_date_range(2)
  start_date = date_range[0]
  today = datetime.date.today()
  delta = datetime.timedelta(days=1)
  end_date = today if today < date_range[1] else date_range[1]
  # end_date = date_range[0] + delta
  rosterIDs = getRosterIds()
  weekStats = {id:{} for id in rosterIDs} # Need to combine them here for easier sending back

  # Each Day we have an array of objects that hold values for that day
  # I can recursivesly create an object that uses index as keys and add the values to that key
  while start_date <= end_date:
    try:      
      data = lg.player_stats(rosterIDs, 'date', start_date)
      for player in data:
        try:
          playerID = player['player_id']
          weekStats[playerID]['name'] = weekStats[playerID].get('name', player['name'])
          if isinstance(player['G'], float): # If we played a game that day

            for key, value in player.items(): 

              # Create a Stat Object to hold all the calculations

              if not isinstance(value, float):
                continue
              if math.isinf(value):
                weekStats[playerID][key] = 'inf'
              else:
                curr_player = weekStats[playerID]
                if key == 'AVG':
                  avg_float = curr_player['H']/curr_player['AB']
                  curr_player['H/AB'] = float("{:.3f}".format(avg_float)) if avg_float >= 1 else float("{:.3f}".format(avg_float).lstrip('0'))
                elif key == 'SLG':
                  # (1B + 2x2B + 3x3B + 4xHR)/AB
                  slug_float = (curr_player['1B'] + (2 * curr_player['2B']) + (3 * curr_player['3B']) + (4 * curr_player['HR']))/curr_player['AB']
                  curr_player['SLG'] = float("{:.3f}".format(slug_float))
                
                elif key == 'OPS':
                  ops_float = round(curr_player['SLG'] + curr_player['OBP'], 3)
                  # curr_player['OPS'] = round(ops_float, 3)
                  curr_player['OPS'] = float("{:.3f}".format(ops_float))

                elif key == 'OBP':
                  # (H + BB + HBP)/(AB + BB + HBP + SF)
                  onBase_float = (curr_player['H'] + curr_player['BB'] + curr_player['IBB'] + curr_player['HBP'])/(curr_player['AB'] + curr_player['BB'] + curr_player['HBP'] + curr_player['SF'])
                  curr_player['OBP'] = float("{:.3f}".format(onBase_float))

                else:
                  weekStats[playerID][key] = round(weekStats[playerID].get(key, 0.0) + value, 3)
        except ValueError and TypeError as e:
          print(weekStats[playerID][key])
          print(f"Error with: {key}, value: {value}, {e}")
    except ValueError as e:
      print("Error, {e}")

    start_date += delta

  response = make_response(json.dumps(weekStats))
  return response

@app.route("/leagueNews", methods=["GET"])
def getInformation():
  results = create_threads(['dropped', 'traded', 'waivers'], [get_transactions, get_transactions, get_waivers], args=[True, True, False], vals=['drop', 'trade', None])
  response = make_response({"dropped": results['dropped'], "traded": results['traded'], "waivers": results['waivers']})
  return response

@app.route("/playerStats", methods=["PUT"])
def getPlayerStats():
  data = request.get_json()
  data = data['data']
  # playerDetails = lg.player_details(data)
  playerDetails = get_playerDetails(data)

  response = make_response({"player_details": playerDetails})
  return response

@app.route("/freeAgents", methods=["PUT"])
def getFreeAgents():

  def percent_owned(e):
    return e['percent_owned']
  
  data = request.get_json()
  positionRequested = data['data']

  freeAgents = lg.free_agents(positionRequested)
  freeAgents.sort(reverse=True, key=percent_owned)
  response = make_response({'availablePlayers': freeAgents})
  
  return response

@app.route("/availableTrades")
def getTrades():
  pendingTrades = tm.proposed_trades()
  if len(pendingTrades) > 0:
    teams = lg.teams()
    for trade in pendingTrades:
      trade['tradee_team_key'] = teams[trade['tradee_team_key']]
      trade['trader_team_key'] = teams[trade['trader_team_key']]
      tradee_players = trade['tradee_players']
      tradee_ids = []
      for player in tradee_players:
        tradee_ids.append(int(player['player_id']))
      
      trader_players = trade['trader_players']
      trader_ids = []
      for player in trader_players:
        trader_ids.append(int(player['player_id']))
      
      results = create_threads(['tradee_players', 'trader_players'], [get_playerDetails, get_playerDetails], args=[True, True], vals=[tradee_ids, trader_ids])
      for name in results:
        trade[name] = results[name]

  return make_response({"pending_trades": pendingTrades})

@app.route("/availableTrades", methods=["PUT"])
def putTradeResponse():
   data = request.get_json()
   print(data)

   return make_response({'status': 200})

## Making changes to roster
# Route to Drop a Player
@app.route("/dropPlayer", methods=["PUT"])
def dropPlayer():
  data = request.get_json()
  playerID = data['id']
  print(f"DROP: {playerID}")

  response = make_response({"status": 200})
  return response

# Route to Add a Player
@app.route("/addPlayer", methods=["PUT"])
def addPlayer():
  data = request.get_json()
  playerID = data['id']
  print(f"ADD {playerID}")

  response = make_response({"status": 200})
  return response

# Route to Add/Drop a Player
@app.route("/addDropPlayer", methods=["PUT"])
def addDropPlayer():
   data = request.get_json()
   playerID = data['id']
   print(f"ADD DROP: {playerID}")

   response = make_response({"status": 200})
   return response


  # Uncomment to drop player
  # tm.drop_player(playerID)

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