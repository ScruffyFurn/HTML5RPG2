var RatQuest = {
    numOfOptions : 1,
    gold : 20,
    xp :  10,
    greeting : "HELP! A giant rat has blocked the path to town. Please help me I need to get to town!",
    acceptQuest : "Thank you kind hero!",
    rejectQuest : "Coward! I hope the rat eats you!",
    dialogueData: { 0: { text: "Will you help this villager?", option1: "Accept quest", option2: "Reject quest" } },
    activateQuest: function (game)
    {
        giantRat.action(game);
        game.getBattle().setWinFunction(
        function ()
        {
            game.getBattle().over = true;
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
                
            }

            game.getPlayer().object.hp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxHp;
            game.popScene();

            game.popFromMap(2,16);

            //Reset the battle
            game.getBattle().reset();

        });

        game.getBattle().setLossFunction(function ()
        {
            game.getBattle().over = true;
            game.getPlayer().object.hp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxHp;
            game.getPlayer().object.mp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxMp;
            game.getPlayer().object.currentEnemy.hp = game.getPlayer().object.currentEnemy.maxHp;
            game.getPlayer().object.gp = Math.round(game.getPlayer().object.gp / 2);
            game.getPlayer().object.statusLabel.text = "Quest failed!";
            game.getPlayer().object.statusLabel.height = 12;
            game.popScene();

            //Reset the battle
            game.getBattle().reset();
        });
    }
};

var RevengeQuest = {
    numOfOptions: 1,
    gold: 100,
    xp: 100,
    greeting: "You killed Wilbur! He was my pet, prepare to battle!",
    dialogueData: { 0: { text: "Will you fight this crazy person?", option1: "Accept quest", option2: "Reject quest" } },
    acceptQuest: "On guard!",
    rejectQuest: "Coward! shame shall follow you!",
    activateQuest: function (game)
    {
        angryOwner.action(game);
        game.getBattle().setWinFunction(
        function ()
        {
            game.getBattle().over = true;
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

            }

            game.getPlayer().object.hp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxHp;
            game.popScene();

            //Reset the battle
            game.getBattle().reset();


        });

        game.getBattle().setLossFunction(function ()
        {
            game.getBattle().over = true;
            game.getPlayer().object.hp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxHp;
            game.getPlayer().object.mp = game.getPlayer().object.levelStats[game.getPlayer().object.level].maxMp;
            game.getPlayer().object.currentEnemy.hp = game.getPlayer().object.currentEnemy.maxHp;
            game.getPlayer().object.gp = Math.round(game.getPlayer().object.gp / 2);
            game.getPlayer().object.statusLabel.text = "Quest failed!";
            game.getPlayer().object.statusLabel.height = 12;
            game.popScene();
            //Reset the battle
            game.getBattle().reset();
        });
    }
};