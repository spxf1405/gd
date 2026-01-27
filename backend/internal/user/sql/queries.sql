-- name: GetPlayer :one
SELECT * FROM player
WHERE id = $1 LIMIT 1;

-- name: GetPlayerByPID :one
SELECT * FROM player
WHERE pid = $1 LIMIT 1;

-- name: ListPlayers :many
SELECT * FROM player
ORDER BY created_at DESC;

-- name: CreatePlayer :one
INSERT INTO player (
    name, country, phone, pid, created_at
) VALUES (
    $1, $2, $3, $4, NOW()
)
RETURNING *;
