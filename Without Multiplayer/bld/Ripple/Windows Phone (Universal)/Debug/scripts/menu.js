//Title Menu Script
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
var Menu = function (game) {

    var menu = new Group();//The actual 'menu' object that will hold most of our variables and do a lot of the work.
                           //A group is a collection of enchant js 'nodes' or in simple terms objects like labels

    var menuScene = new Scene();//Our menu scene, this is what allows us to display the menu to the player
                                //we push it onto the games scene stack (meaning it shows up because its on top) then pop it when we are done


    //Sets up the menu
    var setMenu = function () {
        //First we set up the background we need to draw
        //Lets start with an image, which in this case we will initialize as a Surface
        //Think of a surface as a picture that you draw things to
        menu.image = new Surface(280, 380);
        //We use the titleScreen.png
        menu.image.draw(game.assets['titleScreen.png']);
        //Set the menu scenes background color
        menuScene.backgroundColor = '#000';
        //Finally we add the image to the menuScene
        menuScene.addChild(menu.image);

        //Buttons
        var menuButtonB = new enchant.ui.Button("B", "light");
        menuButtonB.moveTo(180, 450);
        //Add the B button to the scene
        menuScene.addChild(menuButtonB);

        var menuButtonA = new enchant.ui.Button("A", "blue");
        menuButtonA.moveTo(230, 410);
        menuButtonA.ontouchstart = function () {
            //If the player clicks the A button, we stop the background music
            //We pop this scene (so we dont see it)
            //Then we call the games setGame function, refer to the game.js to see this function in action
            game.titleBackgroundMusic.stop();
            game.popScene();
            game.setGame();
        };
        //Add the A button to the scene
        menuScene.addChild(menuButtonA);

        //Menu pad
        var menuPad = new enchant.ui.Pad();
        menuPad.moveTo(0, 380);
        //Add the Pad to the scene
        menuScene.addChild(menuPad);

        //Push the scene to the top of the stack, that way we will see it
        game.pushScene(menuScene);

        //Here we get our title screens background music track and then begin playing it
        game.titleBackgroundMusic = game.assets['hyperspaceadventure.mp3'];
        game.titleBackgroundMusic.play();

        menu.on('enterframe', function (e) {
            //Music update
            //Music update
            if (game.titleBackgroundMusic.currentTime >= game.titleBackgroundMusic.duration)
                game.titleBackgroundMusic.play();
        });
    };

    //Returns the menu scene
    var getScene = function () {
        return menuScene;
    };

    //Shows the menu
    //The death parameter determines what background to draw
    //If true, we draw the deathscreen
    //If false, we draw the titlescreen
    //This function is currently only called when the player dies (within the player.js playerDeath function)
    var showMenu = function (death) {

        if (death)
            menu.image.draw(game.assets['deathScreen.png']);
        else 
            menu.image.draw(game.assets['titleScreen.png']);
            
        game.pushScene(menuScene);
            
    };

    //Returns
    //This allows us access to the getScene, setMenu and showMenu functions
    return {
        setMenu: setMenu,
        showMenu:showMenu,
        getScene : getScene
    };
};