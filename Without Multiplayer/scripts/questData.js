//Quest Data File
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
//Within this file we store different quests for the player
//A quest object reads this data and responds accordingly
//As long as each quest follows the same design pattern everything runs smoothly
//Happy questing :)

var RatQuest = {
    gold : 20, //Gold reward when you complete the quest
    xp :  10, //XP reward when you complete the quest
    greeting : "HELP! A giant rat has blocked the path to town. Please help me I need to get to town!", //Quest greeting
    acceptQuest : "Thank you kind hero!",//What is said when you accept the quest
    rejectQuest : "Coward! I hope the rat eats you!",//What is said when you reject the quest
    dialogueData: { 0: { text: "Will you help this villager?", option1: "Accept quest", option2: "Reject quest" } },//Where our possible multi stage dialogue can occur, this quest is simple and we only have one choice
    activateQuest: function (game)
    {
        //When the quest is activated, we call the giant rats action function from the npc.js
        giantRat.action(game);
        //Then we set the battles win function
        //By default, the battles win function, updates your health/mana/xp etc and the function we pass in is very close to that original
        //The difference is in the end
        game.getBattle().setWinFunction(
        function ()
        {
            game.getBattle().over = true;
            //The amount of xp and gold that is rewarded is set to the quests gold/xp versus the enemys xp/gold
            game.getPlayer().object.exp += RatQuest.xp;
            game.getPlayer().object.gp += RatQuest.gold;
            game.getPlayer().object.currentEnemy.hp = game.getPlayer().object.currentEnemy.maxHp;
            game.getPlayer().object.statusLabel.text = "You defeated the Giant Rat! Quest Complete!<br />" +
                "You gained " + RatQuest.xp + " exp<br />" +
                "and " + RatQuest.gold + " gold pieces!";
            game.getPlayer().object.statusLabel.height = 45;
            if (game.getPlayer().object.exp > game.getPlayer().object.levelStats[game.getPlayer().object.level].expMax && game.getPlayer().object.level < game.getPlayer().object.levelStats.length - 1) {
                game.getPlayer().object.level += 1;
                game.getPlayer().object.statusLabel.text = game.getPlayer().object.statusLabel.text +
                    "<br />And you gained a level!" +
                    "<br />You are now at level " + game.getPlayer().object.level + "!";
                game.getPlayer().object.statusLabel.height = 75;

                game.getPlayer().object.mp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxMp;
                
            }
            game.getPlayer().object.hp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxHp;

            //This part is new, after we reward the player we pop the scene
            //The scene we are popping is the battle scene
            game.popScene();

            //Then we get rid of the rat quest giver and replace him with the revenge quest giver
            //18 is the value for the revenge quest giver
            //We can use the player's get facing square function to get its row and column, and since we know that
            //that square is the one where the quest giver is located, we just pass it in
            var facing = game.getPlayer().facingSquare();
            game.replaceObjOnMap(facing.x, facing.y, 18);

            //Reset the battle
            //This function resets the battles win and loss functions
            game.getBattle().reset();

        });

        //Like the win function, this function is nearly identical to the defaul loss 
        //The difference is that we print out quest failed instead of you lost
        game.getBattle().setLossFunction(function ()
        {
            game.getBattle().over = true;
            game.popScene();
            game.getPlayer().object.statusLabel.text = "Quest failed! The Rat defeated you";
            game.getPlayer().object.statusLabel.height = 12;

            //Call the player's death function
            setTimeout(function ()
            {
                game.getPlayer().playerDeath();
            }, 1000);

            //Reset the battle
            game.getBattle().reset();
        });
    },
    acceptInput: function (quest, game) {
        //This handles accept input
        //We display the accept quest text
        //Then we wait a second and activate RatQuest
        quest.message.text = RatQuest.acceptQuest;
        setTimeout(function () {
            //Reset the quests message text
            //Pop the scene
            quest.message.text = quest.greeting;
            game.popScene();
            RatQuest.activateQuest(game);
        }, 1000);

    },

    rejectInput: function (quest, game) {
        //This handles reject input
        //We display the reject quest text
        quest.message.text = RatQuest.rejectQuest;
        setTimeout(function () {
            //Reset the quests message text
            //Pop the scene
            quest.message.text = quest.greeting;
            game.popScene();
        }, 1000);
    }
};

