//NPC Object File
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
//This code is stored here, but because of how JavaScript operates and the way each object is created any file can reference them

//Basic NPC
//His only property is 'say' function which prints out the passed in message
var npc = {
    say: function (game,message) {
        game.getPlayer().getStatusLabel().height = 12;
        game.getPlayer().getStatusLabel().text = message;
    }
};

//Enemy NPC
//He is your most common foe
var brawler = {
    name: "Brawler", //Needs a name doesnt he? 
    maxHp: 5, //Maximum health he can have
    hp: 5, //His current health
    sprite: 15, //His sprite within the sprite sheet, referenced within the battle.js file
    attack: 3, //His attack value refer to battle.js's enemyAttack to see how it is implemented
    exp: 3, //Experience reward when he dies
    gp: 5, //Gold reward when he dies
    action: function (game) {
        //His action sets up combat
        //First he tells the player that he is their current enemy
        //Next, he uses the passed in game object to grab the battle scene and push it to the screen
        //After that the battle scene takes over, refer to battle.js
        game.getPlayer().object.currentEnemy = this;
        game.pushScene(game.getBattle().getScene());
    }
};

//Giant Rat NPC , he is your foe within the Rat Quest
var giantRat = {
    name: "Giant Rat",//Needs a name doesnt he? 
    maxHp: 8,//Maximum health he can have
    hp: 8,//His current health
    sprite: 17,//His sprite within the sprite sheet, referenced within the battle.js file
    attack: 3,//His attack value refer to battle.js's enemyAttack to see how it is implemented
    exp: 8,//Experience reward when he dies
    gp: 15,//Gold reward when he dies
    action: function (game) {
        //His action sets up combat
        //First he tells the player that he is their current enemy
        //Next, he uses the passed in game object to grab the battle scene and push it to the screen
        //After that the battle scene takes over, refer to battle.js
        game.getPlayer().object.currentEnemy = this;
        game.pushScene(game.getBattle().getScene());
    }
}

//Angry owner npc, he is your foe within the Revenge Quest
var angryOwner = {
    name: "Miniga Ontoya",//Needs a name doesnt he? 
    maxHp: 15,//Maximum health he can have
    hp: 15,//His current health
    sprite: 18,//His sprite within the sprite sheet, referenced within the battle.js file
    attack: 3,//His attack value refer to battle.js's enemyAttack to see how it is implemented
    exp: 8,//Experience reward when he dies
    gp: 15,//Gold reward when he dies
    action: function (game) {
        //His action sets up combat
        //First he tells the player that he is their current enemy
        //Next, he uses the passed in game object to grab the battle scene and push it to the screen
        //After that the battle scene takes over, refer to battle.js
        game.getPlayer().object.currentEnemy = this;
        game.pushScene(game.getBattle().getScene());
    }
}

//Very basic NPC, he just says hi!
//His action calls the npc object (look above) and calls it's say function, and passes in the message "hello"
var greeter = {
    action: function (game) {
        npc.say(game,"hello");
    }
};

//This NPC is special, he starts the passed in quest
//Within game.js you will see he is used to start the rat quest (questdata.js), but this could be changed
var ratQuestGiver = {
    action: function (game,quest) {
        npc.say(game, "Help!!");
        quest.setQuest();
        game.pushScene(quest.getQuestScene());
        quest.isActive = true;
    }
}
//This NPC is special, he starts the passed in quest
//Within game.js you will see he is used to start the revenge quest (questdata.js), but this could be changed
var revengeQuestGiver = {
    action: function (game, quest) {
        npc.say(game, "Hey You!!");
        quest.setQuest();
        game.pushScene(quest.getQuestScene());
        quest.isActive = true;
    }
}


//Meow!
//Its our friendly feline shopkeeper
//His action brings up the shop
var cat = {
    action: function (game) {
        game.pushScene(game.getShop().getShopScene());
    }
};