//Shop object file
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
//We take game as an argument, so we can reference it throughout the object
var Shop = function (game) {
    var shop = new Group();//The actual 'shop' object that will hold most of our variables and do a lot of the work.
                           //A group is a collection of enchant js 'nodes' or in simple terms objects like labels
        
    var shopScene = new Scene();//Our shop scene, this is what allows us to display the shop and its contents, 
                                //we push it onto the games scene stack (meaning it shows up because its on top) then pop it when we are done

    //Sets up the shop
    var setShop = function ()
    {
        //Variable to store what object is selected
        shop.itemSelected = 0;

        //Shops sayings and what not
        shop.greeting = "Hi!  I'm Maneki. Meow. I sell things.";
        shop.apology = "Meow... sorry, you don't have the money for this.";
        shop.sale = "Here ya go!";
        shop.farewell = "Come again! Meow!";
        //Set up for displaying the message
        shop.message = new Label(shop.greeting);
        //Set its position, color, size and then add it to the shop
        shop.message.x = 40;
        shop.message.y = 10;
        shop.message.color = '#fff';
        shop.message.width = game.width;
        shop.addChild(shop.message);

        //Draws the shop keeper, Maneki the Cat
        drawManeki();

        //Shopping funds is a label (an object that displays text) that shows how much gold the player has
        //Here we set its position, text, colour, and add it to the shop (which is a group and meant to store things like this)
        shop.shoppingFunds = new Label(getShoppingFunds());
        shop.shoppingFunds.color = '#fff';
        shop.shoppingFunds.y = 200;
        shop.shoppingFunds.x = 10;
        shop.width = game.width;
        shop.addChild(shop.shoppingFunds);

        //Call the drawItemsForSale function which loads and displays the shops stock
        drawItemsForSale();
        //Do some setup for the shopscene and finally push the shop to the shopScene
        shopScene.backgroundColor = '#000';
        shopScene.addChild(shop);

        //Set up our enter frame function
        //Enter frame is used for our update, because this is called every frame
        shop.on('enterframe', function () {
            update();
        });

        //Buttons, initialize the buttons and then add them to our scene
        var shopPad = new enchant.ui.Pad();
        shopPad.moveTo(0, 380);
        shopScene.addChild(shopPad);

        var shopButtonB = new enchant.ui.Button("B", "light");
        shopButtonB.moveTo(180, 450);
        shopScene.addChild(shopButtonB);

        var shopButtonA = new enchant.ui.Button("A", "blue");
        shopButtonA.moveTo(230, 410);
        shopButtonA.ontouchstart = function () {
            //When we click the A button we attempt to buy whatever we have selected
            attemptToBuy();
        };
        shopScene.addChild(shopButtonA);
    };

    //Updates the shop
    var update = function ()
    {
        //Pressing down leaves the shop
        if (game.input.down) {
            //We change the message to the farewell message
            shop.message.text = shop.farewell;
            //Then using a timeout we wait a second, and tell the game to pop a scene
            //Meaning we remove the top scene from the games scene stack
            //Image a stack of dishes, the shopScene is the top plate
            //When we popScene we remove the shopScene so it is no longer drawn
            setTimeout(function () {
                game.popScene();
                shop.message.text = shop.greeting;
            }, 1000);
            //Left changes our selection
        } else if (game.input.left) {
            //Some cool mathetical trickery happening here 
            //Item selected needs to be bound between 0 and the amount of items (game.items.length -1)
            //In order to keep it within bounds we add the itemselected value to the length
            //Then mod it by the length
            //Modding returns the remainder of division
            //So if we are on 1, and we have 4 items we get (1 + 4 - 1) % 4 which gives us 4 % 4 which gives 0 because 4/4 = 1 and has no remainder
            //If we were at 2 though we would get (2 + 4 -1) % 4 which gives us 5 % 4, which gives us 1, because 4 goes into 5 once with a remainder of 1, that is normally broken into a decimal
            shop.itemSelected = (shop.itemSelected + game.items.length - 1) % game.items.length;
            shop.itemSelector.x = 30 + 70 * shop.itemSelected;
            shop.message.text = shop.greeting;
            //Right changes our selection
        } else if (game.input.right) {
            shop.itemSelected = (shop.itemSelected + 1) % game.items.length;
            shop.itemSelector.x = 30 + 70 * shop.itemSelected;
            shop.message.text = shop.greeting;
        }
        //Now we draw the players inventory, the value passed in is the yOffset for drawing
        //Reference player.js for more info
        game.getPlayer().showInventory(100);
        //Display the players current funds
        shop.shoppingFunds.text = getShoppingFunds();
    };

    //Returns a string to print out how much gold the game.getPlayer() has
    var getShoppingFunds = function () {
        return "Gold: " + game.getPlayer().object.gp;
    };

    //Draws the maneki
    var drawManeki = function () {
        //First we set up the image, which in enchant is a surface
        //Think of a surface as a picture that you draw things to
        var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        //Next we set up the maneki object which is a sprite
        //A sprite is an object that stores properties such as an image, a position (x,y), animation frame etc
        //Reference the explanation at the top of game.js
        var maneki = new Sprite(game.spriteWidth, game.spriteHeight);
        //Set the maneki's image to the image we just created
        maneki.image = image;
        //This is an enchantjs command that takes in the information given by the sprite and draws the appropriate sprite
        image.draw(game.assets['sprites.png']);
        //The frame is another way to describe the sprites offset within the sprite sheet, change this value and watch the cat change into something else
        maneki.frame = 4;
        //Set its position, and scale
        maneki.y = 10;
        maneki.x = 10;
        maneki.scaleX = 2;
        maneki.scaleY = 2;
        //Finally add it to the shop object
        shop.addChild(maneki);
    };

    var drawItemsForSale = function () {
        for (var i = 0; i < game.items.length; i++) {
            //Same process as the Maneki
            //However here we are using a different sprite sheet, but the principles are the same
            var image = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);
            var item = new Sprite(game.spriteWidth, game.spriteHeight);
            image.draw(game.assets['items.png']);
            itemLocationX = 30 + 60 * i;
            itemLocationY = 70;
            item.y = itemLocationY;
            item.x = itemLocationX;
            item.frame = i;
            item.scaleX = 2;
            item.scaleY = 2;
            item.image = image;
            shop.addChild(item);

            //We set up the items description label
            //We set its text to be the current items description value, to see where this value is set and what it is head over to game.js line 40
            var itemDescription = new Label(game.items[i].price + "<br />" + game.items[i].description);
            itemDescription.x = itemLocationX - 8;
            itemDescription.y = itemLocationY + 40;
            itemDescription.color = '#fff';
            shop.addChild(itemDescription);

            //Now if the current item is selected, we do an extra step
            //We setup a new image, and sprite for our itemSelector object
            //It uses our sprites.png sprite sheet, in fact it is one of the player's animation frames
            //Its x position is identical to the current item, while its y is lower
            if (i === shop.itemSelected) {
                var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
                shop.itemSelector = new Sprite(game.spriteWidth, game.spriteHeight);
                image.draw(game.assets['sprites.png']);
                itemLocationX = 30 + 60 * i;
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

        //First we grab the price of the item that is currently selected
        var itemPrice = game.items[shop.itemSelected].price;
        //If the player does not have enough gold, we print out an apology
        if (game.getPlayer().object.gp < itemPrice) {
            shop.message.text = shop.apology;
        } else {
            //..but if they have the money, we remove the cost of the item and we add the item to their inventory
            //Then we print out a successful sale message
            game.getPlayer().object.gp = game.getPlayer().object.gp - itemPrice;
            game.getPlayer().inventory.push(game.items[shop.itemSelected].id);
            game.items[shop.itemSelected].effect();
            shop.message.text = shop.sale;
        }
    };

    //Returns the shops scene, this way we can pop the scene or push it outside of this objects
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
