//Quest Handler Script
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
//When we make a quest, we make a new quest object and we pass in a reference to the game, what type of quest it is and the giverSprite sprite frame (so location on the sprite sheet)
//The quest object is rather general to allow for any quest to be passed in
var Quest = function (game, questType, giverSprite) {

    quest = new Group();//The actual 'quest' object that will hold most of our variables and do a lot of the work.
                        //A group is a collection of enchant js 'nodes' or in simple terms objects like labels
    questScene = new Scene();//Our quest scene, this is what allows us to display the quest, 
                            //we push it onto the games scene stack (meaning it shows up because its on top) then pop it when we are done

    var setQuest = function () {
        //First we set a variable to handle what choice we have selected
        //Our quests are simple so we only have 2 options ever so we use a simple bool
        quest.choiceSelected = false;

        //Quest dialog setup
        quest.greeting = questType.greeting;

        //This variable is used to store the dialogue options we have
        quest.choices = [];

        //Load in the data from the questTypes dialogue
        //Refer to questData.js to see how dialogueData is setup
        for (var key in questType.dialogueData) {
            quest.choices.push(questType.dialogueData[key]);
        }

        //Setup a way to display messages
        quest.message = new Label();
        quest.message.x = 40;
        quest.message.y = 10;
        quest.message.width = game.width;
        quest.message.color = '#fff';

        quest.message.text = quest.greeting;

        //Set up a menu label
        quest.menu = new Label();
        quest.menu.x = 20;
        quest.menu.y = 170;
        quest.menu.width = game.width;
        quest.menu.color = '#fff';

        //Add both to the quest 
        quest.addChild(quest.menu);
        quest.addChild(quest.message);

        questScene.backgroundColor = '#000';

        //Add quest to the questScene
        questScene.addChild(quest);

        //Current key for the questData
        quest.curKey = 0;

        //UI Pad and Buttons
 
        var questButtonB = new enchant.ui.Button("B", "light");
        questButtonB.moveTo(180, 450);
        questScene.addChild(questButtonB);

        var questButtonA = new enchant.ui.Button("A", "blue");
        questButtonA.moveTo(230, 410);
        //When the player presses the A button we call the performChoice function
        questButtonA.ontouchstart = function () {
            performChoice();
        };

        questScene.addChild(questButtonA);

        var questPad = new enchant.ui.Pad();
        questPad.moveTo(0, 380);
        questScene.addChild(questPad);

        //Next we draw the quest giver
        drawGiver();

        //Set the menu text
        quest.menu.text = drawOptions(quest.curKey);

        //Finally, we set an event handler so that on every frame we call update
        quest.on('enterframe', function () {
            update();
        });
    };

    performChoice = function () {
        //Here we see the generalness of the quest object
        //If choiceSelected is true, we treat that as an accept
        //So we call the questTypes acceptInput function and show the accept message
        if (quest.choiceSelected) {
            quest.message.text = questType.acceptQuest;
            questType.acceptInput(quest, game);

        } else {
            //Otherwise we call the rejectInput
            questType.rejectInput(quest, game);
        }


    };

    drawOptions = function (key) {
        //Here we load in the options from the questType
        //Pass them into quest.choicesText
        //And finally return quest.choicesText after calling join on it (array function within Javascript http://www.w3schools.com/jsref/jsref_join.asp)
        quest.choicesText = [];

        //First push the question
        quest.choicesText.push(quest.choices[key].text);

        //Then the options
        if (quest.choiceSelected) {
            //If choiceSelected is true, we treat that as they are selecting option1
            quest.choicesText.push("-->" + quest.choices[key].option1);
            quest.choicesText.push(quest.choices[key].option2);
        }
        else {
            //Otherwise option2
            quest.choicesText.push(quest.choices[key].option1);
            quest.choicesText.push("-->" + quest.choices[key].option2);
        }


        return quest.choicesText.join("<br/>");

    };

    drawGiver = function () {
        //First we set up the image, which in enchant is a surface
        //Think of a surface as a picture that you draw things to
        var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        //Next we set up the maneki object which is a sprite
        //A sprite is an object that stores properties such as an image, a position (x,y), animation frame etc
        //Reference the explanation at the top of game.js
        var giver = new Sprite(game.spriteWidth, game.spriteHeight);
        //Set the giver's image to the image we just created
        giver.image = image;
        //This is an enchantjs command that takes in the information given by the sprite and draws the appropriate sprite
        image.draw(game.assets['sprites.png']);
        //The frame is another way to describe the sprites offset within the sprite sheet, change this value and watch the cat change into something else
        giver.frame = giverSprite;
        //Set its position, and scale
        giver.y = 10;
        giver.x = 10;
        giver.scaleX = 2;
        giver.scaleY = 2;
        //Finally add it to the quest object
        quest.addChild(giver);
    };


    update = function () {
        //Our update function
        //We use the timeout
            //If you press up, choiceSelected is set to true
            if (game.input.up) {
                quest.choiceSelected = true;
            } else if (game.input.down) {
                //If down, its false
                quest.choiceSelected = false;
            }
            //After input, we set the quests menu text to the drawOptions return
            quest.menu.text = drawOptions(quest.curKey);

    };

    //Returns the quest Scene
    getQuestScene = function () {
        return questScene;
    }

    return {
        object: quest,
        update: update,
        getQuestScene: getQuestScene,
        setQuest: setQuest,
    }

};