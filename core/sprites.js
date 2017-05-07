Quintus.GameSprites = function(Q) {

// =============================================================================
// PLAYER
// =============================================================================

Q.Sprite.extend("Player",
{
    init: function(p) {
        this._super(p, {
            x: 0,
            y: 280,
            sheet: "player",
            sprite: "player",
            direction: "right",
            points: [ [50, 100], [-23, 100], [-23, -108], [50, -108] ],
            speed: 500,
            jumpSpeed: -700,
            type: Q.SPRITE_PLAYER,
            collisionMask: Q.SPRITE_FLOOR | Q.SPRITE_OBSTACLE,
            angle: 0,
            gravity: 1,
            side: "upper"
        });

        // Modules
        this.add("2d, animation, platformerControls");

        // Actions
        Q.input.on("up", this, "jump");                                 // jump
        Q.input.on("turn_up", this, "turnUp");                          // flip up
        Q.input.on("turn_down", this, "turnDown");                      // flip down
        this.on("floor.hit", this, "floorHit");                         // collision with floor
        this.on("obstacle.hit", this, "obstacleHit");                   // collistion with obstacle
    },

    jump: function(dt) {
        if(this.p.landed > 0)
        {
            Q.audio.play("jump.mp3", {debounce: 600});
        }
    },

    turnUp: function() {
        if((this.p.landed > 0) && (this.p.side == "bottom"))
        {
            Q.audio.play("flip.mp3");
            this.p.side = "upper"
            this.p.gravity = 1;
            this.p.y = 380;
            this.p.points = [ [50, 100], [-23, 100], [-23, -108], [50, -108] ];
        }
    },

    turnDown: function() {
        if((this.p.landed > 0) && (this.p.side == "upper"))
        {
            Q.audio.play("flip.mp3");
            this.p.side = "bottom";
            this.p.gravity = -1;
            this.p.y = 630;
            this.p.points = [ [50, -100], [-23, -100], [-23, 108], [50, 108] ];
        }
    },

    floorHit: function(data) {
        this.p.landed = 1;
    },

    obstacleHit: function(data) {
        Q.state.dec("lives", 1);
        if(Q.state.get("lives") > 0)
        {
            this.p.x = (Q("Floor").at(2).p.x - Q("Floor").at(2).p.cx);
        }
    },

    step: function(dt) {
        // Force the run to the right
        Q.inputs["right"] = true;

        // Jump while upside down
        if(this.p.side == "bottom")
        {
            if((this.p.landed > 0) && !this.p.jumping && Q.inputs["up"])
            {
                this.p.vy = -this.p.jumpSpeed;
                this.p.landed = -dt;
                this.p.jumping = true;
            }
            if(this.p.jumping && !(Q.inputs["up"]))
            {
                this.p.jumping = false;
                if(this.p.vy > -this.p.jumpSpeed / 3)
                    this.p.vy = -this.p.jumpSpeed / 3;
            }
        }

        // Animations
        if(this.p.landed > 0)
            this.play("walk_" + this.p.side);                          // walking
        else
            this.play("jump_" + this.p.side);                          // jumping

        // Score
        Q.state.set("score", Math.round(this.p.x/100));
        Q.stageScene("hud", 2);

        // Get BG Color
        this.p.bgcolor = Q.score2color(Q.state.get("score"));           // score to color
        Q.bgcolor(this.p.bgcolor);                                      // set bg color
        this.p.speed = Q.color2speed(this.p.bgcolor);                   // set character speed

        // End of game
        if((this.p.y > Q.height*1.5) || (this.p.y < -Q.height) || (Q.state.get("lives") <= 0))
        {
            this.destroy();                                             // character removal
            Q.stageScene("endGame", 1, { label: "You Lose!" });         // load new scene
        }

        //this.stage.viewport.centerOn(this.p.x + 300, 400 );
    }
});

// =============================================================================
// FLOOR
// =============================================================================

Q.Sprite.extend("Floor",
{
    init: function(p) {
        this._super(p, {
            y: 500,
            w: 390,
            h: 21,
            type: Q.SPRITE_FLOOR
        });

        this.on("hit");
    },

    draw: function(ctx) {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
    },

    step: function(dt) {
        var player = Q("Player").first();
        if(typeof player !== "undefined")
        {
            if(player.p.x > this.p.x + Q.width + 600)
                this.destroy();
        }
    },

    hit: function(col) {
        if(col.obj.isA("Player"))
            col.obj.trigger("floor.hit", {"floor": this, "col": col});
    }
});


// =============================================================================
// LITTLE OBSTACLE
// =============================================================================

Q.Sprite.extend("LittleObstacle",
{
    init: function(p) {
        this._super(p, {
            y: 460,
            type: Q.SPRITE_OBSTACLE,
            asset: "little-obstacle.png",
            points: [ [40, 30], [-40, 30], [-7, -40] ],
            vx: 0,
            vy: 0,
            ay: 0
        });

        this.on("hit");
    },

    step: function(dt) {
        // Change the "y" and "points" when the object is rotated
        if(this.p.flip == "y")
        {
            this.p.y = 540; 
            this.p.points = [ [40, -30], [-40, -30], [-7, 40] ];
        }

        // Remove an object when it is off the screen
        var player = Q("Player").first();
        if(typeof player !== "undefined")
        {
            if(player.p.x > this.p.x + Q.width + 600)
                this.destroy();
        }
    },

    hit: function(col) {
        if(col.obj.isA("Player"))
            col.obj.trigger("obstacle.hit", {"obstacle": this, "col": col});
    }
});

// =============================================================================
// BIG OBSTACLE
// =============================================================================

Q.Sprite.extend("BigObstacle",
{
    init: function(p) {
        this._super(p, {
            y: 372,
            type: Q.SPRITE_OBSTACLE,
            asset: "big-obstacle.png",
            points: [ [80, 120], [-80, 120], [-12, -130] ],
            vx: 0,
            vy: 0,
            ay: 0,
        });

        this.on("hit");
    },

    step: function(dt) {
        // Change the "y" and "points" when the object is rotated
        if(this.p.flip == "y")
        {
            this.p.y = 629; 
            this.p.points = [ [80, -120], [-80, -120], [-12, 130] ];
        }

        // Remove an object when it is off the screen
        var player = Q("Player").first();
        if(typeof player !== "undefined")
        {
            if(player.p.x > this.p.x + Q.width + 600)
                this.destroy();
        }
    },

    hit: function(col) {
        if(col.obj.isA("Player"))
            col.obj.trigger("obstacle.hit", {"obstacle": this, "col": col});
    }
});

// =============================================================================
// OBSTACLE GENERATOR
// =============================================================================

Q.GameObject.extend("ObstacleGenerator",
{
    init: function()
    {
        this.p = {
            launchDelay: 0.45,
            launch: 0,
            obstacles: {
                last: Q("Floor").last(),
                big: 0,
                little: 0,
                bigFlip: 0,
                littleFlip: 0
            }
        }
    },

    update: function(dt)
    {
        this.p.launch -= dt;

        var obstacleArray = [Q.LittleObstacle, Q.BigObstacle, Q.Floor];
        var obstacleRandom = obstacleArray[Math.floor(Math.random() * obstacleArray.length)];
        var flipRandom = Math.floor(Math.random() * 2);                // 0 = false, 1 = true

        if(this.p.launch < 0 && Q("Player").length > 0)
        {
            // Calculate the number of obstacles from the time the floor was generated
            if(this.p.obstacles.last.isA("BigObstacle"))
            {
                if(this.p.obstacles.last.p.flip == "y")
                    this.p.obstacles.bigFlip++;
                else
                    this.p.obstacles.big++; 
            }
            else if(this.p.obstacles.last.isA("LittleObstacle"))
            {
                if(this.p.obstacles.last.p.flip == "y")
                    this.p.obstacles.littleFlip++;
                else
                    this.p.obstacles.little++; 
            }
            else
            {
                // Reset counters after floor generation
                this.p.obstacles.big = 0;
                this.p.obstacles.little = 0;
                this.p.obstacles.bigFlip = 0;
                this.p.obstacles.littleFlip = 0;
            }

            // Assigning to a variable an random obstacle (including the floor)
            var obstacle = new obstacleRandom();

            // Conditions that prevent the game and change the obstacle to the floor
            if((this.p.obstacles.big + this.p.obstacles.bigFlip) > 2
                || (this.p.obstacles.little + this.p.obstacles.littleFlip) > 3
                || (this.p.obstacles.big + this.p.obstacles.bigFlip + this.p.obstacles.little + this.p.obstacles.littleFlip) >= 3
                || (obstacle.className == "BigObstacle" && (flipRandom < 1) && (this.p.obstacles.bigFlip + this.p.obstacles.littleFlip >= 1))
                || (obstacle.className == "BigObstacle" && this.p.obstacles.last.className == "BigObstacle" && this.p.obstacles.last.p.flip == "y"))
            {
                var obstacle = new Q.Floor();
            }
            else
            {
                if(flipRandom > 0)
                {
                    // Conditions that check whether an obstacle can be turned upside down
                    if(!(obstacle.className == "BigObstacle" && (this.p.obstacles.last.className == "BigObstacle"))
                        && !(obstacle.className == "BigObstacle" && (this.p.obstacles.big + this.p.obstacles.little >= 2))
                        && !(obstacle.className == "BigObstacle" && (this.p.obstacles.big + this.p.obstacles.littleFlip >= 2)))
                    {
                        obstacle.p.flip = "y";   
                    }
                }
            }

            // Setting the obstacle position
            obstacle.p.x += this.p.obstacles.last.p.x + this.p.obstacles.last.p.cx + obstacle.p.cx;

            // Adding an obstacle to the scene
            this.p.obstacles.last = this.stage.insert(obstacle);

            // Definition of delayed re-generation
            if(this.p.obstacles.last.className == "LittleObstacle")
                this.p.launch = 0.1;
            else    
                this.p.launch = this.p.launchDelay;
        }
    }
});

};