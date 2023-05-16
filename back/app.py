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
###############################################################
## STATS WE ARE GETTING FROM YAHOO
###############################################################
# Pitchers
# [
#   {'stat': {'stat_id': '1032', 'value': '3.97'}},    'FIP'
#   {'stat': {'stat_id': '1021', 'value': '42.4'}},    'GB%'
#   {'stat': {'stat_id': '1022', 'value': '23.2'}},    'FB%'
#   {'stat': {'stat_id': '1031', 'value': '.372'}},    'BABIP'
#   {'stat': {'stat_id': '1036', 'value': '21.7'}},    'HR/FB%'
#   {'stat': {'stat_id': '1037', 'value': '42'}},      'GB'
#   {'stat': {'stat_id': '1038', 'value': '29'}},      'FB'
#   {'stat': {'stat_id': '1020', 'value': '1.1'}},     'GB/FB'
#   {'stat': {'stat_id': '1018', 'value': '17.04'}},   'P/IP'
#   {'stat': {'stat_id': '1034', 'value': '140'}},     'ERA-'
#   {'stat': {'stat_id': '1019', 'value': '86.0'}},    'P/S'
#   {'stat': {'stat_id': '1023', 'value': '0'}},       '?'
#   {'stat': {'stat_id': '1024', 'value': '0'}},       'STR'
#   {'stat': {'stat_id': '1025', 'value': '-'}},       'IRS%'
#   {'stat': {'stat_id': '1028', 'value': '.282'}},    'AVG'
#   {'stat': {'stat_id': '1029', 'value': '.350'}},    'OBP'
#   {'stat': {'stat_id': '1030', 'value': '.465'}},    'SLG'
#   {'stat': {'stat_id': '1033', 'value': '0.6'}}      'WAR'
# ]

# Batters
# [
#   {'stat': {'stat_id': '1035', 'value': '11.8'}},   'HR/FB%' -> HR% with calc (DONE) \/
#   {'stat': {'stat_id': '1008', 'value': '0.7'}},    'GB/FB'   \/
#   {'stat': {'stat_id': '1013', 'value': '.336'}},   'BABIP'   \/
#   {'stat': {'stat_id': '1002', 'value': '.147'}},   'ISO'     \/
#   {'stat': {'stat_id': '1014', 'value': '.304'}},   'wOBA' -> 'rOBA' \/
#   {'stat': {'stat_id': '1015', 'value': '-1.9'}},   'wRAA'    X
#   {'stat': {'stat_id': '1011', 'value': '19'}},     'RC'
#   {'stat': {'stat_id': '1005', 'value': '51'}},     'TOB' -> TB
#   {'stat': {'stat_id': '1006', 'value': '45'}},     'GB'      IGNORE
#   {'stat': {'stat_id': '1009', 'value': '39.5'}},   'GB%'     \/
#   {'stat': {'stat_id': '1007', 'value': '45'}},     'FB'      IGNORE
#   {'stat': {'stat_id': '1010', 'value': '29.8'}},   'FB%'     \/
#   {'stat': {'stat_id': '1004', 'value': '3.68'}},   'P/PA'    IGNORE
#   {'stat': {'stat_id': '1039', 'value': '100.0'}},  'SB%'     \/
#   {'stat': {'stat_id': '1003', 'value': '5'}},      'SL'
#   {'stat': {'stat_id': '1040', 'value': '-2.5'}},   'bWAR'    
#   {'stat': {'stat_id': '1041', 'value': '2.4'}}     'brWAR'
# ]    



# league_adv_avgs_batters = { 
#   'rOBA': .325,       \/
#   'Rbat+': 100,       X
#   'BAbip': .297,      \/
#   'ISO': .159,        \/
#   'HR%': 3.0%,        \/        
#   'SO%': 22.8%,       X
#   'BB%': 8.8%,        \/
#   'EV': 88.4,         X
#   'HardH%':39.4,      X
#   'LD%': 23.7,        X
#   'GB%': 42.8%,       \/
#   'FB%': 25.9,        \/
#   'GB/FB': 0.76,      \/
#   'Pull%': 29.9%,     X
#   'Cent%': 51.6%,     X
#   'Oppo%': 18.4%,     X
#   'WPA': 118,         X
#   'cWPA': 60%,        X
#   'RE24': 2343,       X
#   'RS%': 31%,         X
#   'SB%': 78%,         \/
#   'XBT%': 42%         X 
# }


