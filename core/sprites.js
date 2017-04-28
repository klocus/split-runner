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

        // Moduły
        this.add("2d, animation, platformerControls");

        // Akcje
        Q.input.on("right", this, "countScore");
        Q.input.on("up", this, "jump");                                 // skok
        Q.input.on("turn_up", this, "turnUp");                          // zmiana pozycji na górę
        Q.input.on("turn_down", this, "turnDown");                      // zmiana pozycji na dół
        this.on("floor.hit", this, "floorHit");                         // kontakt z podłożem
        this.on("obstacle.hit", this, "obstacleHit");                   // kontakt z przeszkodą
    },

    countScore: function() {
        
    },

    jump: function(dt) {
        if(this.p.landed > 0)
        {
            Q.audio.play("jump.mp3");
        }
    },

    turnUp: function() {
        if((this.p.landed > 0) && (this.p.side == "bottom"))
        {
            this.p.side = "upper"
            this.p.gravity = 1;
            this.p.y = 380;
        }
    },

    turnDown: function() {
        if((this.p.landed > 0) && (this.p.side == "upper"))
        {
            this.p.side = "bottom";
            this.p.gravity = -1;
            this.p.y = 630;
        }
    },

    floorHit: function(data) {
        this.p.landed = 1;
    },

    obstacleHit: function(data) {
        if(Q.state.get("lives") > 0)
        {
            Q.state.dec("lives", 1);
            this.p.x -= 200;
        }
    },

    step: function(dt) {
        // Wymuszenie biegu w prawo
        Q.inputs["right"] = true;

        // Skok podczas dolnej pozycji
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

        // Animacje
        if(this.p.landed > 0)
            this.play("walk_" + this.p.side);                          // animacja chodzenia
        else
            this.play("jump_" + this.p.side);                          // animacja skoku

        // Wynik
        Q.state.set("score", Math.round(this.p.x/100));
        Q.stageScene("hud", 2);
        Q.bgcolor(Q.score2color(Q.state.get("score")));

        // Zakończenie gry
        if((this.p.y > Q.height*1.5) || (this.p.y < -Q.height) || !Q.state.get("lives"))
        {
            this.destroy();                                             // usunięcie postaci
            Q.stageScene("endGame", 1, { label: "You Lose!" });         // załadownie nowej sceny
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
            type: Q.SPRITE_FLOOR,
            asset: "floor.png",
            vx: 0,
            vy: 0,
            ay: 0
        });

        this.on("hit");
    },

    step: function(dt) {
        var player = Q("Player").first();
        if(typeof player !== "undefined")
        {
            if(player.p.x > this.p.x + Q.width + 200)
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
        // Zmiana wartości "y", gdy obiekt jest obrócony
        if(this.p.flip == "y")
            this.p.y = 540; 

        // Usunięcie obiektu, gdy jest poza ekranem
        var player = Q("Player").first();
        if(typeof player !== "undefined")
        {
            if(player.p.x > this.p.x + Q.width + 200)
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
        // Zmiana wartości "y", gdy obiekt jest obrócony
        if(this.p.flip == "y")
            this.p.y = 629; 

        // Usunięcie obiektu, gdy jest poza ekranem
        var player = Q("Player").first();
        if(typeof player !== "undefined")
        {
            if(player.p.x > this.p.x + Q.width + 200)
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
            launchRandom: 1,
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
            // Policzenie przeszkód od czasu wygenerowania podłogi
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
                // Reset liczników po wygenerowaniu podłogi
                this.p.obstacles.big = 0;
                this.p.obstacles.little = 0;
                this.p.obstacles.bigFlip = 0;
                this.p.obstacles.littleFlip = 0;
            }

            // Przypisanie do zmiennej losową przeszkodę (w tym podłogę)
            var obstacle = new obstacleRandom();

            // Warunki, które uniemożliwiają grę i zmieniają przeszkodę na podłogę
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
                    // Warunki, które sprawdzają czy przeszkoda może zostać obrócona do góry nogami
                    if(!(obstacle.className == "BigObstacle" && (this.p.obstacles.last.className == "BigObstacle"))
                        && !(obstacle.className == "BigObstacle" && (this.p.obstacles.big + this.p.obstacles.little >= 2))
                        && !(obstacle.className == "BigObstacle" && (this.p.obstacles.big + this.p.obstacles.littleFlip >= 2)))
                    {
                        obstacle.p.flip = "y";   
                    }
                }
            }

            // Ustawienie pozycji przeszkody
            obstacle.p.x += this.p.obstacles.last.p.x + this.p.obstacles.last.p.cx + obstacle.p.cx;

            // Dodanie przeszkody na scenę
            this.p.obstacles.last = this.stage.insert(obstacle);

            // Definicja opóźnienia ponownego generowania
            this.p.launch = this.p.launchDelay;
        }
    }
});

};