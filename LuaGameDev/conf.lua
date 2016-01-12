-- Configuration
function love.conf(t)
	t.title = "Lua Game Tutorial" -- The title of the window the game is in (string)
	t.version = "0.10.0"         -- The LÖVE version this game was made for (string)
	t.window.width = 480        -- we want our game to be long and thin.
	t.window.height = 800

	-- For Windows debugging (change to false before releasing the game)
	t.console = false
end