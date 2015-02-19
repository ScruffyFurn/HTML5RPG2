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
var Player = function (game) {

    //This is the players unique id for the multiplayer
    var id;

    var INPUT_TYPES = { NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 }
    var input = 0;//This input here is for multiplayer, we send the players input along with its position to all other players, that way on their machine
                  //all of the non-local players animate correctly


    var player = new Sprite(game.spriteWidth, game.spriteHeight);//First we set up the player object as a sprite
                                                                //A sprite is an aspect of 2D game developement, it represents a piece of a sprite sheet
                                                                //It contains properties such as position, scale, frame (current frame of animation to draw), spriteOffset (position on sprite sheet)               

    //Check out the explanation for sprites and sprite sheets within game.js

    //The isLocal argument is used to determine if this is a local player or an online one
    var setPlayer = function (isLocal) {
        player.spriteOffset = 5;//Sprites offset on the sprite sheet, value of 5 means it is the 6th image on the sprite sheet (remember with computers we start at 0 not 1)
        player.startingX = 6;//Starting X for the player
        player.startingY = 14;//Starting Y for the player
        player.x = player.startingX * game.spriteWidth;//Players x position in the world, we multiply it by the spriteWidth so it is perfectly aligned in the world
        player.y = player.startingY * game.spriteHeight;//Players y position in the world, likewise we multiply it by the spriteHeight so it perfectly lines up with the other sprites
        player.direction = 0;//Current direction
        player.walk = 0;//Current walk, used for animating. We have 2 frames of animation so its either 0 or 1
        player.frame = player.spriteOffset + player.direction; //We set the players actual frame to be drawn, looking at the sprite sheet 'sprites.png' you will see that if direction was set to 2, we would get 5+2 = 7 meaning we would see the frame that shows the player walking away from us
        player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);//We set the players image as a Surface, think of a surface as a picture that you will be drawing on
        player.image.draw(game.assets['sprites.png']);//...drawing on with the 'sprites.png'

        //RPG Elemetns
        player.name = "Steve";//Give him a name
        player.characterClass = "Knight";//Give him a class
        player.exp = 0;//Give him experience points
        player.level = 1;//Give him a level
        player.gp = 100;//Give him some gold

        //Set up level stats, when we need your attack or max health we will reference this array and pass in your level which will give us the correct info
        player.levelStats = [{}, { attack: 4, maxHp: 10, maxMp: 0, expMax: 10 },//Level 1
                             { attack: 6, maxHp: 14, maxMp: 0, expMax: 30 }, //Level 2
                             { attack: 7, maxHp: 20, maxMp: 5, expMax: 50 } //Level 3 with MAGIC!!
        ];

        //Our attack value, just returns the attack value of our current level
        player.attack = function () {
            return player.levelStats[player.level].attack;
        };
        //We set our hp and mp to our current level's amounts
        player.hp = player.levelStats[player.level].maxHp;
        player.mp = player.levelStats[player.level].maxMp;

        //We setup the on enter frame event here for the player
        //We use this to call the players update
        //We pass whether he is local or not in as well, which in turn was passed in to us
        player.on('enterframe', function () {
            update(isLocal);
        });

        //Finally we set up our statusLabel, but we don't add it to anything...yet
        //Later we will use this to show messages and the like
        player.statusLabel = new Label("");
        player.statusLabel.width = game.width;
        player.statusLabel.y = undefined;
        player.statusLabel.x = undefined;
        player.statusLabel.color = '#fff';
        player.statusLabel.backgroundColor = '#000';
    };

    //Displays the players status...using the statusLabel
    var displayStatus = function () {
        player.statusLabel.text =
          "--" + player.name + " the " + player.characterClass +
          "<br />--HP: " + player.hp + "/" + player.levelStats[player.level].maxHp +
          "<br />--MP: " + player.mp + "/" + player.levelStats[player.level].maxMp +
          "<br />--Exp: " + player.exp +
          "<br />--Level: " + player.level +
          "<br />--GP: " + player.gp +
          "<br /><br />--Inventory:";
        player.statusLabel.height = 170;
        showInventory(0);
    };

    //Clears the statusLabel
    var clearStatus = function () {
        player.statusLabel.text = "";
        player.statusLabel.height = 0;
        hideInventory();
    };

    var move = function () {
        //Set the players current frame
        //Example, moving up the screen, 5 + 1 * 2 + 1 which gives us 8!
        //Now looking at our sprite sheet that is the second walking up animation frame
        player.frame = player.spriteOffset + player.direction * 2 + player.walk;

        if (player.isMoving) {
            //If we are moving, lets move the player
            player.moveBy(player.xMovement, player.yMovement);
            //Then we update its animation
            //What we are doing here is using the modulus operator (%) which returns the remainder from division
            //For example, 5 % 2 gives you 1 because 2 *2 = 4, and then it doesn't go into the remaining 1, which is returned
            //We mod the game.frame (number of frames since we hit start) by 2 because our animations are 2 frames long
            //So if we mod game.frame by 2 and it is not 0
            //We increase the walk and then mod that by 2 so its always either 0 or 1
            if (!(game.frame % 2)) {
                player.walk++;
                player.walk %= 2;
            }
            //Now if we are moving along and our character is perfectly aligned with something divisible by 16
            //We stop moving, and we set our walk to 1 (second from of animation)
            //There to kinda smooth things out
            if ((player.xMovement && player.x % 16 === 0) || (player.yMovement && player.y % 16 === 0)) {
                player.isMoving = false;
                player.walk = 1;
            }
        } else {
            //If we are not moving, we set our x and y movement to 0
            player.xMovement = 0;
            player.yMovement = 0;
            //Check for input
            //For local stuff we just care about game.input.whatever
            //Once we get/or don't get that input, depending on if there is any
            //We also set the input variable, this tells the server what button we pressed
            //That way we can properly be updated on each client
            if (game.input.up) {
                input = INPUT_TYPES.UP;
                player.direction = 1;
                player.yMovement = -4;
                clearStatus();
            } else if (game.input.right) {
                input = INPUT_TYPES.RIGHT;
                player.direction = 2;
                player.xMovement = 4;
                clearStatus();
            } else if (game.input.left) {
                input = INPUT_TYPES.LEFT;
                player.direction = 3;
                player.xMovement = -4;
                clearStatus();
            } else if (game.input.down) {
                input = INPUT_TYPES.DOWN;
                player.direction = 0;
                player.yMovement = 4;
                clearStatus();
            }
            else {
                input = INPUT_TYPES.NONE;
                player.isMoving = false;
                //Tell the server we are not moving, send in our input and our x/y position
                //game.socket.emit("move player", { id: id, input: input, x: player.x, y: player.y });
            }
            if (player.xMovement || player.yMovement) {
                //Below code makes use of a one line if statement
                //If the players.xMovement is not 0 then we set it to player.xMovemnt/Mathf.abs(player.xMovement * 16 else we make it 0
                //When you abs (absolute) something you get the number of places it is from 0, which in lay mans means the positive version of that number
                //Lets say our xMovement is -4 (so we are moving left) then we get -4 / Math.abs(-4) * 16 -> -4/4 which gives us -1 * 16 = -16
                //So we move -16 to the left
                //This little line of code ensures we are always moving 16 pixels in whatever direction
                var x = player.x + (player.xMovement ? player.xMovement / Math.abs(player.xMovement) * 16 : 0);
                var y = player.y + (player.yMovement ? player.yMovement / Math.abs(player.yMovement) * 16 : 0);
                if (0 <= x && x < game.getMap().width && 0 <= y && y < game.getMap().height && !game.getMap().hitTest(x, y)) {
                    player.isMoving = true;
                    //Tell the server we are moving, send in our input and our x/y position
                    //MULTIPLAYER COMMENTgame.socket.emit("move player", { id: id, input: input, x: player.x, y: player.y });
                    //Recursively call this function
                    move();
                }
            }
        }
    };

    //Returns the square that the player is standing on within the game's map
    var square = function () {
        return { x: Math.floor(player.x / game.spriteWidth), y: Math.floor(player.y / game.spriteHeight) }
    }

    //Returns what square we are currently facing
    //Returns null if that square is outside of the game world
    var getFacingSquare = function () {
        var playerSquare = square();
        var facingSquare;
        if (player.direction === 0) {//Down
            facingSquare = { x: playerSquare.x, y: playerSquare.y + 1 }
        } else if (player.direction === 1) {//Up
            facingSquare = { x: playerSquare.x, y: playerSquare.y - 1 }
        } else if (player.direction === 2) {//Right
            facingSquare = { x: playerSquare.x + 1, y: playerSquare.y }
        } else if (player.direction === 3) {//Left
            facingSquare = { x: playerSquare.x - 1, y: playerSquare.y }
        }
        if ((facingSquare.x < 0 || facingSquare.x >= game.getMap().width / 16) || (facingSquare.y < 0 || facingSquare.y >= game.getMap().height / 16)) {
            return null;
        } else {
            return facingSquare;
        }
    }

    //This function is called by the game to determine if the player is facing an NPC to interact with them
    var facing = function () {
        var fSquare = getFacingSquare();
        if (!fSquare) {
            return null;
        } else {
            return game.foregroundData[fSquare.y][fSquare.x];
        }
    }

    //Inventory
    //Items visible (what the player has) 
    var visibleItems = [];
    //Surface for displaying the inventory
    var itemSurface = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);

    //Inventory array, the numbers equal the ids set up in the game.js file's inventory array
    var inventory = [];

    //Hides the inventory by removing everything in the visibleItems
    var hideInventory = function () {
        for (var i = 0; i < visibleItems.length; i++) {
            visibleItems[i].remove();
        }
        visibleItems = [];
    };

    //Draws the inventory using the sprites from the items.png
    var showInventory = function (yOffset) {
        if (visibleItems.length === 0) {
            itemSurface.draw(game.assets['items.png']);
            for (var i = 0; i <  inventory.length; i++) {
                var item = new Sprite(game.spriteWidth, game.spriteHeight);
                item.y = 130 + yOffset;
                item.x = 30 + 70 * i;
                item.frame = inventory[i];
                item.scaleX = 2;
                item.scaleY = 2;
                item.image = itemSurface;
                visibleItems.push(item);
                game.currentScene.addChild(item);
            }
        }
    };

    //Our mighty update function
    var update = function (isLocal) {
        //If its a local player, we call the local update 
        if (isLocal) {
            localUpdate();
        }//Otherwise we call the server player update
        else {
            serverPlayerUpdate();
        }
    };

    //The local update
    var localUpdate = function () {
        move();
        if (game.input.a) {
            var playerFacing = facing();
            if (!playerFacing || !spriteRoles[playerFacing]) {
                player.displayStatus();
            } else {
                spriteRoles[playerFacing].action();
            };
        };
    };

    //This function only applies to non-local players in multiplayer
    //Its a stripped down version of our move function
    //However we remove the emits and instead of using game.input.x, we look at our input variable
    //Then we move the player as normal
    var serverPlayerUpdate = function () {
        //Get the current frame
        player.frame = player.spriteOffset + player.direction * 2 + player.walk;

        //If input is none we just axe the movement by setting player.isMoving to false
        if (input == INPUT_TYPES.NONE)
            player.isMoving = false;

        if (player.isMoving) {
            player.moveBy(player.xMovement, player.yMovement);
            if (!(game.frame % 2)) {
                player.walk++;
                player.walk %= 2;
            }
            if ((player.xMovement && player.x % 16 === 0) || (player.yMovement && player.y % 16 === 0)) {
                player.isMoving = false;
                player.walk = 1;
            }
        }
        else {
            //Player is not moving
            player.xMovement = 0;
            player.yMovement = 0;
            switch (input) {
                case INPUT_TYPES.UP:
                    player.direction = 1;
                    player.yMovement = -4;
                    break;
                case INPUT_TYPES.RIGHT:
                    player.direction = 2;
                    player.xMovement = 4;
                    break;
                case INPUT_TYPES.LEFT:
                    player.direction = 3;
                    player.xMovement = -4;
                    break;
                case INPUT_TYPES.DOWN:
                    player.direction = 0;
                    player.yMovement = 4;
                    break;
                case INPUT_TYPES.NONE:
                    player.isMoving = false;
                    player.xMovement = 0;
                    player.yMovement = 0;
                    break;
            }

            if (player.xMovement || player.yMovement) {
                var x = player.x + (player.xMovement ? player.xMovement / Math.abs(player.xMovement) * 16 : 0);
                var y = player.y + (player.yMovement ? player.yMovement / Math.abs(player.yMovement) * 16 : 0);
                if (0 <= x && x < game.width && 0 <= y && y < game.height) { //Bounds checking
                    player.isMoving = true;
                    //Unlike our normal update we don't need to emit here
                }
            }
        }

    }

    //Movement getter and setters
    var getX = function () {
        return player.x;
    };

    var getY = function () {
        return player.y;
    };

    var setX = function (newX) {
        player.x = newX;
    };

    var setY = function (newY) {
        player.y = newY;
    };

    var getInput = function () {
        return input;
    }

    var setInput = function (i) {
        input = i;
    }


    //Called when the player dies
    //Shows the main menu
    var playerDeath = function () {
        game.showMenu(true);
    };

    var getStatusLabel = function () {
        return player.statusLabel;
    }

    return {
        setPlayer: setPlayer,
        object: player,//Returns player as object (Saves confusion) 
        update: update,
        showInventory: showInventory,
        hideInventory: hideInventory,
        facing: facing,
        facingSquare: getFacingSquare,
        clearStatus: clearStatus,
        displayStatus: displayStatus,
        setPlayer: setPlayer,
        getStatusLabel : getStatusLabel,
        inventory: inventory,
        playerDeath: playerDeath,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        getInput: getInput,
        setInput: setInput
    };
}