import requests
from datetime import datetime
import random

def main():

    # TEST #1 | /player_result
    for i in range(100):
        # Generate fake player result data
        score = random.randint(1,6)
        guesses = ['']*10
        board = '🟥🟥🟥🟥🟨\n🟥🟥🟥🟥🟨\n🟩🟩🟩🟩🟩\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜'
        result = 'win'
        if score >= 6:
            result = 'loss'

        payload = {
            'puzzle_id': random.randint(1,50),
            'timestamp': datetime.now().isoformat(),
            'result': result,
            'score': score,
            'guesses': guesses,
            'board': board
        }

        # Send fake player requests
        requests.post(
            'http://localhost:5001/submit/player_result',
            json=payload
        )

    # TEST #2 | /player_share
    for i in range(100):

        # Send fake player share
        share = random.choice(['yes','no'])
        if share == 'yes':

            r = requests.post(
                url='http://localhost:5001/submit/player_share',
                json= {
                    'puzzle_id': random.randint(1,50),
                    'timestamp': datetime.now().isoformat()
                }
            )

if __name__ == '__main__':
    main()
