from db import GamesModel
import datetime

class Game:
    def __init__(self, player, puzzle):

        self._record, created = GamesModel.get_or_create(
            player = player,
            puzzle = puzzle
        )

    def save(self, guesses):
        self._record.guesses = guesses
        self._record.updated_at = datetime.datetime.now()
        self._record.save()

    @property
    def id(self):
        return self._record.id

    @property
    def puzzle(self):
        return self._record.puzzle

    @property
    def guesses(self):
        return self._record.guesses

    @property
    def outcome(self):
        guesses = self.guesses.split(',')

        if self.puzzle in guesses:
            return 'win'
        elif len(guesses) >= 6:
            return 'loss'
        else:
            return 'incomplete'

    @property
    def score(self):
        if self.outcome != 'incomplete':
            return len(self.guesses.split(','))
        return False

    @property
    def foil(self):
        if self.outcome == 'win' and self.score <= 3:
            return True
        return False
