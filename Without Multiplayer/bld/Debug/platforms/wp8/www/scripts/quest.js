//Quest factory
//We pass in a quest type and it passes us back a full quest in its own special Javascript way
var Quest = function (game, questType, giverSprite) {

    quest = new Group();
    questScene = new Scene();

    var setQuest = function () {
        quest.choiceSelected = false;

        //Quest dialog setup
        quest.greeting = questType.greeting;

        quest.choices = [];

        //Load in the data from the questTypes dialogue
        for (var key in questType.dialogueData) {
            quest.choices.push(questType.dialogueData[key]);
        }

        //Set the rewards 
        quest.gold = questType.gold;
        quest.xp = questType.xp;

        //Setup a way to display messages
        quest.message = new Label();
        quest.message.x = 40;
        quest.message.y = 10;
        quest.message.width = window.screen.width;
        quest.message.color = '#fff';

        quest.message.text = quest.greeting;

        //Set up a menu
        quest.menu = new Label();
        quest.menu.x = 20;
        quest.menu.y = 170;
        quest.menu.color = '#fff';

        quest.addChild(quest.menu);
        quest.addChild(quest.message);

        questScene.backgroundColor = '#000';


        questScene.addChild(quest);

        //Current key for the questData
        quest.curKey = 0;

        //UI Pad and Buttons
 
        var questButtonB = new enchant.ui.Button("B", "light");
        questButtonB.moveTo(180, 450);
        questScene.addChild(questButtonB);

        var questButtonA = new enchant.ui.Button("A", "blue");
        questButtonA.moveTo(230, 410);

        questButtonA.ontouchstart = function () {
            performChoice();
        };

        questScene.addChild(questButtonA);

        var questPad = new enchant.ui.Pad();
        questPad.moveTo(0, 380);
        questScene.addChild(questPad);

        drawGiver();

        //Set the menu text
        quest.menu.text = drawOptions(quest.curKey);


        quest.on('enterframe', function () {
            update();
        });
    };

    performChoice = function () {
        if (quest.choiceSelected) {
            quest.message.text = questType.acceptQuest;
            setTimeout(function () {
                quest.message.text = quest.greeting;
                game.popScene();
                questType.activateQuest(game);
            }, 1000);

        } else {
            quest.message.text = questType.rejectQuest;
            setTimeout(function () {
                quest.message.text = quest.greeting;
                game.popScene();
            }, 1000);
        }
    };

    drawOptions = function (key) {
        quest.choicesText = [];

        //First push the question
        quest.choicesText.push(quest.choices[key].text);

        //Then the options
        if (quest.choiceSelected) {
            quest.choicesText.push("-->" + quest.choices[key].option1);
            quest.choicesText.push(quest.choices[key].option2);
        }
        else {
            quest.choicesText.push(quest.choices[key].option1);
            quest.choicesText.push("-->" + quest.choices[key].option2);
        }


        return quest.choicesText.join("<br/>");

    };

    drawGiver = function () {
        var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
        var giver = new Sprite(game.spriteWidth, game.spriteHeight);
        giver.image = image;
        image.draw(game.assets['sprites.png']);
        giver.frame = giverSprite;
        giver.y = 10;
        giver.x = 10;
        giver.scaleX = 2;
        giver.scaleY = 2;
        quest.addChild(giver);
    };


    update = function () {
        setTimeout(function () {
            if (game.input.up) {
                quest.choiceSelected = true;
            } else if (game.input.down) {
                quest.choiceSelected = false;
            }
            quest.menu.text = drawOptions(quest.curKey);

        }, 500);
    };

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