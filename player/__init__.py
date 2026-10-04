from db import PlayerModel, GamesModel, ShareModel
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
            # Update player session_token + session_expiration if provided
            if session_token and session_expiration:
                self._record.session_token = session_token
                self._record.session_expiration = session_expiration
                self._record.save()
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

    @staticmethod
    def username_exists(username):
        '''
        Check if player with this username exists.
        '''
        if PlayerModel.get_or_none(username=username):
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
        query = GamesModel.select().where(GamesModel.player_id==self.id).order_by(GamesModel.updated_at.desc()).dicts()
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
        if scores:
            return round(mean(scores), 1)
        return '-'

    @property
    def games_completed(self):
        completed_games = []
        for game in self.games:
            if game.outcome != 'incomplete':
                completed_games.append(game)
        return completed_games

    @property
    def games_solved(self):
        completed_games = []
        for game in self.games_completed:
            if game.outcome == 'win':
                completed_games.append(game)
        return completed_games

    @property
    def foils(self):
        foils = 0
        for game in self.games:
            if game.foil:
                foils += 1
        return foils

    @property
    def shares(self):
        return ShareModel.select().where(ShareModel.player_id==self.id).count()
