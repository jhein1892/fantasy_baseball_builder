from yahoo_oauth import OAuth2
import json

creds = {
    'consumer_key':'dj0yJmk9Rm5ycGRLS1FqSmQxJmQ9WVdrOVdFUmhjM2xDUmxZbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTNi', 
    'consumer_secret': 'my_secret'}
with open (args['<json>'], 'w') as f:
    f.write(json.dumps(creds))

oauth = OAuth2(None, None, from_file='oauth2.json')