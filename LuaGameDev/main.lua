debug = false -- flip to false before release

-- Collision detection taken function from http://love2d.org/wiki/BoundingBox.lua
-- Returns true if two boxes overlap, false if they don't
-- x1,y1 are the left-top coords of the first box, while w1,h1 are its width and height
-- x2,y2,w2 & h2 are the same, but for the second box
function CheckCollision(x1,y1,w1,h1, x2,y2,w2,h2)
  return x1 < x2+w2 and
         x2 < x1+w1 and
         y1 < y2+h2 and
         y2 < y1+h1
end

-- Image Storage
bulletImg = nil
enemyImg = nil -- Like other images we'll pull this in during out love.load function
bulletSound = nil
explosionImg = nil
explosionSound = nil

-- Entity Storage
fond = { x = 0, y = 0, img = nil }
player = { x = 200, y = 710, speed = 150, img = nil } -- this is just for storage
isAlive = true
score = 0
bullets = {} -- array of current bullets being drawn and updated
enemies = {} -- array of current enemies on screen
explosions = {}

-- Timers
-- Bullets
canShoot = true
canShootTimerMax = 0.2 
canShootTimer = canShootTimerMax
-- Enemy
createEnemyTimerMax = 0.4
createEnemyTimer = createEnemyTimerMax
-- Explosion
explosionTimerMax = 0.4
explosionTimer = explosionTimerMax 


function love.load(arg)
	fond.img = love.graphics.newImage('assets/fond.png')
	bgMusic = love.audio.newSource('assets/bg_music.mp3')
	bgMusic:setVolume(0.6)
	bgMusic:setPitch(0.5)
	bgMusic:play()
	player.img = love.graphics.newImage('assets/plane.png')
	bulletImg = love.graphics.newImage('assets/bullet.png')
	enemyImg = love.graphics.newImage('assets/enemy.png')
	explosionImg = love.graphics.newImage('assets/explosion.png')
	bulletSound = love.audio.newSource('assets/bullet_sound.wav')
	bulletSound:setVolume(0.8)
	bulletSound:setPitch(0.5)
	explosionSound = love.audio.newSource('assets/explosion_sound.wav')
	explosionSound:setVolume(0.9)
	explosionSound:setPitch(0.5)
	-- we now have an asset ready to be used inside Love
end

-- Updating
function love.update(dt)
	-- I always start with an easy way to exit the game
	if love.keyboard.isDown('escape') then
		love.event.push('quit')
	end

	-- Time out how far apart our shots can be.
	canShootTimer = canShootTimer - (1 * dt)
	if canShootTimer < 0 then
		canShoot = true
	end

	if love.keyboard.isDown('left','q') then
		if player.x > 0 then -- binds us to the map
			player.x = player.x - (player.speed*dt)
		end
	elseif love.keyboard.isDown('right','d') then
		if player.x < (love.graphics.getWidth() - player.img:getWidth()) then
			player.x = player.x + (player.speed*dt)
		end
	elseif love.keyboard.isDown('up','z') then
		if player.y > 0 then
			player.y = player.y - (player.speed*dt)
		end
	elseif love.keyboard.isDown('down','s') then
		if player.y < (love.graphics.getHeight() - player.img:getHeight()) then
			player.y = player.y + (player.speed*dt)
		end
	end
	if love.keyboard.isDown('space', 'rctrl', 'lctrl', 'ctrl') and canShoot then
		-- Create some bullets
		newBullet = { x = player.x + (player.img:getWidth()/2), y = player.y, img = bulletImg }
		bulletSound:play()
		bulletSound:rewind()
		table.insert(bullets, newBullet)
		canShoot = false
		canShootTimer = canShootTimerMax
	end
	
	-- update the positions of bullets
	for i, bullet in ipairs(bullets) do
		bullet.y = bullet.y - (250 * dt)

		if bullet.y < 0 then -- remove bullets when they pass off the screen
			table.remove(bullets, i)
		end
	end
	
	-- Time out enemy creation
	createEnemyTimer = createEnemyTimer - (1 * dt)
	if createEnemyTimer < 0 then
		createEnemyTimer = createEnemyTimerMax

		-- Create an enemy
		randomNumber = math.random(10, love.graphics.getWidth() - 10)
		newEnemy = { x = randomNumber, y = -10, img = enemyImg }
		table.insert(enemies, newEnemy)
	end
	
	-- update the positions of enemies
	for i, enemy in ipairs(enemies) do
		enemy.y = enemy.y + (200 * dt)

		if enemy.y > 850 then -- remove enemies when they pass off the screen
			table.remove(enemies, i)
		end
	end
	
	-- run our collision detection
	-- Since there will be fewer enemies on screen than bullets we'll loop them first
	-- Also, we need to see if the enemies hit our player
	for i, enemy in ipairs(enemies) do
		for j, bullet in ipairs(bullets) do
			if CheckCollision(enemy.x, enemy.y, enemy.img:getWidth(), enemy.img:getHeight(), bullet.x, bullet.y, bullet.img:getWidth(), bullet.img:getHeight()) then
				newExplosion = { x = enemy.x, y = enemy.y, img = explosionImg }
				table.remove(bullets, j)
				table.remove(enemies, i)
				table.insert(explosions, newExplosion)
				explosionSound:play()
				explosionSound:rewind()
				score = score + 1
			end
		end

		if CheckCollision(enemy.x, enemy.y, enemy.img:getWidth(), enemy.img:getHeight(), player.x, player.y, player.img:getWidth(), player.img:getHeight()) 
		and isAlive then
			table.remove(enemies, i)
			isAlive = false
		end
	end
	
	-- timer deleting explosionImg
	explosionTimer = explosionTimer - (1 * dt)
	if explosionTimer < 0 then
		explosionTimer = explosionTimerMax
		
		for i, explosion in ipairs(explosions) do
			table.remove(explosions, i)
		end
	end
	
	if not isAlive and love.keyboard.isDown('r') then
		-- remove all bullets and enemies from screen
		bullets = {}
		enemies = {}

		-- reset timers
		canShootTimer = canShootTimerMax
		createEnemyTimer = createEnemyTimerMax

		-- move player back to default position
		player.x = 50
		player.y = 710

		-- reset game state
		score = 0
		isAlive = true
		
		-- music restart
		bgMusic:rewind()
	end

end

function love.draw(dt)
	love.graphics.draw(player.img, player.x, player.y)
	love.graphics.draw(fond.img, 0, 0)
	love.graphics.setColor(255, 255, 255)
	love.graphics.print("Score: " .. tostring(score), 400, 10)
	
	for i, bullet in ipairs(bullets) do
		love.graphics.draw(bullet.img, bullet.x, bullet.y)
	end
	
	for i, enemy in ipairs(enemies) do
		love.graphics.draw(enemy.img, enemy.x, enemy.y)
	end
	
	for i, explosion in ipairs(explosions) do
		love.graphics.draw(explosion.img, explosion.x, explosion.y)
	end
	
	
	-- restart after game over
	if isAlive then
		love.graphics.draw(player.img, player.x, player.y)
	else
		love.graphics.clear( 100, 100, 100, 0 )
		love.graphics.print("Press 'R' to restart", love.graphics:getWidth()/2-50, love.graphics:getHeight()/2-10)
	end
end