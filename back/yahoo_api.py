from yahoo_oauth import OAuth2
import yahoo_fantasy_api as yfa
import json

creds = {
    'consumer_key':'dj0yJmk9am44VEt0RTVCWFBxJmQ9WVdrOVRVVnROVGxSVUdJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWU4', 
    'consumer_secret': '38bb163d8d136938494732aab3ecdd95774c3dd2'
}

with open('oauth2.json', 'w') as f:
    f.write(json.dumps(creds))

oauth = OAuth2(None, None, from_file='oauth2.json')
gm = yfa.Game(oauth, 'mlb')


lg = gm.to_league('422.l.21846')
tm = lg.to_team('422.l.21846.t.11') 


def get_roster():
  roster = tm.roster()
  return roster

def get_transactions(args):
  transaction = lg.transactions(args, 10)
  return transaction

def get_waivers():
  waivers = lg.waivers()
  return waivers

def get_playerDetails(args):
  player_details = lg.player_details(args)
  return player_details

def get_matchups():
    matchups = lg.matchups()
    return matchups

def get_standings():
    standings = lg.standings()
    return standings