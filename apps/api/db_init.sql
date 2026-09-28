-- INITIALIZE DB
CREATE TABLE "player_results" (
	"id"	INTEGER NOT NULL UNIQUE,
	"timestamp"	TEXT NOT NULL,
	"puzzle_id"	INTEGER NOT NULL,
	"result"	TEXT NOT NULL,
	"score"	INTEGER NOT NULL,
	"guesses"	TEXT NOT NULL,
	"board"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "player_shares" (
	"id"	INTEGER NOT NULL UNIQUE,
	"timestamp"	TEXT NOT NULL,
	"puzzle_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE VIEW statistics AS
WITH share_counts AS (
	SELECT
		puzzle_id,
		COUNT(*) AS shares
	FROM player_shares
	GROUP BY puzzle_id
	ORDER BY puzzle_id DESC
)
SELECT
	pr.puzzle_id,
	COUNT(pr.puzzle_id) AS games_total,
	COUNT(CASE WHEN pr.result = 'win' THEN 1 END) AS  games_won,
	COUNT(CASE WHEN pr.result = 'loss' THEN 1 END) AS  games_lost,
	ROUND(AVG(pr.score), 1) AS avg_score,
	COUNT(CASE WHEN pr.score <= 3 THEN 1 END) AS foils,
	COALESCE(SC.shares, 0) AS shares
FROM player_results PR
FULL JOIN share_counts SC ON PR.puzzle_id = SC.puzzle_id 
GROUP BY pr.puzzle_id
ORDER BY pr.puzzle_id DESC
;
