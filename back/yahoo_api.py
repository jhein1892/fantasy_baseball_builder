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