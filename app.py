import uuid
from functools import wraps

# Initialize Flask
from flask import Flask, render_template, request, redirect, make_response, jsonify
from flask_bcrypt import Bcrypt
app = Flask(__name__)
app.jinja_env.add_extension('jinja2.ext.loopcontrols')
bcrypt = Bcrypt(app)

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
    return render_template("puzzle.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    match request.method:
        case 'GET':
            return render_template("login.html")
        case 'POST':
            username = request.form.get("username").lower()
            password = request.form.get("password")

            # Challenge 1. Check player exists.
            if not Player.username_exists(username):
                return render_template("access/login.html", error="Invalid username or password.")

            # Challenge 2. Check password is correct.
            r = Player(username=username)._record
            if not bcrypt.check_password_hash(r.password, password):
                return render_template("access/login.html", error="Invalid username or password.")

            r.session_token = str(uuid.uuid4())
            r.session_expiration = datetime.datetime.now()+datetime.timedelta(days=30)
            r.save()

            response = make_response(redirect('/'))
            response.set_cookie('session', r.session_token, expires=r.session_expiration)
 
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
    save_puzzle = save.get('puzzle', '')
    save_guesses = save.get('guesses', '')

    game = Game(
        player=player.id,
        puzzle=save_puzzle
    )
    game.save(','.join(save_guesses))

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

    return jsonify({
        'guesses': game.guesses
    })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
