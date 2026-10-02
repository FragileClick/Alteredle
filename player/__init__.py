from db import PlayerModel

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
    def name(self):
        return self._record.username

    @property
    def created_at(self):
        return self._record.created_at
