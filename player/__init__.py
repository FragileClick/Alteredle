from db import PlayerModel, GamesModel
from game import Game
from statistics import mean

class Player:
    def __init__(self, username=None, session_token=None, session_expiration=None):

        if session_token and self.session_exists(session_token):
            # Look-up player by session.
            self._record = PlayerModel.get(session_token=session_token)
        elif username and self.username_exists(username):
            # Look-up player by username.
            self._record = PlayerModel.get(username=username)
        else:
            # If they don't exist, create a new player.
            self._record, created = PlayerModel.get_or_create(
                username=username,
                session_token=session_token,
                session_expiration=session_expiration
            )

    @staticmethod
    def session_exists(session_token):
        '''
        Check if player with this session_token exists.
        '''
        if PlayerModel.get_or_none(session_token=session_token):
            return True
        return False

    @property
    def id(self):
        return self._record.id

    @property
    def name(self):
        return self._record.username

    @property
    def created_at(self):
        return self._record.created_at

    @property
    def games(self):
        query = GamesModel.select().where(GamesModel.player_id==self.id).dicts()
        output = []
        for game in query:
            output.append(
                Game(
                    player=self._record,
                    puzzle=game['puzzle']
                )
            )
        return output

    @property
    def avg_score(self):
        scores = []
        for game in self.games:
            if game.score:
                scores.append(game.score)
        return round(mean(scores), 1)

    @property
    def games_completed(self):
        completed_games = 0
        for game in self.games:
            if game.outcome != 'incomplete':
                completed_games += 1
        return completed_games

    @property
    def foils(self):
        foils = 0
        for game in self.games:
            if game.outcome == 'win' and game.score <= 3:
                foils += 1
        return foils
