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
    session_token = CharField(unique=True)
    session_expiration = DateTimeField()
    created_at = DateTimeField(default=datetime.datetime.now())
    updated_at = DateTimeField(default=datetime.datetime.now())

class ShareModel(Base):
    class Meta:
        db_table = 'shares'
    player = ForeignKeyField(PlayerModel)
    puzzle = CharField()
    created_at = DateTimeField(default=datetime.datetime.now())

class GamesModel(Base):
    class Meta:
        db_table = 'games'
    player = ForeignKeyField(PlayerModel)
    puzzle = CharField()
    guesses = CharField(default='')
    updated_at = DateTimeField(default=datetime.datetime.now())
