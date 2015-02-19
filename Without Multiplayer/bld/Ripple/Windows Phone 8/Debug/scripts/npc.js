//NPC Object File


//Basic NPC, can speak
var npc = {
    say: function (game,message) {
        game.getPlayer().getStatusLabel().height = 12;
        game.getPlayer().getStatusLabel().text = message;
    }
};

//Enemy NPC
var brawler = {
    name: "Brawler",
    maxHp: 5,
    hp: 5,
    sprite: 15,
    attack: 3,
    exp: 3,
    gp: 5,
    action: function (game) {
        game.getPlayer().object.currentEnemy = this;
        game.pushScene(game.getBattle().getScene());
    }
};

var giantRat = {
    name: "Giant Rat",
    maxHp: 8,
    hp: 8,
    sprite: 4,
    attack: 3,
    exp: 8,
    gp: 15,
    action: function (game) {
        game.getPlayer().object.currentEnemy = this;
        game.pushScene(game.getBattle().getScene());
    }
}

var angryOwner = {
    name: "Disgruntled Owner",
    maxHp: 15,
    hp: 15,
    sprite: 16,
    attack: 3,
    exp: 8,
    gp: 15,
    action: function (game) {
        game.getPlayer().object.currentEnemy = this;
        game.pushScene(game.getBattle().getScene());
    }
}

//He says hi and thats it
var greeter = {
    action: function (game) {
        npc.say(game,"hello");
    }
};


var ratQuestGiver = {
    action: function (game,quest) {
        npc.say(game, "Help!!");
        quest.setQuest();
        game.pushScene(quest.getQuestScene());
        quest.isActive = true;
    }
}

var revengeQuestGiver = {
    action: function (game, quest) {
        npc.say(game, "Help!!");
        quest.setQuest();
        game.pushScene(quest.getQuestScene());
        quest.isActive = true;
    }
}


//Meow!
var cat = {
    action: function (game) {
        game.pushScene(game.getShop().getShopScene());
    }
};