from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
from flask_sslify import SSLify
from yahoo_api import lg, gm, tm
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
import joblib
import ssl
import datetime
import json
import math

batter_model = joblib.load('batter_model.pkl')



app = Flask(__name__)
sslify = SSLify(app)

CORS(app, origins=['https://localhost:3000'], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

league_stat_map = None
league_categories = None

# FILE CALLED: App.js
# Used to get league_id and team_name

def formatAdvancedStats(player):
  advanced_stats = player['player_advanced_stats']['stats']
  player_type = player['position_type']
  return_stats = {}
  return_list = []

  # Get HR%
  def calcHR_perc():
    HR_FB = return_stats['HR/FB%']
    FB_per = return_stats['FB%']
    HR_perc = FB_per * (HR_FB/100)
    return_stats['HR%'] = round(HR_perc, 3)
    del return_stats['HR/FB%']

  # Get BB%
  # Pretty Close, but not exact.
  def calcBB_perc():
    stats = player['player_stats']['stats']
    freePasses = 0
    PA = 0
    for stat in stats:
      print(stat)
      stat_id = stat['stat']['stat_id']
      # Add all Free Passes
      if stat_id == '55':
        return_stats['OPS+'] = float(stat['stat']['value'])

      if stat_id in ['18', '19', '20', '88']:
        freePasses += int(stat['stat']['value'])

      # split H/AB
      if stat_id == '60':
        abVals = stat['stat']['value'].split('/', 1)
        PA += int(abVals[1])
        return_stats['AB'] = int(abVals[1])


    PA += freePasses
    bb_perc = round(float(freePasses/PA) * 100, 2)
    return_stats['BB%'] = bb_perc
    return_stats['PA'] = PA

  if player_type == 'B':
    for stat in advanced_stats:
      stat = stat['stat']
      stat_id = int(stat['stat_id'])
      value = float(stat['value'])
      stat_name = league_stat_map[stat_id]['display_name']
      if stat_id == 1005:
        return_stats['TB'] = value
        continue
      
      if stat_id in [1015, 1011, 1006, 1007, 1004, 1003, 1040, 1041]:
        continue

      if stat_id in league_stat_map:
        return_stats[stat_name] = value
      else:
        return_stats[stat_id] = value
    
    calcHR_perc()
    calcBB_perc()
    # return_stats['G'] = 162
    stat_order = ['PA', 'wOBA', 'BABIP','ISO','HR%', 'BB%', 'GB%', 'FB%', 'GB/FB', 'SB%', 'AB', 'OPS+', 'TB']
    for stat in stat_order:
      return_list.append(return_stats[stat])
    

    
  return return_list
  
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


# Will probably need to move this to another file for clarity
def getBatterPredictions(stats, names):
  print()
  player_stats = pd.DataFrame(stats)
  imputer = SimpleImputer(strategy='median')
  X = imputer.fit_transform(player_stats)
  batting_tr = pd.DataFrame(X, columns=player_stats.columns, index=player_stats.index)

  num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('std_scaler', StandardScaler())
  ])

  num_attribs = list(player_stats)

  full_pipeline = ColumnTransformer([
    ('num', num_pipeline, num_attribs)
  ])

  batting_prepared = full_pipeline.fit_transform(batting_tr)
  model = batter_model

  final_predictions = model.predict(batting_prepared)
  prediction_labels = ['H', 'R', 'HR', 'RBI','SB','BB', 'IBB','HBP','OPS']
  for i, playerPrediction in enumerate(final_predictions):
      print(f"\n{names[i]}")
      print(stats[i])
      player_scale = 600/stats[i][0]
      for j, prediction in enumerate(playerPrediction):
        if prediction_labels[j] == 'OPS':
          print(f"{prediction_labels[j]}, {round(prediction, 3)}")
        else:
          print(f"{prediction_labels[j]}, {round(prediction*player_scale, 3)}")



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


  adv_stats = []
  player_names = []
  for player in rosterDetails:
    if player['position_type'] == 'B':
      player_names.append(player['name']['full'])
      adv_stats.append(formatAdvancedStats(player))
      
      # print(player['name']['full'])
      # print(adv_stats)
    # player['player_advanced_stats'] = adv_stats
    playerid = player['player_id']
    index = -1
    for i,x in enumerate(roster):
        if x['player_id'] == int(playerid):
          index = i
        
    if index >= 0:
        player['selected_position'] = roster[index]['selected_position']
  
  getBatterPredictions(adv_stats, player_names)



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