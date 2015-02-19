//Battle system file

//Battle requires both a game object and a player object to be passed in
var Battle = function (game,player) {

    var battleScene = new Scene();
    var battle = new Group();

    var setBattle = function () {
        //Set the background colour of the scene
        battleScene.backgroundColor = '#000';

        //Set the menu properties for the battle
        battle.menu = new Label();
        battle.menu.x = 20;
        battle.menu.y = 170;
        battle.menu.color = '#fff';
        battle.activeAction = 0;

        battle.playerStatus = new Label("");
        battle.playerStatus.color = '#fff';
        battle.playerStatus.x = 200;
        battle.playerStatus.y = 120;

        battle.enemyStatus = new Label("");
        battle.enemyStatus.color = '#fff';
        battle.enemyStatus.x = 250;
        battle.enemyStatus.y = 120;

        //Set the won/lost function
        //Allows for customizable win/loss conditions and scenarios
        battle.won = defaultWon;
        battle.lost = defaultLost;
        
        addCombatants();

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

        battleScene.on('enterframe', function () {
            if (!battle.wait) {
                if (game.input.a) {
                    actions[battle.activeAction].action();
                } else if (game.input.down) {
                    battle.activeAction = (battle.activeAction + 1) % actions.length;
                    battle.menu.text = listActions();
                } else if (game.input.up) {
                    battle.activeAction = (battle.activeAction - 1 + actions.length) % actions.length;
                    battle.menu.text = listActions();
                }
                battle.playerStatus.text = getPlayerStatus();
                battle.enemyStatus.text = getEnemyStatus();
            };
        })

        battleScene.on('exit', function () {
            setTimeout(function () {
                battle.menu.text = "";
                battle.activeAction = 0;
                battle.playerStatus.text = "";
                battle.enemyStatus.text = "";
                game.resume();
            }, 1000);
        });

        battle.addChild(battle.playerStatus);
        battle.addChild(battle.enemyStatus);
        battle.addChild(battle.menu);
        battle.addChild(battle.playerSprite);
        battleScene.addChild(battle);

        var battlePad = new enchant.ui.Pad();
        battlePad.moveTo(0, 380);
        battleScene.addChild(battlePad);

        var battleButtonB = new enchant.ui.Button("B", "light");
        battleButtonB.moveTo(180, 450);
        battleScene.addChild(battleButtonB);

        var battleButtonA = new enchant.ui.Button("A", "blue");
        battleButtonA.moveTo(230, 410);
        battleButtonA.ontouchstart = function () {
            if (!battle.wait) {
                actions[battle.activeAction].action();
            };
        };
        battleScene.addChild(battleButtonA);


    };

    //Rolls to see how hard the player/enemy hit
    var hitStrength = function (hit) {
        return Math.round((Math.random() + .5) * hit);
    };

    //Called when the battle is won
    //Resets some values, rewards the player with exp, gold etc
    var defaultWon = function () {
        battle.over = true;
        player.object.exp += player.object.currentEnemy.exp;
        player.object.gp += player.object.currentEnemy.gp;
        player.object.currentEnemy.hp = player.object.currentEnemy.maxHp;
        player.object.statusLabel.text = "You won!<br />" +
          "You gained " + player.object.currentEnemy.exp + " exp<br />" +
          "and " + player.object.currentEnemy.gp + " gold pieces!";
        player.object.statusLabel.height = 45;
        if (player.object.exp > player.object.levelStats[player.object.level].expMax && player.object.level < player.object.levelStats.length - 1) {
            player.object.level += 1;
            player.object.statusLabel.text = player.object.statusLabel.text +
                "<br />And you gained a level!" +
                "<br />You are now at level " + player.object.level + "!";
            player.object.statusLabel.height = 75;
        }
        player.object.hp = player.object.levelStats[player.object.level].maxHp;
    };

    //Sadly, you lost, lose some gold as punishment, and get your health/mana back
    var defaultLost = function () {
        battle.over = true;
        player.object.hp = player.object.levelStats[player.object.level].maxHp;
        player.object.mp = player.object.levelStats[player.object.level].maxMp;
        player.object.gp = Math.round(player.object.gp / 2);
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

    //Enemies attack
    var enemyAttack = function () {
        var currentEnemy = player.object.currentEnemy;
        var enemyHit = hitStrength(currentEnemy.attack);
        player.object.hp = player.object.hp - enemyHit;
        battle.menu.text = "You took " + enemyHit + " damage!";
        if (player.object.hp <= 0) {
            battle.lost();
        };
    };

    //Different actions you can take while in combat
    var actions = [{
        name: "Fight", action: function () {
            battle.wait = true;
            playerAttack();

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
                    }, 1000)
                };
            }, 1000);
        }
    },
    {
        name: "Magic", action: function () {
            battle.menu.text = "You don't know any magic yet!";
            battle.wait = true;
            battle.activeAction = 0;

            setTimeout(function () {
                battle.menu.text = listActions();
                battle.wait = false;
            }, 1000);
        }
    },
    {
        name: "Run", action: function () {
            game.pause();
            player.object.statusLabel.text = "You ran away!";
            player.object.statusLabel.height = 12;
            battle.menu.text = "";
            game.popScene();
        }
    }
    ];

    //Function that lists the different actions you can take while in combat
    var listActions = function () {
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
    var addCombatants = function () {
        var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        image.draw(game.assets['sprites.png']);
        battle.playerSprite = new Sprite(game.spriteWidth, game.spriteHeight);
        battle.playerSprite.image = image;
        battle.playerSprite.frame = 7;
        battle.playerSprite.x = 150;
        battle.playerSprite.y = 120;
        battle.playerSprite.scaleX = 2;
        battle.playerSprite.scaleY = 2;
        battle.enemySprite = new Sprite(game.spriteWidth, game.spriteHeight);
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

    var setWinFunction = function (f) {
        battle.won = f;
    };

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