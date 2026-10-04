# SET APP ENVIRONMENT. Value can be: 'LOCAL', 'DEV', 'PRD'
ENVIRONMENT = 'DEV'

###############################################################

# CHECK CLIENT SECRET. Don't run app if this isn't set.
try:
    import os
    ALTEREDLE_CLIENT_SECRET = os.getenv("ALTEREDLE_CLIENT_SECRET")
except:
    raise Exception('You need to set ALTEREDLE_CLIENT_SECRET environment variable!')

# SET REDIRECT URL. Value changes by environment
match ENVIRONMENT:
    case 'LOCAL':
        KEYCLOAK_REDIRECT_URL = 'http://localhost/auth'
    case 'DEV':
        KEYCLOAK_REDIRECT_URL = 'https://dev.alteredle.com/auth'
    case 'PRD':
        KEYCLOAK_REDIRECT_URL = 'https://alteredle.com/auth'
