//Shop object file

var Shop = function (game) {
    var shop = new Group();
        
    var shopScene = new Scene();

    //Sets up the shop
    var setShop = function ()
    {
        shop.itemSelected = 0;

        //Shops sayings and what not
        shop.greeting = "Hi!  I'm Maneki. Meow. I sell things.";
        shop.apology = "Meow... sorry, you don't have the money for this.";
        shop.sale = "Here ya go!";
        shop.farewell = "Come again! Meow!";
        //Set up for displaying the message
        shop.message = new Label(shop.greeting);
        drawManeki();

        shop.shoppingFunds = new Label(getShoppingFunds());
        shop.shoppingFunds.color = '#fff';
        shop.shoppingFunds.y = 200;
        shop.shoppingFunds.x = 10;
        shop.addChild(shop.shoppingFunds);
        drawItemsForSale();
        shopScene.backgroundColor = '#000';
        shopScene.addChild(shop);

        //Buttons
        var shopPad = new enchant.ui.Pad();
        shopPad.moveTo(0, 380);
        shopScene.addChild(shopPad);

        var shopButtonB = new enchant.ui.Button("B", "light");
        shopButtonB.moveTo(180, 450);
        shopScene.addChild(shopButtonB);

        var shopButtonA = new enchant.ui.Button("A", "blue");
        shopButtonA.moveTo(230, 410);
        shopButtonA.ontouchstart = function () {
            attemptToBuy();
        };


        shopScene.addChild(shopButtonA);
    };

    //Updates the shop
    var update = function ()
    {
        setTimeout(function () {
            if (game.input.a) {
                attemptToBuy();
            } else if (game.input.down) {
                shop.message.text = shop.farewell;
                setTimeout(function () {
                    game.popScene();
                    shop.message.text = shop.greeting;
                }, 1000);
            } else if (game.input.left) {
                shop.itemSelected = shop.itemSelected + game.items.length - 1;
                shop.itemSelected = shop.itemSelected % game.items.length;
                shop.itemSelector.x = 30 + 70 * shop.itemSelected;
                shop.message.text = shop.greeting;
            } else if (game.input.right) {
                shop.itemSelected = (shop.itemSelected + 1) % game.items.length;
                shop.itemSelector.x = 30 + 70 * shop.itemSelected;
                shop.message.text = shop.greeting;
            }
        }, 500);
        game.getPlayer().showInventory(100);
        shop.shoppingFunds.text = getShoppingFunds();
    };

    //Returns a string to print out how much gold the game.getPlayer() has
    var getShoppingFunds = function () {
        return "Gold: " + game.getPlayer().object.gp;
    };

    //Draws the maneki
    var drawManeki = function () {
        var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        var maneki = new Sprite(game.spriteWidth, game.spriteHeight);
        maneki.image = image;
        image.draw(game.assets['sprites.png']);
        maneki.frame = 4;
        maneki.y = 10;
        maneki.x = 10;
        maneki.scaleX = 2;
        maneki.scaleY = 2;
        shop.addChild(maneki);
        shop.message.x = 40;
        shop.message.y = 10;
        shop.message.color = '#fff';
        shop.message.width = window.screen.width;
        shop.addChild(shop.message);
    };

    var drawItemsForSale = function () {
        for (var i = 0; i < game.items.length; i++) {
            var image = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);
            var item = new Sprite(game.spriteWidth, game.spriteHeight);
            image.draw(game.assets['items.png']);
            itemLocationX = 30 + 70 * i;
            itemLocationY = 70;
            item.y = itemLocationY;
            item.x = itemLocationX;
            item.frame = i;
            item.scaleX = 2;
            item.scaleY = 2;
            item.image = image;
            shop.addChild(item);

            var itemDescription = new Label(game.items[i].price + "<br />" + game.items[i].description);
            itemDescription.x = itemLocationX - 8;
            itemDescription.y = itemLocationY + 40;
            itemDescription.color = '#fff';
            shop.addChild(itemDescription);

            if (i === shop.itemSelected) {
                var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
                shop.itemSelector = new Sprite(game.spriteWidth, game.spriteHeight);
                image.draw(game.assets['sprites.png']);
                itemLocationX = 30 + 70 * i;
                itemLocationY = 160;
                shop.itemSelector.scaleX = 2;
                shop.itemSelector.scaleY = 2;
                shop.itemSelector.y = itemLocationY;
                shop.itemSelector.x = itemLocationX;
                shop.itemSelector.frame = 7;
                shop.itemSelector.image = image;
                shop.addChild(shop.itemSelector);
            };
        };
    };


    //Attempt to buy function
    var attemptToBuy = function () {
        var itemPrice = game.items[shop.itemSelected].price;
        if (game.getPlayer().object.gp < itemPrice) {
            shop.message.text = shop.apology;
        } else {
            game.getPlayer().visibleItems = [];
            game.getPlayer().object.gp = game.getPlayer().object.gp - itemPrice;
            game.getPlayer().inventory.push(game.items[shop.itemSelected].id);
            game.items[shop.itemSelected].effect();
            shop.message.text = shop.sale;
        }
    };

    var getShopScene = function()
    {
        return shopScene;
    }
 

    //Returns
    return{
        update: update,
        setShop: setShop,
        object: shop,
        getShopScene: getShopScene
    };

}
