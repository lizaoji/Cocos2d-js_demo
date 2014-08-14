/**
 * Created by lizaoji on 7/24/14.
 */
var MetroScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var metroLayer = new MetroLayer();
        metroLayer.init();
        this.addChild(metroLayer);
    }
});

var MetroLayer = cc.LayerColor.extend({
    initial_time: 15,
    time:0,
    level: 1,
    minScore: 0,
    curScore: 0,

    ctor: function(){
       this._super();
    },

    init: function(){
        this._super();
        //背景层
        var BgLayer = cc.LayerColor.create(cc.color(255,255,255,255), 960, 640);
        //车门
        BgLayer.setTag(1);
        var doorSprY = cc.Sprite.create(res.door);
        doorSprY.setPosition(doorSprY.getContentSize().width / 2 + 10, doorSprY.getContentSize().height / 2 + 150) ;
        BgLayer.addChild(doorSprY);
        //Title
        var title = cc.Sprite.create(res.title);
        title.setAnchorPoint(cc.v2f(0,0));
        title.setPosition(165, 550);
        BgLayer.addChild(title);
        //支架
        var zhijia = cc.Sprite.create(res.zhijia);
        zhijia.setAnchorPoint(cc.v2f(1,1));
        zhijia.setPosition(960, 640);
        BgLayer.addChild(zhijia);
        //时间显示牌
        var showBoard_Time = cc.LayerColor.create(SHOWBOARD_TIME_LAYER_COLOR, 150, 80);
        showBoard_Time.setPosition(960 - zhijia.getContentSize().width, 640 - zhijia.getContentSize().height - showBoard_Time.getContentSize().height);
        showBoard_Time.setTag(1);
        var Label_Time_Static = cc.LabelTTF.create("Count Down", res.font_futura, 18);
        Label_Time_Static.setPosition(showBoard_Time.getContentSize().width / 2, 60);
        Label_Time_Static.setColor(SHOWBOARD_FONT_COLOR);
        showBoard_Time.addChild(Label_Time_Static);

        var Label_Time = cc.LabelTTF.create("999", res.font_futura, 30);
        Label_Time.setPosition(showBoard_Time.getContentSize().width / 2, 30);
        Label_Time.setColor(SHOWBOARD_FONT_COLOR);
        Label_Time.setTag(1);
        showBoard_Time.addChild(Label_Time);

        //级别显示牌
        var showBoard_Lvl = cc.LayerColor.create(SHOWBOARD_LVL_LAYER_COLOR, 100, 80);
        showBoard_Lvl.setPosition(155 + 960 - zhijia.getContentSize().width, 640 - zhijia.getContentSize().height - showBoard_Lvl.getContentSize().height);
        showBoard_Lvl.setTag(2);
        var Label_Lvl_Static = cc.LabelTTF.create("Level ", res.font_futura, 18);
        Label_Lvl_Static.setPosition(showBoard_Lvl.getContentSize().width / 2, 60);
        Label_Lvl_Static.setColor(SHOWBOARD_FONT_COLOR);
        showBoard_Lvl.addChild(Label_Lvl_Static);

        var Label_Lvl = cc.LabelTTF.create("99", res.font_futura, 30);
        Label_Lvl.setPosition(showBoard_Lvl.getContentSize().width / 2, 30);
        Label_Lvl.setColor(SHOWBOARD_FONT_COLOR);
        Label_Lvl.setTag(1);
        showBoard_Lvl.addChild(Label_Lvl);

        //最少分数显示牌
        var showBoard_MinScore = cc.LayerColor.create(SHOWBOARD_MIN_SCORE_LAYER_COLOR, 200, 100);
        showBoard_MinScore.setPosition(165, 425);
        showBoard_MinScore.setTag(3);
        var Label_MinScore_Static = cc.LabelTTF.create("Min Score ", res.font_futura, 30);
        Label_MinScore_Static.setPosition(showBoard_MinScore.getContentSize().width / 2, 72);
        Label_MinScore_Static.setColor(cc.color(255,255,255));
        showBoard_MinScore.addChild(Label_MinScore_Static);

        var Label_MinScore = cc.LabelTTF.create("9999", res.font_futura, 40);
        Label_MinScore.setPosition(showBoard_MinScore.getContentSize().width / 2, 30);
        Label_MinScore.setColor(cc.color(255,255,255));
        Label_MinScore.setTag(1);
        showBoard_MinScore.addChild(Label_MinScore);

        //当前分数显示牌
        var showBoard_CurScore = cc.LayerColor.create(SHOWBOARD_CURRENT_SCORE_LAYER_COLOR, 200, 100);
        showBoard_CurScore.setPosition(400, 425);
        showBoard_CurScore.setTag(4);
        var Label_CurScore_Static = cc.LabelTTF.create("Cur Score ", res.font_futura, 30);
        Label_CurScore_Static.setPosition(showBoard_CurScore.getContentSize().width / 2, 72);
        Label_CurScore_Static.setColor(cc.color(255,255,255));
        showBoard_CurScore.addChild(Label_CurScore_Static);

        var Label_CurScore = cc.LabelTTF.create("9999", res.font_futura, 40);
        Label_CurScore.setPosition(showBoard_CurScore.getContentSize().width / 2, 30);
        Label_CurScore.setColor(cc.color(255,255,255));
        Label_CurScore.setTag(1);
        showBoard_CurScore.addChild(Label_CurScore);

        //新游戏
        var newGame = cc.Sprite.create(res.newgame);
        newGame.setPosition(WIN_SIZE_WIDTH * 0.905, WIN_SIZE_HEIGHT * 0.15);
        newGame.setTag(5);
        newGame.setName("newgame");
        BgLayer.addChild(newGame);

        //游戏结束
        var gameOver = cc.LabelTTF.create("", res.font_futura, 32);
        gameOver.setColor(cc.color(0,0,0));
        gameOver.setPosition(WIN_SIZE_WIDTH * 0.6, WIN_SIZE_HEIGHT * 0.15);
        gameOver.setTag(6);
        gameOver.setName("gameover");
        BgLayer.addChild(gameOver);

        BgLayer.addChild(showBoard_Lvl);
        BgLayer.addChild(showBoard_Time);
        BgLayer.addChild(showBoard_MinScore);
        BgLayer.addChild(showBoard_CurScore);
        this.addChild(BgLayer);

        //站台Layer，具体添加站台内容放在newPassenger
        var stationLayer = cc.LayerColor.create(STATION_COLOR, STATION_WIDTH, STATION_HEIGHT);
        stationLayer.setTag(2);
        stationLayer.setPosition(165, 150);
        this.addChild(stationLayer);

        //点击事件监听
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                var point = touch.getLocation();
                for (var i = 0; i < allPassenger.length; i++) {
                    var passenger = allPassenger[i];
                    if (!passenger.isOnEnter) {
                        var t = this._node.getChildByTag(2).getPositionX();
                        var k = passenger.getPositionX();
                        var rect = cc.rect(passenger.getPositionX() + this._node.getChildByTag(2).getPositionX(),
                                passenger.getPositionY() + this._node.getChildByTag(2).getPositionY(),
                            PASSENGER_WIDTH,
                            PASSENGER_HEIGHT);
                        if(cc.rectContainsPoint(rect, point)){
                            this._node.letPassengerEnter(i);
                            return true;
                        }
                    }
                }

                var newgame = this._node.getChildByTag(1).getChildByTag(5);
                var rect = cc.rect(newgame.getPositionX() - newgame.getContentSize().width / 2,
                    newgame.getPositionY() - newgame.getContentSize().height / 2,
                    newgame.getContentSize().width,
                    newgame.getContentSize().height);
                if( cc.rectContainsPoint(rect, point)){
                    this._node.newgame();
                    return true;
                }
                return false;
            }
        });

        cc.eventManager.addListener(listener, this);
        //游戏主逻辑
        this.time = this.initial_time / UNIT_TIME;
        this.minScore = this.level * 30 + 30;
        //往站台添加乘客，最开始全部重新添加
        this.updatePassenger(true);
        //初始化时间、界面
        this.updateUI();
        //倒计时，后续逻辑处理交由schedule，0.1秒countdown一次
        this.schedule(this.countDown, UNIT_TIME, this.time, 0);
        //判断适应
        return true;
    },

    letPassengerEnter: function(index){
        //把上车乘客加入到上车队列中，并且修改status和提高一些位置
        var passenger = allPassenger[index];
        enterPassenger.push(passenger);
        passenger.isOnEnter = true;
        var status_position = passenger.getChildByTag(2).getPosition();
        passenger.removeChildByTag(2);
        var status = cc.Sprite.create(res.enter);
        status.setTag(2);
        status.setPosition(status_position);
        passenger.addChild(status);
        passenger.setPositionY(passenger.getPositionY() + 30);
        var process = passenger.getChildByTag(3);
        process.setVisible(true);
        process.runAction(cc.ScaleTo.create(passenger.needTotalTime * UNIT_TIME, 0, 1));
    },

    countDown: function(dt){
        //死亡判定
        if (this.time == 0) {
            var gameover = this.getChildByTag(1).getChildByTag(6);
            if (this.curScore < this.minScore) {
                gameover.setString("你输了，未达到最低分要求。");
                this.level = 0;
            }
            else if (enterPassenger.length > 0){
                gameover.setString("你输了，有乘客被夹到");
                this.level = 0;
            }
            else{
                gameover.setString("恭喜过关!");
                this.level++;
            }
        }
        //如果时间还未到0，移动剩下的乘客，更新新乘客进来
        else{
            this.time--;
            //更新时间,删除已上车乘客
            if (enterPassenger.length > 0){
                for (var i = 0; i < enterPassenger.length; i++){
                    var passenger = enterPassenger[i];
                    passenger.costTime++;
                    if (passenger.costTime >= passenger.needTotalTime) {
                        cc.log("%d乘客已经上车",passenger.col);
                        //加分并移除该乘客
                        this.curScore += passenger.value;
                        this.getChildByTag(2).removeChild(passenger);

                        enterPassenger[i] = null;
                        allPassenger[passenger.col] = null;

                    }
                }
                allPassenger = this.clearArray(allPassenger);
                enterPassenger = this.clearArray(enterPassenger);
            }
            this.updateUI();
            this.updatePassenger(false);
            //cc.log("allPassenger: %d",allPassenger.length);
            //cc.log("enterPassenger: %d",enterPassenger.length);
        }


    },
    updatePassenger: function(allUpdate){
        var stationLayer = this.getChildByTag(2);
        if (allUpdate) {
            allPassenger = [];
            enterPassenger = [];
            stationLayer.removeAllChildren();
        }
        //如果不是全部重新添加，要移动位置变动后的乘客
        else{
            for(var i = 0; i < allPassenger.length; i++){
                var passenger = allPassenger[i];
                if (passenger.col != i) {
                    passenger.moveTo(i);
                }
            }
        }
        for (var i = allPassenger.length; i < PASSENGER_NUM; i++) {
            var passenger = new Passenger(Math.floor(Math.random() * 10000) % CHARACTOR_NUM, i);
            stationLayer.addChild(passenger);
            allPassenger.push(passenger);
        }
    },

    updateUI: function(){
        //准备游戏的各种变动UI
        var BgLayer = this.getChildByTag(1);
        var label_time = (BgLayer.getChildByTag(1).getChildByTag(1));
        label_time.setString(this.time.toString());
        var label_lvl = (BgLayer.getChildByTag(2).getChildByTag(1));
        label_lvl.setString(this.level.toString());
        var label_minScore = (BgLayer.getChildByTag(3).getChildByTag(1));
        label_minScore.setString(this.minScore.toString());
        var label_CurScore = (BgLayer.getChildByTag(4).getChildByTag(1));
        label_CurScore.setString(this.curScore.toString());
    },

    newgame: function(){
        var gameover = this.getChildByTag(1).getChildByTag(6).setString("");
        this.time = this.initial_time  / UNIT_TIME;
        this.minScore = this.level * 30 + 30;
        this.curScore = 0;
        this.updateUI();
        this.updatePassenger(true);
        this.schedule(this.countDown, UNIT_TIME, this.time, 0);
    },

    clearArray: function(array){
        var newArray = [];
        for (var i = 0; i < array.length; i++){
            if(array[i] != null)
                newArray.push(array[i]);
        }
        return newArray;
    }
});