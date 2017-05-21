Quintus.GameScenes = function(Q) {

// =============================================================================
// MAIN MENU
// =============================================================================

Q.scene("menu", function(stage)
{
    // Background color
    Q.bgcolor("blue");

    // Insert container
    var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2 + 60, fill: "rgba(0, 0, 0, 0)"
    }));

    if(Q.MOBILE)
    {
        // Insert start button
        var startButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 0, w: 460, h: 120, radius: 0, fill: "white", label: "Start Game", font: "400 80px Lato"
        }));

        // Insert music button
        if(Q.state.get("music") === undefined) Q.state.set("music", false);
        var musicButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 25 + startButton.p.h, w: 460, h: 120, radius: 0, fill: "white", label: "Music: " + (Q.state.get("music")?"ON":"OFF"), font: "400 80px Lato"
        }));
    }
    else
    {
        // Insert start button
        var startButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 0, radius: 0, fill: "white", label: "Start Game", font: "400 24px Lato"
        }));

        // Insert music button
        if(Q.state.get("music") === undefined) Q.state.set("music", true);
        var musicButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 15 + startButton.p.h, w: startButton.p.w, radius: 0, fill: "white", label: "Music: " + (Q.state.get("music")?"ON":"OFF"), font: "400 24px Lato"
        }));
    }

    // Insert logo
    var logo = container.insert(new Q.UI.Button({ 
        x: 0, y: -110 - startButton.p.h, asset: "logo.png"
    }));

    // Load game level on click
    startButton.on("touch", function() {
        Q.clearStages();
        Q.stageScene("level");
    });

    // Load game level on key down
    Q.input.on("up", function() {
        if(Q.stage().scene.name == "menu")
            startButton.trigger("touch");
    });

    // Change music option
    musicButton.on("touch", function() {
        if(musicButton.p.label.includes("ON"))
        {
            Q.state.set("music", false);
            musicButton.p.label = "Music: OFF";
        }
        else
        {
            Q.state.set("music", true);
            musicButton.p.label = "Music: ON";
        }
    });

    container.fit(0);
});

// =============================================================================
// MAIN LEVEL
// =============================================================================

Q.scene("level", function(stage)
{
    // Get best score
    var record = localStorage.getItem("record") ? localStorage.getItem("record") : 0;
    Q.state.set('newRecord', false);

    // Default values of state
    Q.state.reset({ score: 0, record: record, lives: 3, music: Q.state.get("music") });

    // Music
    if(Q.state.get("music"))
        Q.audio.play("loop.mp3", { loop: true, volume: 0.4 });

    // Display HUD
    Q.stageScene("hud", 3);

    // Generate floor to run
    for (var i = 0; i < 5; i++)
    { 
        var floor = new Q.Floor();
        floor.p.x = -660 + floor.p.w * i;
        stage.insert(floor);
    }

    // Display info about keys
    if(!Q.MOBILE)
    {
        var keysInfo = stage.insert(new Q.UI.Text({
            x: 900, y: 390, label: "Use [⇧]  /  [⇩] to FLIP  and  [____] to JUMP.", color: "white", family: "Lato", size: 44
        }));
    }

    // Generate obstacles
    stage.insert(new Q.ObstacleGenerator());

    // Player
    var player = stage.insert(new Q.Player());
    
    // Follow the player
    stage.add("viewport").follow(player);
    stage.viewport.offsetY = 100;
    stage.viewport.offsetX = -Q.width/3;
});

// =============================================================================
// HEAD-UP DISPLAY
// =============================================================================

