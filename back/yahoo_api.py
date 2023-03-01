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

# lg = league.League(sc=oauth, league_id=21846)

# currentWeek = lg.current_week()
# print(currentWeek)
# Check if there is a saved token
# oauth = OAuth2(creds['consumer_key'], creds['consumer_secret'], from_file='oauth2.json')

# # If there is no saved token, get one
# if not oauth.token_is_valid():
#     oauth.refresh_access_token()

# # Save the token for future use


# # Instantiate the YHandler object
# yh = league.YHandler(oauth)

# # Instantiate the League object using the YHandler object and league ID
# lg = league.League(yhandler=yh, league_id=21846)

# # Call the settings method on the League object to get league settings
# league_settings = lg.settings()


