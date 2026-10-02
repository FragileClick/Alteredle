import datetime
from peewee import *

db = SqliteDatabase('db.sqlite')
db.connect()

class Base(Model):
    class Meta:
        database = db

class PlayerModel(Base):
    class Meta:
        db_table = 'players'
    username = CharField(unique=True)
    created_at = DateTimeField(default=datetime.datetime.now())
    session_token = CharField(unique=True)
    session_expiration = DateTimeField()

class CardModel(Base):
    class Meta:
        db_table = 'cards'
    collector_number = CharField(unique=True)
    name_en = CharField()
    name_fr = CharField()
    set = IntegerField()
    faction = IntegerField()
    type_en = CharField()
    type_fr = CharField()
    subtype_en = CharField()
    subtype_fr = CharField()
    cost_hand = IntegerField()
    cost_reserve = IntegerField()
    artwork = CharField()

class PuzzleModel(Base):
    class Meta:
        db_table = 'puzzles'
    card = ForeignKeyField(CardModel)

class GuessModel(Base):
    class Meta:
        db_table = 'guesses'
    player = ForeignKeyField(PlayerModel)
    puzzle = ForeignKeyField(PuzzleModel)
    card = ForeignKeyField(CardModel)
    created_at = DateTimeField(default=datetime.datetime.now())

class ShareModel(Base):
    class Meta:
        db_table = 'shares'
    player = ForeignKeyField(PlayerModel)
    puzzle = ForeignKeyField(PuzzleModel)
    card = ForeignKeyField(CardModel)
    created_at = DateTimeField(default=datetime.datetime.now())

class GamesModel(Base):
    class Meta:
        db_table = 'games'
    player = ForeignKeyField(PlayerModel)
    puzzle = ForeignKeyField(PuzzleModel)
    card = ForeignKeyField(CardModel)
    result = CharField()
    score = IntegerField()
    guesses = CharField()
    completed_at = DateTimeField(default=datetime.datetime.now())

class StatsModel(Base):
    class Meta:
        db_table = 'stats'
    puzzle = ForeignKeyField(PuzzleModel)
    card = ForeignKeyField(CardModel)
    games_total = IntegerField()
    games_won = IntegerField()
    games_lost = IntegerField()
    avg_score = FloatField()
    foils = IntegerField()
    shares = IntegerField()
