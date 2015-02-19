enchant();
window.onload = function () {
    var game = new Game(window.screen.height, window.screen.width);
    //game.keybind(32, 'a');
    game.spriteSheetWidth = 272;
    game.spriteSheetHeight = 16;
    game.itemSpriteSheetWidth = 64;
    game.preload(['sprites.png', 'items.png']);
    game.items = [{ price: 1000, description: "Hurter", id: 0 },
                 { price: 5000, description: "Drg. Paw", id: 1 },
                 { price: 5000, description: "Ice Magic", id: 2 },
                 { price: 60, description: "Chess Set", id: 3 }]
    game.fps = 15;
    game.spriteWidth = 16;
    game.spriteHeight = 16;
    game.scale = 1.0;

    var player = new Player(game);
    var shop = new Shop(game);
    var battle = new Battle(game, player);

    var map = new Map(game.spriteWidth, game.spriteHeight);
    var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);
    game.foregroundData = foregroundData;

    var setMaps = function () {
        map.image = game.assets['sprites.png'];
        map.loadData(mapData);
        foregroundMap.image = game.assets['sprites.png'];
        foregroundMap.loadData(game.foregroundData);
        var collisionData = [];
        for (var i = 0; i < game.foregroundData.length; i++) {
            collisionData.push([]);
            for (var j = 0; j < game.foregroundData[0].length; j++) {
                var collision = game.foregroundData[i][j] % 13 > 1 ? 1 : 0;
                collisionData[i][j] = collision;
            }
        }
        map.collisionData = collisionData;
    };

    game.popFromMap = function(type,replacement)
    {
        for (var i = 0; i < game.foregroundData.length; i++) {
            for (var j = 0; j < game.foregroundData[0].length; j++) {
                if (game.foregroundData[i][j] == type)
                    game.foregroundData[i][j] = replacement;
            }
        }

        setMaps();
    }

    var setStage = function () {
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(player.object);

        var buttonB = new enchant.ui.Button("B", "light");
        buttonB.moveTo(180, 450);
        game.currentScene.addChild(buttonB);

        var buttonA = new enchant.ui.Button("A", "blue");
        buttonA.moveTo(230, 410);
        game.currentScene.addChild(buttonA);


        buttonA.ontouchstart = function () {
            var playerFacing = player.facing();

            if (!playerFacing || !spriteRoles[playerFacing]) {
                player.displayStatus();
            }else if(playerFacing == 2){
                spriteRoles[playerFacing].action(game, new Quest(game, RatQuest,2));
            } else if (playerFacing == 16) {
                spriteRoles[playerFacing].action(game, new Quest(game, RevengeQuest,16));
            }else {
                spriteRoles[playerFacing].action(game);
            };
       };

       var pad = new enchant.ui.Pad();
       pad.moveTo(0, 380);
       game.currentScene.addChild(pad);

       
        stage.addChild(foregroundMap);
        stage.addChild(player.object.statusLabel);
        game.rootScene.addChild(stage);
    };





    var spriteRoles = [, , ratQuestGiver, , cat, , , , , , , , , , , brawler,revengeQuestGiver]




    game.focusViewport = function () {
        var x = Math.min((game.width - 16) / 2 - player.x, 0);
        var y = Math.min((game.height - 16) / 2 - player.y, 0);
        x = Math.max(game.width, x + map.width) - map.width;
        y = Math.max(game.height, y + map.height) - map.height;
        game.rootScene.firstChild.x = x;
        game.rootScene.firstChild.y = y;
    };

    game.onload = function () {
        game.storable = ['exp', 'level', 'gp', 'inventory'];

      /*  game.saveToLocalStorage = function () {
            for (var i = 0; i < game.storable.length; i++) {
                if (game.storable[i] === 'inventory') {
                    window.localStorage.setItem(game.storable[i], JSON.stringify(player[game.storable[i]]));
                } else {
                    window.localStorage.setItem(game.storable[i], player[game.storable[i]]);
                }
            }
        };

        setInterval(game.saveToLocalStorage, 5000);
        */
        setMaps();
        player.setPlayer();
        setStage();
        shop.setShop();
        battle.setBattle();


        shop.object.on('enter', function () {
            shop.object.shoppingFunds.text = shop.shoppingFunds();
        });

        shop.object.on('enterframe', function () {
            shop.update();
        });

        player.object.on('enterframe', function ()
        {
            player.update();
        });

        game.rootScene.on('enterframe', function (e) {
            game.focusViewport();
        });
    };
    game.start();


    //Getters and Setters
    game.getMap = function () {
        return map;
    };
    
    game.getPlayer = function()
    {
        return player;
    };

    game.getShop = function()
    {
        return shop;
    }

    game.getBattle = function()
    {
        return battle;
    }


    return {
        getPlayer : game.getPlayer,
        getMap: game.getMap,
        getShop: game.shop,
        getBattle: game.getBattle,
        popFromMap: game.popFromMap
    };
};
