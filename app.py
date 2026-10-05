import uuid
from functools import wraps
from keycloak import KeycloakOpenID
import requests
import config

# Initialize Flask
from flask import Flask, render_template, request, redirect, make_response, jsonify
app = Flask(__name__)
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

# Initialize Database if doesn't already exist
init = False
from db import *
for model in [
        PlayerModel,
        ShareModel,
        GamesModel
    ]:
    if not db.table_exists(model):
        model.create_table()
        init = True

if init:
    test_user, c = PlayerModel.get_or_create(
        username = 'Test',
        session_token = 'test',
        session_expiration = (datetime.datetime.now() + datetime.timedelta(days=90)).isoformat()
    )

# Initialize Game
from player import Player
from game import Game

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

        player = authentication_check(request)
        if not player:
            return redirect('/login',code=302)
        return f(player, *args, **kwargs)

    return decorated_function

def authentication_check(request):
    session_token = request.cookies.get('ALTEREDLE_PLAYER_SESSION')

    # Challenge 1. Check session token exists.
    if not Player.session_exists(session_token):
        return False

    # Challenge 2. Check token hasn't expired.
    player = Player(session_token=session_token)
    if player._record.session_expiration < datetime.datetime.now():
        return False

    return player

@app.route("/")
def puzzle():
    # Clear ALTEREDLE_PUZZLE
    response = make_response(render_template("puzzle.html"))
    response.set_cookie('ALTEREDLE_PUZZLE', '')
    return response

@app.route("/puzzle/<puzzle_id>")
@login_required
def historical_puzzle(player, puzzle_id):
    game = Game(
        player=player.id,
        puzzle=puzzle_id
    )
    if game.outcome == 'win':
        response = make_response(render_template("puzzle.html", game=game, historical=True))
        response.set_cookie('ALTEREDLE_PUZZLE', game.puzzle)
        return response

    return redirect('/')

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/auth")
def auth():       
    # Configure client
    keycloak_openid = KeycloakOpenID(
        server_url="https://auth.altered.re",
        client_id="Alteredle",
        realm_name="players",
        client_secret_key=config.ALTEREDLE_CLIENT_SECRET,
        pool_maxsize=15
    )
    # Get Access Token With Code
    credentials = keycloak_openid.token(
        grant_type='authorization_code',
        code=request.args.get('code'),
        redirect_uri=config.KEYCLOAK_REDIRECT_URL
    )
    # Request userinfo from api
    rsp = requests.get(
        url='https://auth.altered.re/realms/players/protocol/openid-connect/userinfo',
        headers={
            'Authorization': 'Bearer '+ credentials['access_token']
        }
    )
    pseudo = rsp.json()['pseudo']
    # Create or update player record
    player = Player(
        username=pseudo,
        session_token=str(uuid.uuid4()),
        session_expiration=datetime.datetime.now()+datetime.timedelta(days=30)
    )
    # Redirect player to collection page with session token
    response = make_response(redirect('/collection'))
    response.set_cookie(
        'ALTEREDLE_PLAYER_SESSION', 
        player._record.session_token, 
        expires=player._record.session_expiration
    )
    return response

@app.route("/logout")
def logout():
    player = authentication_check(request)

    r = player._record
    r.session_expiration = datetime.datetime(year=1970, month=1, day=1)
    r.save()

    return redirect("/")

@app.route('/collection')
@login_required
def collection(player):
    return render_template('collection.html', player=player)

@app.route('/save/game/', methods=["POST"])
@login_required
def saveGame(player):
    save = request.get_json()
    save_puzzle = save.get('puzzle')
    save_guesses = save.get('guesses')

    if save_puzzle and save_guesses:
        game = Game(
            player=player.id,
            puzzle=save_puzzle
        )
        game.save(','.join(save_guesses))

    return "success", 200

@app.route('/save/share/', methods=["POST"])
@login_required
def saveShare(player):
    share = request.get_json()
    share_puzzle = share.get('puzzle', '')
    r,c = ShareModel.get_or_create(
        player=player.id,
        puzzle=share_puzzle
    )
    r.save()
    return "success", 200

@app.route('/load/game/', methods=["POST"])
@login_required
def loadGame(player):
    load = request.get_json()
    load_puzzle = load.get('puzzle', '')
    game = Game(
        player=player.id,
        puzzle=load_puzzle
    )
    return jsonify({'guesses': game.guesses})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
