Quintus.GameScenes = function(Q) {

// =============================================================================
// MAIN MENU
// =============================================================================

Q.scene("menu", function(stage)
{
    var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0, 0, 0, .3)"
    }));

    var button = container.insert(new Q.UI.Button({ 
        x: 0, y: 0, fill: "white", label: "Start Game", font: "400 24px Lato"
    }));

    var label = container.insert(new Q.UI.Text({
        x: 0, y: -10 - button.p.h, label: "Split Runner", family: "Lato", color: "white"
    }));

    // Load game level on click
    button.on("click", function() {
        Q.clearStages();
        Q.stageScene("level");
    });

    // Load game level on key down
    Q.input.on("up", function() {
        if(!Q.state.get("lives"))
            button.trigger("click");
    });

    container.fit(20);
});

// =============================================================================
// MAIN LEVEL
// =============================================================================

Q.scene("level", function(stage)
{
    // Kolor tła
    Q.bgcolor("green");

    // Początkowa wartość statystyk
    Q.state.reset({ score: 0, lives: 3 });

    // Wyświetlenie sceny ze statystykami
    Q.stageScene("hud", 2);

    // Wygenerowanie podłogi na rozbieg
    for (var i = 0; i < 5; i++)
    { 
        stage.insert(new Q.Floor({x: -660 + 390*i}));
    }

    // Przeszkody
    stage.insert(new Q.ObstacleGenerator());

    // Gracz
    var player = stage.insert(new Q.Player());
    var test = stage.add("viewport").follow(player);
    stage.viewport.offsetY = 100;
});

// =============================================================================
// HEAD-UP DISPLAY
// =============================================================================

Q.scene("hud", function(stage)
{
    var i, hearts = "";
    var container = stage.insert(new Q.UI.Container({
        x: 50, y: 0
    }));

    var score = container.insert(new Q.UI.Text({
        x: 50, y: 50, label: "SCORE: " + Q.state.get("score"), color: "white", family: "Lato"
    }));

    for(i = 0; i < Q.state.get("lives"); i++)
    {
        hearts += "♥ ";
    }

    var lives = container.insert(new Q.UI.Text({
        x: 50, y: 80, label: hearts, color: "white", size: 44, family: "Lato"
    }));

    // Dopasowanie zawartości do rozmiaru kontenera + 20 jednostek marginesu
    container.fit(20);
});

// =============================================================================
// END OF GAME
// =============================================================================

Q.scene("endGame", function(stage)
{
    var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0, 0, 0, .3)"
    }));

    var button = container.insert(new Q.UI.Button({ 
        x: 0, y: 0, fill: "white", label: "Play Again", font: "400 24px Lato"
    }));

    var label = container.insert(new Q.UI.Text({
        x: 0, y: -10 - button.p.h, label: stage.options.label, family: "Lato", color: "white"
    }));

    // Load game level on click
    button.on("click", function() {
        Q.clearStages();
        Q.stageScene("level");
    });

    // Load game level on key down
    Q.input.on("up", function() {
        if(!Q.state.get("lives"))
            button.trigger("click");
    });

    // Dopasowanie zawartości do rozmiaru kontenera + 20 jednostek marginesu
    container.fit(20);
});

};