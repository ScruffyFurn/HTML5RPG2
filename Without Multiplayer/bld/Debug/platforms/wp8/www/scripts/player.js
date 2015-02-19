var Player = function (game) {

    var player = new Sprite(game.spriteWidth, game.spriteHeight);

    var setPlayer = function () {
        player.spriteOffset = 5;
        player.startingX = 6;
        player.startingY = 14;
        player.x = player.startingX * game.spriteWidth;
        player.y = player.startingY * game.spriteHeight;
        player.direction = 0;
        player.walk = 0;
        player.frame = player.spriteOffset + player.direction;
        player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        player.image.draw(game.assets['sprites.png']);

        player.name = "Steve"
        player.characterClass = "Knight";
        player.exp = 0;
        player.level = 1;
        player.gp = 100;

        player.levelStats = [{}, { attack: 4, maxHp: 10, maxMp: 0, expMax: 10 },
                             { attack: 6, maxHp: 14, maxMp: 0, expMax: 30 },
                             { attack: 7, maxHp: 20, maxMp: 5, expMax: 50 }
        ];

        player.attack = function () {
            return player.levelStats[player.level].attack;
        };

        player.hp = player.levelStats[player.level].maxHp;
        player.mp = player.levelStats[player.level].maxMp;

        player.statusLabel = new Label("");
        player.statusLabel.width = game.width;
        player.statusLabel.y = undefined;
        player.statusLabel.x = undefined;
        player.statusLabel.color = '#fff';
        player.statusLabel.backgroundColor = '#000';
    };

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

    var clearStatus = function () {
        player.statusLabel.text = "";
        player.statusLabel.height = 0;
        hideInventory();
    };

    var move = function () {

        player.frame = player.spriteOffset + player.direction * 2 + player.walk;

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
        } else {
            player.xMovement = 0;
            player.yMovement = 0;
            if (game.input.up) {
                player.direction = 1;
                player.yMovement = -4;
                clearStatus();
            } else if (game.input.right) {
                player.direction = 2;
                player.xMovement = 4;
                clearStatus();
            } else if (game.input.left) {
                player.direction = 3;
                player.xMovement = -4;
                clearStatus();
            } else if (game.input.down) {
                player.direction = 0;
                player.yMovement = 4;
                clearStatus();
            }
            if (player.xMovement || player.yMovement) {
                var x = player.x + (player.xMovement ? player.xMovement / Math.abs(player.xMovement) * 16 : 0);
                var y = player.y + (player.yMovement ? player.yMovement / Math.abs(player.yMovement) * 16 : 0);
                if (0 <= x && x < game.getMap().width && 0 <= y && y < game.getMap().height && !game.getMap().hitTest(x, y)) {
                    player.isMoving = true;
                    move();
                }
            }
        }
    };

    var square = function () {
        return { x: Math.floor(player.x / game.spriteWidth), y: Math.floor(player.y / game.spriteHeight) }
    }

    var getFacingSquare = function () {
        var playerSquare = square();
        var facingSquare;
        if (player.direction === 0) {
            facingSquare = { x: playerSquare.x, y: playerSquare.y + 1 }
        } else if (player.direction === 1) {
            facingSquare = { x: playerSquare.x, y: playerSquare.y - 1 }
        } else if (player.direction === 2) {
            facingSquare = { x: playerSquare.x + 1, y: playerSquare.y }
        } else if (player.direction === 3) {
            facingSquare = { x: playerSquare.x - 1, y: playerSquare.y }
        }
        if ((facingSquare.x < 0 || facingSquare.x >= game.getMap().width / 16) || (facingSquare.y < 0 || facingSquare.y >= game.getMap().height / 16)) {
            return null;
        } else {
            return facingSquare;
        }
    }

    var facing = function () {
        var fSquare = getFacingSquare();
        if (!fSquare) {
            return null;
        } else {
            return game.foregroundData[fSquare.y][fSquare.x];
        }
    }

    var visibleItems = [];
    var itemSurface = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);
    var inventory = [];

    var hideInventory = function () {
        for (var i = 0; i < visibleItems.length; i++) {
            visibleItems[i].remove();
        }
        visibleItems = [];
    };

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

    var update = function() {
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
        inventory:inventory
    };
}