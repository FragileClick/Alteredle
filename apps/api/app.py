from flask import Flask, redirect, request, jsonify
import sqlite3
import json
from pathlib import Path
import logging

app = Flask(__name__)
DATABASE_PATH = 'apps/api/db.sqlite'

# Check if DB exists. If it doesn't initialize a new DB.
if not Path(DATABASE_PATH).is_file():
    logging.info(f'No DB found. Creating new DB at {DATABASE_PATH}')

    # Import the DB definition
    with open('apps/api/db_init.sql', 'r') as f:
        db_init = f.read()
    # Import the DB definition
    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.cursor()
        cursor.executescript(db_init)
        conn.commit()

@app.route('/')
def index():
    return redirect('https://alteredle.com')

@app.route('/submit/player_result', methods=['POST'])
def submit_player_result():
    # Extract data from player result
    r = request.get_json()
    timestamp = r.get('timestamp')
    puzzle_id = r.get('puzzle_id')
    result = r.get('result')
    score = r.get('score')
    guesses = json.dumps(r.get('guesses'))
    board = r.get('board')
    # Write player result to db
    try:
        logging.info(f'Recorded player_result for puzzle {puzzle_id}')
        with sqlite3.connect(DATABASE_PATH) as db:
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO player_results (timestamp,puzzle_id,result,score,guesses,board) VALUES (?,?,?,?,?,?)', 
                (timestamp,puzzle_id,result,score,guesses,board)
            )
            db.commit()
        return "success", 200
    except:
        logging.error(f'Failed to record result for puzzle {puzzle_id}')
        return {
            'error': 'Failed to record player result'
        }

@app.route('/submit/player_share', methods=['POST'])
def submit_player_share():    
    # Extract data from player share
    r = request.get_json()
    timestamp = r.get('timestamp')
    puzzle_id = r.get('puzzle_id')
    # Write player result to db
    try:
        logging.info(f'Recorded player_share for puzzle {puzzle_id}')
        with sqlite3.connect(DATABASE_PATH) as db:
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO player_shares (timestamp,puzzle_id) VALUES (?,?)', 
                (timestamp,puzzle_id)
            )
            db.commit()
        return "success", 200
    except:
        logging.error(f'Failed to record share for puzzle {puzzle_id}')
        return {
            'error': 'Failed to record player share'
        }

@app.route('/stats/<puzzle_id>', methods=['GET'])
def get_stats(puzzle_id):
    # Validate request
    try:
        puzzle_id = int(puzzle_id)
    except:
        return {
            'error': 'Invalid puzzle_id'
        }
    # Retrieve stats for requested puzzle
    try:
        with sqlite3.connect(DATABASE_PATH) as db:
            db.row_factory = sqlite3.Row
            cursor = db.cursor()
            cursor.execute('SELECT * FROM statistics WHERE puzzle_id = ?', (puzzle_id,))
            row = cursor.fetchone()
            return jsonify(dict(row))
    except:
        logging.error(f'Failed to get stats for puzzle {puzzle_id}')
        return {
            'error': 'Failed to get puzzle stats'
        }
