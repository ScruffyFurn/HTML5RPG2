/*
Copyright (c) 2014, Mickey "@ScruffyFurn" MacDonald,
                    Will "@WStieh" Stieh
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//Initializes Enchant.js engine
enchant();
//This function is called when the window is loaded
//Think of it as your main function (Java, C++, C etc)
window.onload = function () {

    /*************************************
    Initialize base variables
    **************************************/

    var game = new Game(window.outerWidth, window.outerHeight);
    //First we load up our settings for our sprite sheet
    //Sprite sheets and sprites are two aspects of 2D game developement
    //A sprite sheet is a file that stores the images we will need for our game
    //Instead of having multiple separate image files for each frame of an objects animation, or state
    //We stuff it into one image file, which is the sprite sheet, that we reference throughout the game

    //Sprites are individual pieces of the sprite sheet
    //If you look below, we set the width, height of the sprite sheet and then the width/height of our sprites
    //Using that information we are able to locate a specific image
    //Using our sprites.png image as an example
    //This is what our sprites.png image represents in terms of a sprite sheet
    //We know its size, and we know how large each sprite is so we can 'cut' it up into smaller pieces as seen below
    //[0][1][2][3][4][5][7][8][9][10][11][12][13][14][15][16][17][18]
    //                ^
    //                |
    //              Player
    //If you look at the file you will notice that our player is the 6th image but the 5th sprite (remember we count from 0)
    //When the player is created we tell its sprite that its sprite offset is 5
    //When we go to draw it enchantjs finds our sprite by looking at our sprite sheet and 'cutting' our sprite out
    //It finds it via the sprite offset and simple math, which is the sprite offset x sprite width, which is 5 * 16 = 80
    //Meaning that the players location is at x : 80 pixels
    //Starting at that point, enchant will pull everything from 80 -> 96 (80+16) in x, and everything from 0 -> 16 in y (remember the origin is in the top left corner)

    game.spriteSheetWidth = 304;//Width of the sprite sheet we will be using
    game.spriteSheetHeight = 16;//Height of our sprite sheet
    game.itemSpriteSheetWidth = 64;//The width of the sprite sheet for our items
    game.preload(['sprites.png',
                  'items.png',
                  'titleScreen.png',
                  'deathScreen.png',
                  'hyperspaceadventure.mp3',
                  'ntd4.mp3']);//Preload the image and sound files that we will need so we have them when we need them
    game.items = [{ price: 1000, description: "Hurter", id: 0, effect: function Effect(player) { console.log("You bought a hurter"); } },//An array of items for the player, with their descriptions, price and id for later lookup
             { price: 5000, description: "Drg. Paw", id: 1, effect: function Effect(player) { console.log("You bought claws"); } },
             { price: 5000, description: "Ice Magic", id: 2, effect: function Effect(player) { console.log("You bought ice magic"); } },
             { price: 60, description: "Chess Set", id: 3, effect: function Effect(player) { console.log("You bought a chess set"); } }]

    game.fps = 15;//Setting our frames per second (fps) for the game, 15 frames is fine for a little game like this with simple 2 frame animations. 
    game.spriteWidth = 16;//Width of our sprites we will be pulling from our sprite sheet
    game.spriteHeight = 16;//Height of our sprites we will be pulling from our sprite sheet
    game.scale = 1.0;//How much everything in the game should be scaled, can be used to automatically scale everything up or down based on device, game mechanics etc

    //Initialize the main variables we use, player, shop, battle, menu and the map
    var localPlayer = new Player(game);//Our local player
    var shop = new Shop(game);//An object that holds all of our shop logic, reference shop.js
    var battle = new Battle(game, localPlayer);//An object that holds all of our combat logic, reference battle.js
    var menu = new Menu(game);//An object that represents our title screen, reference menu.js
    var map = new Map(game.spriteWidth, game.spriteHeight);//A map object that we use to display the background of the game world. Things the player won't react with, such as the ground
    var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);//A map object we use to represent the objects the player will interact with (enemies, trees, etc)
    game.foregroundData = foregroundData;//We set the game's foregrounddata to the information stored in our map.js file, called foregroundData. This will populate the foreground map later

    //Setup the stage here so we can reference it everywhere
    var stage = new Group();

    // Initialise the remote players array
    var remotePlayers = [];



    //**************************
    //SOCKET EVENT HANDLERS
    //These will be fleshed out more later, jump to our setSocket function to see how they are used
    //**************************

    // Socket connect to the server
    // This function is called when our websocket successfully connects to the game server
    //MULTIPLAYER COMMENT
    //function onSocketConnected() {
    //    //Display socket connected message in console
    //    console.log("Connected to socket server");

    //    //Tell the server to create a new player
    //    game.socket.emit("new player",
    //                {
    //                    x: localPlayer.getX(),
    //                    y: localPlayer.getY()
    //                });
    //};

    // Socket disconnect from the server
    // This function is called when our websocket disconnects from the game server
    //MULTIPLAYER COMMENT
    //function onSocketDisconnect() {
    //    console.log("Disconnected from socket server");
    //};

    // New Player
    // This function is called when a new player is added to the game
    //MULTIPLAYER COMMENT
    //function onNewPlayer(data) {
    //    //Display new player message in console
    //    console.log("New player connected: " + data.id);

    //    /*Create a new player with placement information
    //    from the server. Then set the id of the new player
    //    and add it to the remote players array*/
    //    var newPlayer = new Player(game);
    //    newPlayer.id = data.id;

    //    //Initialize the new player
    //    newPlayer.setPlayer(false);

    //    //Set the x,y of the player
    //    newPlayer.setX(data.x);
    //    newPlayer.setY(data.y);

    //    //Add him to the stage and the remotePlayers array
    //    stage.addChild(newPlayer.object);
    //    remotePlayers.push(newPlayer);
    //};

    // Player moves
    //This function is used to handle other player's movement
    //MULTIPLAYER COMMENT
    //function onMovePlayer(data) {
    //    //Select the player to move
    //    var movePlayer = playerById(data.id);

    //    //Display console message if the id is not in the array
    //    if (!movePlayer) {
    //        console.log("Player not found: " + data.id);
    //        return;
    //    };

    //    //We set the movePlayer's input
    //    //Remember, movePlayer is an object within the remotePlayer array
    //    //The input value that we are passing is a replacement for listening for key input
    //    movePlayer.setInput(data.input);

    //    //We then set the players x and y
    //    movePlayer.setX(data.x);
    //    movePlayer.setY(data.y);

    //};

    // Remove a Player
    // Called after a disconnect, cleans up the screen so we don't continue to draw players that are no longer there
    //MULTIPLAYER COMMENT
    //function onRemovePlayer(data) {
    //    //Find the selected player to remove
    //    var removePlayer = playerById(data.id);

    //    //Display a console message if the id is not in array
    //    if (!removePlayer) {
    //        console.log("Player not found: " + data.id);
    //        return;
    //    };
    //    //Remove player from stage
    //    stage.removeChild(removePlayer.object);

    //    //Remove the selected player from the remote player array
    //    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);

    //};
    //********************************************************************************

    /**************************************************
    ** Player find helper function
    **************************************************/
    //MULTIPLAYER COMMENT
    //function playerById(id) {
    //    var i;
    //    //Runs through the remote players array and returns the one with the id we passed in
    //    for (i = 0; i < remotePlayers.length; i++) {
    //        if (remotePlayers[i].id == id)
    //            return remotePlayers[i];
    //    };

    //    return false;
    //};


    //Loads the map objects
    var setMaps = function () {

        //First we tell the maps to use the sprites.png image when drawing
        map.image = game.assets['sprites.png'];
        //We load in the data from our map.js file
        //The mapData is represented as a multi-dimensional array where its values are converted to a image on the spriteSheet (sprites.png)
        map.loadData(mapData);
        foregroundMap.image = game.assets['sprites.png'];
        foregroundMap.loadData(game.foregroundData);


        //As previously mentioned, the player only interacts with the foreground data
        //Meaning we use it to get our collision information
        //First we initialize it as an array
        var collisionData = [];
        for (var i = 0; i < game.foregroundData.length; i++) {
            //For each row, we add another array
            collisionData.push([]);
            //Then we fill that row with the data within foreground data
            for (var j = 0; j < game.foregroundData[0].length; j++) {
                //Fun one line if statement
                //If the current data modded by 13 is greater then 1 (not perfectly divisible by 13) then collision is 1 other wise its 0
                var collision = game.foregroundData[i][j] % 13 > 1 ? 1 : 0;
                collisionData[i][j] = collision;
            }
        }
        map.collisionData = collisionData;
    };

    //Simple little helper function that is used to replace a specific type of npc with something else
    game.popFromMap = function (type, replacement) {
        for (var i = 0; i < game.foregroundData.length; i++) {
            for (var j = 0; j < game.foregroundData[0].length; j++) {
                if (game.foregroundData[i][j] == type)
                    game.foregroundData[i][j] = replacement;
            }
        }

        setMaps();
    }

    //Pass in the row, column and the replacement
    //We look into the foregrounddata and swap it out
    game.replaceObjOnMap = function (row, col, replacement) {
        if (row > game.foregroundData.length - 1 || col > game.foregroundData[0].length - 1)
            return;

        game.foregroundData[col][row] = replacement;
        setMaps();
    }

    game.getRow = function (y) {
        return Math.floor(y / game.spriteHeight);
    }

    game.getColumn = function (x) {
        return Math.floor(x / game.spriteWidth);
    }


    //Function sets up the stage
    var setStage = function () {
        stage.addChild(map);//Add the map object to the stage
        stage.addChild(localPlayer.object); //Adds the player object (which is a sprite, check out player.js) to the stage

        //Next we add in the buttons for player input
        game.buttonB = new enchant.ui.Button("B", "light");
        game.buttonB.moveTo(180, 450);
        //Now these we add to the games current scene, which is the scene that we are currently viewing
        game.currentScene.addChild(game.buttonB);

        game.buttonA = new enchant.ui.Button("A", "blue");
        game.buttonA.moveTo(230, 410);
        game.currentScene.addChild(game.buttonA);

        //Set up input for the A button
        game.buttonA.ontouchstart = function () {

            //We get the direction the player is currently facing
            var playerFacing = localPlayer.facing();

            //If we are not facing an npc or other interactive object we just show the players stats
            if (!playerFacing || !spriteRoles[playerFacing]) {
                localPlayer.displayStatus();
                //Now this code is specific, we know that '2' is the ID for the ratQuest giver
            }else if(playerFacing == 2){
                spriteRoles[playerFacing].action(game, new Quest(game, RatQuest, 2));
                //Same idea as the ratQuest giver, this one is for the revenge quest
            } else if (playerFacing == 18) {
                spriteRoles[playerFacing].action(game, new Quest(game, RevengeQuest,18));
            } else {
                //Now if we are just facing a regular ol'npc that we call its action function
                //Now the spriteRoles is an array we declare below that stores the identifier for each npc type, if you look it is the same size as our sprite sheet
                //and each objects position matches its position on the sprite sheet
                //Reference the npc.js
                spriteRoles[playerFacing].action(game);
            };
       };
        
        //Create the gamepad for the player's movement/options etc
       game.pad = new enchant.ui.Pad();
       game.pad.moveTo(0, 380);
       game.currentScene.addChild(game.pad);

        //Finally, we add the foreground map, players statuslabel (used to display messages) to the stage
        //Then add the stage to the game's rootscene
       stage.addChild(foregroundMap);
       stage.addChild(localPlayer.object.statusLabel);
       game.rootScene.addChild(stage);
    };

    //As explained above this is an array to identify different npc types
    //Their position here is identical to their position in the sprite sheet
    var spriteRoles = [, , ratQuestGiver, , cat, , , , , , , , , , , brawler,,,revengeQuestGiver]

    //Focuses the game on the player, important for mobile devices where the screen is shrunk
    game.focusViewport = function () {
        var x = Math.min((game.width - 16) / 2 - localPlayer.getX(), 0);
        var y = Math.min((game.height - 16) / 2 - localPlayer.getY(), 0);

        //Set the games root scene's position
        game.rootScene.x = x;
        game.rootScene.y = y;
        //Update the UI buttons based on that position
        //We absolute the x and y values, then we set each button to that value + its offset
        //To simplify things, our x and y values we just set are our new origin
        x = Math.abs(x);
        y = Math.abs(y);
        game.pad.moveTo(x + 0 ,y + 380);
        game.buttonA.moveTo(x + 230, y + 410);
        game.buttonB.moveTo(x + 180, y + 450);
        
    };


    //Games OnLoad function
    //When the game is loaded we first set the menu (because we see it first)
    //Run its update to call the focusViewport code used above
    game.onload = function () {

        menu.setMenu();
        game.rootScene.on('enterframe', function (e) {
            game.focusViewport();
            //Music update
            if (game.backGroundMusic.currentTime >= game.backGroundMusic.duration)
                game.backGroundMusic.play();
        });
    };

    //Cry 'Havoc!', and let slip the dogs of war!
    //This kick starts the engine and gets the game moving
    game.start();


    //Set up the game
    //Basically it calls everyones initialization
    game.setGame = function () {

        //We initialize, or re-iniitalize everyone if we are doing a reset
        localPlayer = new Player(game);
        shop = new Shop(game);
        battle = new Battle(game, localPlayer);

        //Initialize, or re-init the socket
        //MULTIPLAYER COMMENTgame.setSocket();

        //After all that checking and declaring we finally initialize everyone by calling their set functions
        setMaps();
        //Note, the true variable passed in tells this player that he is our local player
        localPlayer.setPlayer(true);
        setStage();
        shop.setShop();
        battle.setBattle();

        //Stop the title screen background music
        game.titleBackgroundMusic.stop();

        //Here we get our background music track and the begin playing it
        game.backGroundMusic = game.assets['ntd4.mp3'];
        game.backGroundMusic.play();

   
    };

    game.setSocket = function()
    {
        //MULTIPLAYER COMMENT
        // Initialise the socket connection to the server
        //var socket = io.connect('http://html5multiplayerbackupserver.azurewebsites.net:80');
        //game.socket = socket;

        ////*****************************SOCKET EVENTS SETUP
        //// Start listening for events
        //// Socket events
        //game.socket.on("connect", onSocketConnected);
        //game.socket.on("disconnect", onSocketDisconnect);
        //game.socket.on("new player", onNewPlayer);
        //game.socket.on("move player", onMovePlayer);
        //game.socket.on("remove player", onRemovePlayer);
        //***********************************************

    }

    //Getters and Setters
    game.getMap = function () {
        return map;
    };
    
    game.getPlayer = function()
    {
        return localPlayer;
    };

    game.getShop = function()
    {
        return shop;
    }

    game.getBattle = function()
    {
        return battle;
    }

    game.showMenu = function (death) {
        //Null stuff out, forces everyone to just be reinitialized when we call the setGame function
        localPlayer = null;
        shop = null;
        battle = null;
        game.socket = null;
        socket = null;

        //Make sure that the revenge quest is gone
        game.popFromMap(18, 2);
        
        //Stop our background music
        game.backGroundMusic.stop();

        //Here we get our title screens background music track and then begin playing it
        game.titleBackgroundMusic = game.assets['hyperspaceadventure.mp3'];
        game.titleBackgroundMusic.play();

        //Tell the menu to show its menu screen, the death variable means whether its because the player died or not
        //If so, we show a game over screen versus the menu screen
        menu.showMenu(death);
    };

    game.getMenu = function () {
        return menu;
    };

    //Our returns for our game object
    return {
        getPlayer : game.getPlayer,
        getMap: game.getMap,
        getShop: game.shop,
        getBattle: game.getBattle,
        popFromMap: game.popFromMap,
        replaceObjOnMap: game.replaceObjOnMap,
        getRow : game.getRow,
        getColumn: game.getColumn,
        setGame: game.setGame,
        showMenu: game.showMenu,
        getMenu: game.getMenu
    };
};
