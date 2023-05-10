# stat_map
# {
#   0: 'G', 2: 'GS', 3: 'AVG', 4: 'OBP', 5: 'SLG', 6: 'AB', 7: 'R', 8: 'H', 9: '1B', 10: '2B', 
#   11: '3B', 12: 'HR', 13: 'RBI', 14: 'SH', 15: 'SF', 16: 'SB', 17: 'CS', 18: 'BB', 19: 'IBB', 
#   20: 'HBP', 21: 'SO', 22: 'GDP', 23: 'TB', 25: 'GS', 26: 'ERA', 27: 'WHIP', 28: 'W', 29: 'L', 32: 'SV', 
#   34: 'H', 35: 'BF', 36: 'R', 37: 'ER', 38: 'HR', 39: 'BB', 40: 'IBB', 41: 'HBP', 42: 'K', 43: 'BK', 
#   44: 'WP', 48: 'HLD', 50: 'IP', 51: 'PO', 52: 'A', 53: 'E', 54: 'FLD%', 55: 'OPS', 56: 'SO/W', 
#   57: 'SO9', 65: 'PA', 84: 'BS', 85: 'NSV', 87: 'DP', 

#   1032: 'FIP', 1021: 'GB%', 1022: 'FB%', 1031: 'BABIP', 1036: 'HR/FB%', 1037: 'GB', 1038: 'FB', 
#   1020: 'GB/FB', 1018: 'P/IP', 1034: 'ERA-', 1019: 'P/S', 1024: 'STR', 1025: 'IRS%', 1026: 'RS', 
#   1027: 'RS/9', 1028: 'AVG', 1029: 'OBP', 1030: 'SLG', 1033: 'WAR', 1035: 'HR/FB%', 1008: 'GB/FB', 
#   1013: 'BABIP', 1002: 'ISO', 1001: 'CT%', 1014: 'wOBA', 1015: 'wRAA', 1011: 'RC', 1005: 'TOB', 
#   1006: 'GB', 1009: 'GB%', 1007: 'FB', 1010: 'FB%', 1016: 'OPS+', 1004: 'P/PA', 1039: 'SB%', 
#   1012: 'GDPR', 1003: 'SL', 1017: 'FR', 1040: 'bWAR', 1041: 'brWAR', 1042: 'WAR'
# }


from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
from flask_sslify import SSLify
from yahoo_api import lg, gm, tm
import ssl
import datetime
import json
import math

app = Flask(__name__)
sslify = SSLify(app)

CORS(app, origins=['https://localhost:3000'], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

league_stat_map = None
league_categories = None

# FILE CALLED: App.js
# Used to get league_id and team_name

def formatAdvancedStats(player):
  advanced_stats = player['player_advanced_stats']['stats']
  return_stats = {}
  for stat in advanced_stats:
    stat = stat['stat']
    stat_id = int(stat['stat_id'])
    if stat_id in league_stat_map:
      return_stats[stat_id] = {'value': stat['value'], 'display_name': league_stat_map[stat_id]['display_name']}
    else:
      return_stats[stat_id] = {'value': stat['value']}
  
  print(return_stats)
  return 0
  

def getRosterIds(roster = tm.roster()):
  rosterIDs = []

  for player in roster:
    rosterIDs.append(player['player_id'])
    
  return rosterIDs

def getCategories():
  global league_categories
  if league_categories is None:
    league_categories = lg.stat_categories()

def getStatMap():
  global league_stat_map
  if league_stat_map is None:
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
      if key is 60:
        league_stat_map[key] = {'display_name': value, 'position_type': 'B'}
        continue
      if key is 50:
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

  standings = lg.standings()
  matchups = lg.matchups()

  if league_categories is None:
    getCategories()

  if league_stat_map is None:
    getStatMap()
  
  roster = tm.roster()

  rosterIDs = getRosterIds(roster)
  rosterDetails = lg.player_details(rosterIDs)


  
  for player in rosterDetails:
    adv_stats = formatAdvancedStats(player)
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
      'stat_map': league_stat_map})
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
        except ValueError as e:
          print(f"Error with: {key}, value: {value}, {e}")
    except ValueError as e:
      print("Error, {e}")

    start_date += delta

  response = make_response(json.dumps(weekStats))
  return response

@app.route("/leagueNews", methods=["GET"])
def getInformation():
   dropTransactions = lg.transactions('drop', 10)
   tradeTransactions = lg.transactions('trade', 10)
   waivers = lg.waivers()

   response = make_response({"dropped": dropTransactions, "traded": tradeTransactions, "waivers": waivers})
   return response

@app.route("/playerStats", methods=["PUT"])
def getPlayerStats():
  data = request.get_json()
  data = data['data']
  # playerStats = lg.player_stats(data, 'season', season=2022)
  playerDetails = lg.player_details(data)

  response = make_response({"player_details": playerDetails})
  return response

def percent_owned(e):
   return e['percent_owned']

@app.route("/freeAgents", methods=["PUT"])
def getFreeAgents():
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
      
      trade['tradee_players'] = lg.player_details(tradee_ids)
      trade['trader_players'] = lg.player_details(trader_ids)


  # print(teams)

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