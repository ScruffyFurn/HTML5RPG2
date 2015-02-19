//Battle system file
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
//Battle requires both a game object and a player object to be passed in
var Battle = function (game,player) {

    var battleScene = new Scene(); //An enchangeJS scene that allows us to display everything
    var battle = new Group(); //A group which is a collection of enchantjs nodes (or objects, such aslabels, sprites etc)

    var setBattle = function () {
        //Set the background colour of the scene
        battleScene.backgroundColor = '#000';

        //Set the menu properties for the battle
        battle.menu = new Label();
        battle.menu.x = 10;
        battle.menu.y = 170;
        battle.menu.color = '#fff';
        battle.menu.width = game.width;
        battle.activeAction = 0;

        battle.playerStatus = new Label("");
        battle.playerStatus.color = '#fff';
        battle.playerStatus.width = game.width;
        battle.playerStatus.x = 10;
        battle.playerStatus.y = 120;

        battle.enemyStatus = new Label("");
        battle.enemyStatus.color = '#fff';
        battle.enemyStatus.width = game.width
        battle.enemyStatus.x = 60;
        battle.enemyStatus.y = 120;

        //Set the won/lost function
        //Allows for customizable win/loss conditions and scenarios
        battle.won = defaultWon;
        battle.lost = defaultLost;
        
       
        //Add the combatants, loads the images and the like for the players opponent
        addCombatants();

        //Enter is called when the scene appears (enters) the screen initially so when we push it to the top of the stack
        battleScene.on('enter', function () {
            battle.over = false;
            battle.wait = true;
            battle.menu.text = "";
            battle.enemySprite.frame = player.object.currentEnemy.sprite;

            setTimeout(function () {
                battle.menu.text = listActions();
                battle.wait = false;
            }, 500);
        });

        //Enter frame is called every frame, so we use it to put our update code
        battleScene.on('enterframe', function () {
            update();
        })

        //Exit is called when the scene leaves the screen
        battleScene.on('exit', function () {
            setTimeout(function () {
                battle.menu.text = "";
                battle.activeAction = 0;
                battle.playerStatus.text = "";
                battle.enemyStatus.text = "";
                game.resume();
            }, 1000);
        });

        //We add the playerStatus, enemyStatus, menu, and playerSprite to the battle object
        battle.addChild(battle.playerStatus);
        battle.addChild(battle.enemyStatus);
        battle.addChild(battle.menu);
        battle.addChild(battle.playerSprite);
        //Finally we add the battle objec to the battleScene
        battleScene.addChild(battle);

        //Next input
        //First our directional pad
        var battlePad = new enchant.ui.Pad();
        battlePad.moveTo(0, 380);
        battleScene.addChild(battlePad);

        //Then the B button
        var battleButtonB = new enchant.ui.Button("B", "light");
        battleButtonB.moveTo(180, 450);
        battleScene.addChild(battleButtonB);

        //Finally the A button
        var battleButtonA = new enchant.ui.Button("A", "blue");
        battleButtonA.moveTo(230, 410);
        battleButtonA.ontouchstart = function () {
            //When we press the A button, we call the action function for our currently selected actions
            //Look below at our actions array, the first option is fight, then magic, then flee and all three have an action function built in
            if (!battle.wait) {
                actions[battle.activeAction].action();
            };
        };
        battleScene.addChild(battleButtonA);


    };

    //Update function called every frame
    var update = function () {
        //If the battle is not waiting, we listen and react to players input
        if (!battle.wait) {
            if (game.input.down) {
                battle.activeAction = (battle.activeAction + 1) % actions.length;
                battle.menu.text = listActions();
            } else if (game.input.up) {
                battle.activeAction = (battle.activeAction - 1 + actions.length) % actions.length;
                battle.menu.text = listActions();
            }
            battle.playerStatus.text = getPlayerStatus();
            battle.enemyStatus.text = getEnemyStatus();
        };
    }

    //Rolls to see how hard the player/enemy hit
    var hitStrength = function (hit) {
        return Math.round((Math.random() + .5) * hit);
    };

    //Called when the battle is won
    //Resets some values, rewards the player with exp, gold etc
    //This is the default win function, the battles won and loss functions can be overwritten using the SetWonFunction and SetLossFunction
    var defaultWon = function () {
        battle.over = true;
        player.object.exp += player.object.currentEnemy.exp;
        player.object.gp += player.object.currentEnemy.gp;
        player.object.currentEnemy.hp = player.object.currentEnemy.maxHp;
        player.object.statusLabel.text = "You won!<br />" +
          "You gained " + player.object.currentEnemy.exp + " exp<br />" +
          "and " + player.object.currentEnemy.gp + " gold pieces!";
        player.object.statusLabel.height = 45;

        //Check if the player has leveled up and increase the players level for them
        if (player.object.exp > player.object.levelStats[player.object.level].expMax && player.object.level < player.object.levelStats.length - 1) {
            player.object.level += 1;
            player.object.statusLabel.text = player.object.statusLabel.text +
                "<br />And you gained a level!" +
                "<br />You are now at level " + player.object.level + "!";
            player.object.statusLabel.height = 75;

            player.object.mp = player.object.levelStats[player.object.level].maxMp;
        }
        player.object.hp = player.object.levelStats[player.object.level].maxHp;
    };

    //Sadly, you lost so you get sent back to the main screen
    var defaultLost = function () {
        battle.over = true;
        player.object.statusLabel.text = "You lost!";
        player.object.statusLabel.height = 12;


    };

    //Function that handles the players attack
    var playerAttack = function () {
        var currentEnemy = player.object.currentEnemy;
        var playerHit = hitStrength(player.object.attack());
        currentEnemy.hp = currentEnemy.hp - playerHit;
        battle.menu.text = "You did " + playerHit + " damage!";
        if (currentEnemy.hp <= 0) {
            battle.won();
        };
    };


    //Function that handles the players mana attack
    var playerManaAttack = function () {
        var currentEnemy = player.object.currentEnemy;
        var playerHit = hitStrength(player.object.attack());
        currentEnemy.hp = currentEnemy.hp - playerHit;

        //Remove some of your mana
        player.object.mp--;
        
        //Bounds checking
        if (player.object.mp < 0)
            player.object.mp = 0;

        battle.menu.text = "You did " + playerHit + " damage!";
        if (currentEnemy.hp <= 0) {
            battle.won();
        };
    };

    //Enemies attack
    var enemyAttack = function () {
        //Get the current enemy from the player
        var currentEnemy = player.object.currentEnemy;
        //Get his hit strength
        var enemyHit = hitStrength(currentEnemy.attack);
        //Make the player bleed
        player.object.hp = player.object.hp - enemyHit;
        //Display how much damage you took
        battle.menu.text = "You took " + enemyHit + " damage!";
        //If you're health is below 0 you died
        if (player.object.hp <= 0) {
            //This function can actually be overwritten via the setLossFunction
            battle.lost();
        };
    };

    //Different actions you can take while in combat
    var actions = [{
        name: "Fight", action: function () {
            //We tell the battle to wait (so no input can be done)
            battle.wait = true;
            //Do the players attack
            playerAttack();
            //Then using some setTimeouts, we check if the battle is done, if not
            //We do the enemy attack
            setTimeout(function () {
                if (!battle.over) {
                    enemyAttack();
                };
                //After the enemy attack, if the battle is not over, we use another timeout to list the player's actions
                //Otherwise...
                if (!battle.over) {
                    setTimeout(function () {
                        battle.menu.text = listActions();
                        battle.wait = false;
                    }, 1000)
                } else {
                    //....We wait a second, then reset the menu's text and pop the scene (which is the battle scene)
                    //If the player is dead, we call the players death function
                    setTimeout(function () {
                        battle.menu.text = "";
                        game.popScene();

                        if (player.object.hp <= 0) {
                            //Call the player's death function
                            player.playerDeath();
                        }
                    }, 1000)
                };
            }, 1000);
        }
    },
    {
        name: "Magic", action: function () {

            battle.wait = true;

            //Magic uses the same process that fight does just with the added check if the player is over lvl 3, meaning he knows magic

            if (player.object.level < 3) {
                //if they dont know any magic we immediately reset everything and return
                battle.menu.text = "You don't know any magic yet!";
                battle.wait = true;
                battle.activeAction = 0;

                setTimeout(function () {
                    battle.menu.text = listActions();
                    battle.wait = false;
                }, 1000);
                return;
            }
            //Otherwise we do the mana attack
            if (player.object.mp > 0) {
                playerManaAttack();
            }
     
            //Using the same sort of structure as fight above we do the enemy attack, reset the text and check for the players death
            setTimeout(function () {
                if (!battle.over) {
                    enemyAttack();
                };
                if (!battle.over) {
                    setTimeout(function () {
                        battle.menu.text = listActions();
                        battle.wait = false;
                    }, 1000)
                } else {
                    setTimeout(function () {
                        battle.menu.text = "";
                        game.popScene();

                        if (player.object.hp <= 0) {
                            //Call the player's death function
                            player.playerDeath();
                        }
                    }, 1000)
                };
            }, 1000);
        }
    },
    {
        name: "Run", action: function () {
            //Finally we deal with cowardness, what happens when the player runs
            //We pause the game, so the player cant move and so on
            game.pause();
            //Say you ran away
            player.object.statusLabel.text = "You ran away!";
            player.object.statusLabel.height = 12;
            battle.menu.text = "";
            //Remove the battle scene
            game.popScene();

            //The game is resumed up in our exit function we set up in SetBattle()
        }
    }
    ];

    //Function that lists the different actions you can take while in combat
    var listActions = function () {
        //Here we load in the options from our actions array
        //Pass them into battle.optionText
        //And finally return battle.optionText after calling join on it (array function within Javascript http://www.w3schools.com/jsref/jsref_join.asp)
        battle.optionText = [];
        for (var i = 0; i < actions.length; i++) {
            if (i === battle.activeAction) {
                battle.optionText[i] = "-->" + actions[i].name;
            } else {
                battle.optionText[i] = actions[i].name;
            }
        }
        return battle.optionText.join("<br />");
    };

    //Adds in the player and enemy combatants
    //This function sets up two sprites, one for the player and one for the enemy so we can see the two on the screen
    var addCombatants = function () {
        //First we set up the image, which in enchant is a surface
        //Think of a surface as a picture that you draw things to
        var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        image.draw(game.assets['sprites.png']);
        //Next we set up the battle.playerSprite which is a sprite
        //A sprite is an object that stores properties such as an image, a position (x,y), animation frame etc
        //Reference the explanation at the top of game.js
        battle.playerSprite = new Sprite(game.spriteWidth, game.spriteHeight);
        battle.playerSprite.image = image;
        battle.playerSprite.frame = 7;
        battle.playerSprite.x = 150;
        battle.playerSprite.y = 120;
        battle.playerSprite.scaleX = 2;
        battle.playerSprite.scaleY = 2;
        //Then we setup the enemies sprite in the same fashion
        battle.enemySprite = new Sprite(game.spriteWidth, game.spriteHeight);
        //We reuse the image, since they both use the same sprite sheet
        //Now if you notice we don't set the enemySprites frame
        //That is because when this code gets fired, the player will not have an enemy
        //So we set the frame in our 'enter' event handler we set in setBattle();
        battle.enemySprite.image = image;
        battle.enemySprite.x = 150;
        battle.enemySprite.y = 70;
        battle.enemySprite.scaleX = 2;
        battle.enemySprite.scaleY = 2;
        battle.addChild(battle.enemySprite);
    };

    //Returns a string that outputs the player's current health
    var getPlayerStatus = function () {
        return "Player<br />HP: " + player.object.hp + "<br />MP: " + player.object.mp;
    };

    //Returns a string that outputs the enemy's current health
    var getEnemyStatus = function () {
        if (typeof player.object.currentEnemy != 'undefined')
            return player.object.currentEnemy.name + "<br />HP: " + player.object.currentEnemy.hp;
        else
            return "Enemy";
    };


    //Returns the battle scene
    var getScene = function () {
        return battleScene;
    };

    //Sets the battle's won function
    var setWinFunction = function (f) {
        battle.won = f;
    };

    //Sets the battle's lost function
    var setLossFunction = function (f) {
        battle.lost = f;
    };

    //Reset function
    //Resets the win/loss functions
    var reset = function () {
        battle.won = defaultWon;
        battle.lost = defaultLost;
    }

    //Returns
    return {
        over: battle.over,
        getScene: getScene,
        object: battle,
        setBattle: setBattle,
        addCombatants: addCombatants,
        defaultWon: defaultWon,
        defaultLoss: defaultLost,
        setLossFunction: setLossFunction,
        setWinFunction: setWinFunction,
        reset: reset

    }
}