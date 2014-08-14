//
//  Game1UI.cpp
//  demo
//
//  Created by li zaoji on 7/15/14.
//
//
var GameUI = cc.Layer.extend({

    init: function(){
        this._super();
        //初始化游戏标题
        var gameTitle = cc.LabelTTF.create("2048 Demo", "Helvetica", 55);
        gameTitle.setColor(GAME1_COLOR_DARKFONT);
        gameTitle.setPosition(600, 518);
        gameTitle.setAnchorPoint(cc.p(0, 0));
        this.addChild(gameTitle);

        //score框
        var scoreLayer = cc.LayerColor.create(GAME1_COLOR_LABELBGCOLOR, 135, 70);
        var scoreLabel = cc.LabelTTF.create("SCORE", "Helvetica", 20);
        scoreLabel.setColor(GAME1_COLOR_LABELFONTCOLOR);
        scoreLabel.setPosition(scoreLayer.getContentSize().width / 2, 50);
        scoreLayer.addChild(scoreLabel);
        var scoreNum = cc.LabelTTF.create("0", "Helvetica", 25);
        scoreNum.setTag(1);
        scoreNum.setColor(GAME1_COLOR_LIGHTFONT);
        scoreNum.setPosition(scoreLayer.getContentSize().width / 2, 22);
        scoreLayer.addChild(scoreNum);
        scoreLayer.setPosition(600, 430);
        scoreLayer.setTag(1);
        this.addChild(scoreLayer);

        //best框
        var bestLayer = cc.LayerColor.create(GAME1_COLOR_LABELBGCOLOR, 135, 70);
        var bestLabel = cc.LabelTTF.create("BEST", "Helvetica", 20);
        bestLayer.setColor(GAME1_COLOR_LABELFONTCOLOR);
        bestLayer.setPosition(bestLayer.getContentSize().width / 2, 50);
        bestLayer.addChild(bestLabel);
        var bestNum = cc.LabelTTF.create("0", "Helvetica", 25);
        bestNum.setTag(1);
        bestNum.setColor(GAME1_COLOR_LIGHTFONT);
        bestNum.setPosition(bestLayer.getContentSize().width / 2, 22);
        bestLayer.addChild(bestNum);
        bestLayer.setPosition(755, 430);
        bestLayer.setTag(2);
        this.addChild(bestLayer);

//        //new game按钮
//        var newGame = MenuItemImage.create("newgame.png", "newgame.png", CC_CALLBACK_1(Game1UI.newGame, this));
//        newGame.setAnchorPoint(cc.p(0,0));
//        newGame.setPosition(600, 345);
//        MenuItemImage * back = MenuItemImage.create("back.png", "back.png", CC_CALLBACK_1(Game1UI.back, this));
//        back.setAnchorPoint(cc.p(0,0));
//        back.setPosition(810, 345);
//        Menu * menu = Menu.create(newGame, back, NULL);
//        menu.setPosition(0, 0);
//        this.addChild(menu);
//
//        //game over
//        Sprite * gameOver = Sprite.create("gameOver.png");
//        gameOver.setAnchorPoint(cc.p(0, 0));
//        gameOver.setPosition(600, 240);
//        gameOver.setTag(3);
//        this.addChild(gameOver);
//        gameOver.setVisible(false);
        return true;
    }

//void Game1UI.newGame(Ref* obj){
//    Game1Scene * gameScene = (Game1Scene * )this.getParent();
//    gameScene.newGame();
//    log("new game");
//}
//
//void Game1UI.back(Ref* obj){
//    log("back");
//    Director.getInstance().end();
//    #if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
//        exit(0);
//    #endif
//}
});