Q.scene("hud", function(stage)
{
    var i, hearts = "";
    var leftContainer = stage.insert(new Q.UI.Container({
        x: 50, y: 0
    }));

    // Generate hearts
    for(i = 0; i < Q.state.get("lives"); i++)
    {
        hearts += "♥ ";
    }

    // Insert hearts
    if(Q.MOBILE)
    {
        var lives = leftContainer.insert(new Q.UI.Text({
            x: 160, y: 60, label: hearts, color: "white", size: 120, family: "Lato"
        }));
    }
    else
    {
        var lives = leftContainer.insert(new Q.UI.Text({
            x: 50, y: 50, label: hearts, color: "white", size: 44, family: "Lato"
        }));
    }

    // Match content to container size + 20 margin units
    leftContainer.fit(20);

    // Insert container at the top-right
    var rightContainer = stage.insert(new Q.UI.Container({
        x: Q.width - 170, y: 0
    }));

    // Insert text with score value
    if(Q.MOBILE)
    {
        var score = rightContainer.insert(new Q.UI.Text({
            x: -90, y: 60, label: "SCORE: " + Q.zeroPad(Q.state.get("score"), 4), color: "white", family: "Lato", size: 60
        }));
    }
    else
    {
        var score = rightContainer.insert(new Q.UI.Text({
            x: 50, y: 50, label: "SCORE: " + Q.zeroPad(Q.state.get("score"), 4), color: "white", family: "Lato"
        }));   
    }

    // Insert best score
    if(Q.MOBILE)
    {
        if(typeof(Storage) !== "undefined") {
            var bestScore = rightContainer.insert(new Q.UI.Text({
                x: -90, y: 120, label: "RECORD: " + Q.zeroPad(Q.state.get("record"), 4), color: "white", family: "Lato", size: 52, weight: 400
            }));
        }
    }
    else 
    {
        if(typeof(Storage) !== "undefined") {
            var bestScore = rightContainer.insert(new Q.UI.Text({
                x: 50, y: 80, label: "RECORD: " + Q.zeroPad(Q.state.get("record"), 4), color: "white", family: "Lato", size: 21, weight: 400
            }));
        }
    }

    // Match content to container size + 20 margin units
    rightContainer.fit(20);

    // Container on the center of the screen
    var middleContainer = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0, 0, 0, .3)", hidden: true
    }));

    // Information about new record
    var newRecord = middleContainer.insert(new Q.UI.Text({
        x: 50, y: 50, label: "NEW RECORD!", color: "white", family: "Lato", size: 66
    }));

    // Hide info about new record after 2 sec
    if((Q.state.get("score") > Q.state.get("record")) && (Q.state.get("record") > 0) && !Q.state.get('newRecord'))
    {
        middleContainer.p.hidden = false;
        setTimeout(function() {
            middleContainer.p.hidden = true;
            Q.state.set('newRecord', true);
        }, 2000);
    }

    middleContainer.fit(20);
});

// =============================================================================
// COUNTER
// =============================================================================

Q.scene("counter", function(stage)
{
    var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0, 0, 0, .3)"
    }));

    var counter = container.insert(new Q.UI.Text({
        x: 50, y: 50, label: "             ", color: "white", family: "Lato", size: 66
    }));

    container.fit(20);

    var count = 3;
    counter.p.label = count.toString();
    var interval = setInterval(function() {
        count -= 1;
        if(count < -1)
        {
            clearInterval(interval);
            return;
        }

        if(count > 0)
        {
            counter.p.label = count.toString();
        }
        else if(count == 0)
        {
            counter.p.label = "RUN!";
            Q.stage().unpause();
        }
        else
        {
            container.destroy();
        }
    }, 500);
});

// =============================================================================
// END OF GAME
// =============================================================================

Q.scene("endGame", function(stage)
{
    Q.audio.stop();

    var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0, 0, 0, .3)"
    }));

    if(Q.MOBILE)
    {
        var restartButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 0, w: 460, h: 120, radius: 0, fill: "white", label: "Play Again", font: "400 80px Lato"
        }));

        var menuButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 25 + restartButton.p.h, w: 460, h: 120, radius: 0, fill: "white", label: "Main Menu", font: "400 76px Lato"
        }));
    }
    else
    {   
        var restartButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 0, radius: 0, fill: "white", label: "Play Again", font: "400 24px Lato"
        }));

        var menuButton = container.insert(new Q.UI.Button({ 
            x: 0, y: 10 + restartButton.p.h, w: restartButton.p.w, radius: 0, fill: "white", label: "Main Menu", font: "400 24px Lato"
        }));  
    }

    var label = container.insert(new Q.UI.Text({
        x: 0, y: -10 - restartButton.p.h, label: stage.options.label, size: Q.MOBILE?80:24, family: "Lato", color: "white"
    }));

    // Reload game level on click
    restartButton.on("touch", function() {
        Q.clearStages();
        Q.stageScene("level");
    });

    // Reload game level on key down
    Q.input.on("up", function() {
        if(!Q.state.get("lives"))
            restartButton.trigger("touch");
    });

    // Load game menu on click
    menuButton.on("touch", function() {
        Q.clearStages();
        Q.stageScene("menu");
    });

    // Match content to container size + 20 margin units
    container.fit(20);
});

};