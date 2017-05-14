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
        x: Q.width/2, y: Q.height/2 + 110, fill: "rgba(0, 0, 0, 0)"
    }));

    // Insert start button
    var startButton = container.insert(new Q.UI.Button({ 
        x: 0, y: 0, fill: "white", label: "Start Game", font: "400 24px Lato"
    }));

    // Insert music button
    if(Q.state.get("music") === undefined) Q.state.set("music", true);
    var musicButton = container.insert(new Q.UI.Button({ 
        x: 0, y: 15 + startButton.p.h, w: startButton.p.w, fill: "white", label: "Music: " + (Q.state.get("music")?"ON":"OFF"), font: "400 24px Lato"
    }));

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

    // Default values of state
    Q.state.reset({ score: 0, record: record, lives: 3, music: Q.state.get("music") });

    // Music
    if(Q.state.get("music"))
        Q.audio.play("loop.mp3", { loop: true, volume: 0.4 });

    // Display HUD
    Q.stageScene("hud", 2);

    // Generate floor to run
    for (var i = 0; i < 5; i++)
    { 
        var floor = new Q.Floor();
        floor.p.x = -660 + floor.p.w * i;
        stage.insert(floor);
    }

    // Display info about keys
    var keysInfo = stage.insert(new Q.UI.Text({
        x: 990, y: 390, label: "Use [⇧]  /  [⇩] to FLIP  and  [____] to JUMP.", color: "white", family: "Lato"
    }));

    // Generate obstacles
    stage.insert(new Q.ObstacleGenerator());

    // Player
    var player = stage.insert(new Q.Player());
    
    // Follow the player
    stage.add("viewport").follow(player);
    stage.viewport.offsetY = 100;
    stage.viewport.offsetX = -300;
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

    // Insert text with score value
    var score = leftContainer.insert(new Q.UI.Text({
        x: 50, y: 50, label: "SCORE: " + Q.state.get("score"), color: "white", family: "Lato"
    }));

    // Generate hearts
    for(i = 0; i < Q.state.get("lives"); i++)
    {
        hearts += "♥ ";
    }

    // Insert hearts
    var lives = leftContainer.insert(new Q.UI.Text({
        x: 50, y: 80, label: hearts, color: "white", size: 44, family: "Lato"
    }));

    // Match content to container size + 20 margin units
    leftContainer.fit(20);

    // Insert container at the top-right
    var rightContainer = stage.insert(new Q.UI.Container({
        x: Q.width - 170, y: 0
    }));

    // Insert best score
    if(typeof(Storage) !== "undefined") {
        var bestScore = rightContainer.insert(new Q.UI.Text({
            x: 50, y: 50, label: "RECORD: " + Q.state.get("record"), color: "white", family: "Lato"
        }));
    }

    rightContainer.fit(20);
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

    var restartButton = container.insert(new Q.UI.Button({ 
        x: 0, y: 0, fill: "white", label: "Play Again", font: "400 24px Lato"
    }));

    var menuButton = container.insert(new Q.UI.Button({ 
        x: 0, y: 10 + restartButton.p.h, w: restartButton.p.w, fill: "white", label: "Main Menu", font: "400 22px Lato"
    }));

    var label = container.insert(new Q.UI.Text({
        x: 0, y: -10 - restartButton.p.h, label: stage.options.label, family: "Lato", color: "white"
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