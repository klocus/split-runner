/**
* This file is part of Split Runner
* 
* @author       Paweł Klockiewicz <pklockiewicz@edu.cdv.pl>
* @copyright    2017 Paweł Klockiewicz
* @license      MIT
*/

window.addEventListener("load", function() {

// =============================================================================
// SETUP
// =============================================================================

var Q = window.Q = Quintus({audioSupported: [ "mp3" ]})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio")
        .include("GameScenes, GameSprites, GameMethods")
        .setup({ maximize: true })
        .touch()
        .enableSound();

// Klawisze i akcje
Q.input.keyboardControls({
    RIGHT:  "right",
    UP:     "turn_up",
    DOWN:   "turn_down",
    SPACE:  "up",
    Z:      "up",
    X:      "fire"
});


// Kolory tła
Q.COLORS = {
    blue:   { hex: "#09b0e5", score: 0   },
    green:  { hex: "#2ccc72", score: 100 },
    yellow: { hex: "#f7ca17", score: 200 },
    orange: { hex: "#f96a0e", score: 400 },
    red:    { hex: "#ef4836", score: 800 }
};

Q.SPRITE_PLAYER = 1;
Q.SPRITE_COLLECTABLE = 2;
Q.SPRITE_FLOOR = 4;
Q.SPRITE_OBSTACLE = 8;

//Q.gravityY = 2000;
  
// =============================================================================
// LOAD & LUNCH
// =============================================================================

Q.load("player.json, player.png, floor.png, big-obstacle.png, little-obstacle.png, fire.mp3, jump.mp3, heart.mp3, hit.mp3, coin.mp3", function()
{
    Q.compileSheets("player.png","player.json");

    Q.animations("player", {
        walk_upper: { frames: [4, 5, 6, 7], rate: 1/10, flip: false, loop: true },
        walk_bottom: { frames: [4, 5, 6, 7], rate: 1/10, flip: "y", loop: true },
        jump_upper: { frames: [13], rate: 1/10, flip: false },
        jump_bottom: { frames: [13], rate: 1/10, flip: "y" },
        stand: { frames:[14], rate: 1/10, flip: false },
        duck: { frames: [15], rate: 1/10, flip: false },
    });

    Q.stageScene("menu");

    Q.debug = false;
},
{
    progressCallback: function(loaded, total) {
        var progressBar = document.querySelector("#loading .progress");
        progressBar.style.width = Math.floor(loaded / total * 100) + "%";
        
        if(loaded == total)
            document.querySelector("#loading").style.display = "none";
    }
});

});