var RevengeQuest = {
    gold: 100,//Gold reward when you complete the quest
    xp: 20,//XP reward when you complete the quest
    greeting: "You killed Wilbur! He was my pet, prepare to battle!",//Quest greeting
    dialogueData: {//Where our possible multi stage dialogue can occur, this quest is simple and we only have one choice
        0: { text: "What do you have to say?", option1: "Who are you", option2: "Flee" },
        1: { text: "My name is Miniga Ontoya! You killed my rat! Prepare to die!", option1: "Fight!!", option2: "Flee!!" }
    },
    acceptQuest: "On guard!",//What is said when you accept the quest
    rejectQuest: "Coward! shame shall follow you!",//What is said when you reject the quest
    activateQuest: function (game)
    {
        //When the quest is activated, we call the angryOwner's action function from the npc.js
        angryOwner.action(game);
        //Then we set the battles win function
        //By default, the battles win function, updates your health/mana/xp etc and the function we pass in is very close to that original
        //The difference is in the end
        game.getBattle().setWinFunction(
        function ()
        {
            game.getBattle().over = true;
            //The amount of xp and gold that is rewarded is set to the quests gold/xp versus the enemys xp/gold
            game.getPlayer().object.exp += RevengeQuest.xp;
            game.getPlayer().object.gp += RevengeQuest.gold;
            game.getPlayer().object.currentEnemy.hp = game.getPlayer().object.currentEnemy.maxHp;
            game.getPlayer().object.statusLabel.text = "You defeated the crazy person! Quest Complete!<br />" +
                "You gained " + RevengeQuest.xp + " exp<br />" +
                "and " + RevengeQuest.gold + " gold pieces!";
            game.getPlayer().object.statusLabel.height = 45;
            if (game.getPlayer().object.exp > game.getPlayer().object.levelStats[game.getPlayer().object.level].expMax && game.getPlayer().object.level < game.getPlayer().object.levelStats.length - 1) {
                game.getPlayer().object.level += 1;
                game.getPlayer().object.statusLabel.text = game.getPlayer().object.statusLabel.text +
                    "<br />And you gained a level!" +
                    "<br />You are now at level " + game.getPlayer().object.level + "!";
                game.getPlayer().object.statusLabel.height = 75;

                game.getPlayer().object.mp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxMp;

            }

            game.getPlayer().object.hp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxHp;

            //This part is new, after we reward the player we pop the scene
            //The scene we are popping is the battle scene
            game.popScene();

            //We can use the player's get facing square function to get its row and column, and since we know that
            //that square is the one where the quest giver is located, we just pass it in
            var facing = game.getPlayer().facingSquare();
            game.replaceObjOnMap(facing.x, facing.y, -1);

            //Reset the battle
            //This function resets the battles win and loss functions
            game.getBattle().reset();


        });

        //Like the win function, this function is nearly identical to the defaul loss 
        //The difference is that we print out quest failed instead of you lost
        game.getBattle().setLossFunction(function ()
        {
            game.getBattle().over = true;
            game.popScene();
            game.getPlayer().object.statusLabel.text = "Quest failed! You were defeated by " + angryOwner.name;
            game.getPlayer().object.statusLabel.height = 12;

            //Call the player's death function
            setTimeout(function () {
                game.getPlayer().playerDeath();
            }, 1000);
            //Reset the battle
            game.getBattle().reset();
        });
    },
    acceptInput: function(quest,game)
    {
        //Increase the key value for the passed in quest object
        //CurKey is the quests position within our dialogue data
        if(quest.curKey == 0)
        {
            quest.curKey++;
        }
        //Begin combat by calling the activate quest function
        else if (quest.curKey == 1)
        {
            quest.message.text = RevengeQuest.acceptQuest;
            setTimeout(function () {
                quest.message.text = quest.greeting;
                game.popScene();
                RevengeQuest.activateQuest(game);
            }, 1000);
            
        }
    },
    rejectInput: function(quest,game)
    {
        //Show the revenge quests reject quest text
        quest.message.text = RevengeQuest.rejectQuest;
        //Pop the scene
        setTimeout(function () {
            //We wait a second and then we reset the quests curKey value to 0
            //The quests message to its store greeting
            //Finally we pop the scene
            quest.curKey = 0;
            quest.message.text = quest.greeting;
            game.popScene();
        }, 1000);

    }

};