var gLayers = {},
    gWinHeight = 0,
    gWinWidth = 0,
    gVisibleHeight = 0;

var GameLayer = cc.LayerColor.extend({
    totolTime: 0,
    item_condition:{
        func_addhp:{
            nextTime: 0,
            timeIntervalBase: 30,
            timeIntervalRandom: 10
        },
        func_clean:{
            nextCount: 0,
            countBase: 50,
            countLevel: 1,
            countRandom: 10
        }
    },
    timeUnit: 0.1,
    intervalTime_slow: 0.20,
    intervalTime_fast: 0.05,
    intervalTime_cur: null,
    intervalTime_reduce: 0,
    super_time: 60,
    items:[],
    clickCount: 0,
    slowTime:0,
    IsSlowDown: false,
    hp:3,
    UI:{
        upper_scroll:null,
        time:null,
        hp:null,
        level:null
    },
    colorValue:{
        black:cc.color(0,0,0),
        white:cc.color(255,255,255)
    },
    level:0,

    ctor:function () {
        this._super();
        this.setColor(this.colorValue.white);
        this.intervalTime_reduce = (this.intervalTime_slow - this.intervalTime_fast) / (-this.super_time);

        gWinHeight = cc.director.getVisibleSize().height;
        gWinWidth = cc.director.getVisibleSize().width;
        gVisibleHeight =  gWinHeight * 9 / 10;
    },

    init:function(){
        //添加监听事件
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.touchCheck
        }), this);

        //顶部条幅
        this.UI.upper_scroll = cc.LayerColor.create(this.colorValue.black, gWinWidth, gWinHeight * 1/10);
        this.UI.upper_scroll.attr({
            x:0,
            y:gWinHeight - this.UI.upper_scroll.height
        });
        this.addChild(this.UI.upper_scroll, 999);
        //生命值
        this.UI.hp_label = cc.LabelTTF.create("Life",'Helvetica', 30);
        this.UI.hp_label.attr({
            x: this.UI.upper_scroll.width * 4 / 7,
            y: this.UI.upper_scroll.height * 2.2 / 3,
            color:this.colorValue.white
        });
        this.UI.upper_scroll.addChild(this.UI.hp_label);

        this.UI.hp = cc.LabelTTF.create(this.hp.toString(),'Helvetica', 50);
        this.UI.hp.attr({
            x: this.UI.upper_scroll.width * 4 / 7,
            y: this.UI.upper_scroll.height / 2.8,
            color:this.colorValue.white
        });
        this.UI.upper_scroll.addChild(this.UI.hp);

        //坚持时间
        this.UI.time_label = cc.LabelTTF.create("Time",'Helvetica', 30);
        this.UI.time_label.attr({
            x: this.UI.upper_scroll.width * 2 / 7,
            y: this.UI.upper_scroll.height * 2.2 / 3,
            color:this.colorValue.white
        });
        this.UI.upper_scroll.addChild(this.UI.time_label);

        this.UI.time = cc.LabelTTF.create(this.aliveTime(),'Helvetica', 50);
        this.UI.time.attr({
            x: this.UI.upper_scroll.width * 2 / 7,
            y: this.UI.upper_scroll.height / 2.8,
            color:this.colorValue.white
        });
        this.UI.upper_scroll.addChild(this.UI.time);

        //难度
        this.UI.level_label = cc.LabelTTF.create("Level",'Helvetica', 30);
        this.UI.level_label.attr({
            x: this.UI.upper_scroll.width * 6 / 7,
            y: this.UI.upper_scroll.height * 2.2 / 3,
            color:this.colorValue.white
        });
        this.UI.upper_scroll.addChild(this.UI.level_label);

        this.UI.level = cc.LabelTTF.create(this.getLevel(),'Helvetica', 50);
        this.UI.level.attr({
            x: this.UI.upper_scroll.width * 6 / 7,
            y: this.UI.upper_scroll.height / 2.8,
            color:this.colorValue.white
        });
        this.UI.upper_scroll.addChild(this.UI.level);

        //对加血和清屏道具进行条件初始化
        this.resetCondition_addhp();
        this.resetCondition_clean();

        //添加计划任务
        this.schedule(this.updateGame, this.timeUnit, cc.kCCRepeatForever, 0);
    },

    touchCheck:function(touch, event){
        var self = event.getCurrentTarget();
        var point = touch.getLocation();
        var shoot_hole = new cc.Sprite(res.shoot_hole);
        shoot_hole.attr({
            x:point.x,
            y:point.y
        });
        shoot_hole.runAction(cc.Sequence.create(
            cc.FadeOut.create(0.2),
            cc.CallFunc.create(function(sender){
                self.removeChild(sender);
            }, self)));
        self.addChild(shoot_hole);
        //倒序判断，数组下标越大的是越后面添加的，所以应该在更上层
        for (var i = self.items.length - 1; i >= 0; i--) {
            var s = self.items[i].sprite;
            var rect = new cc.rect(
                s.x - s.width / 2,
                s.y - s.height,
                s.width, s.height);
            if (cc.rectContainsPoint(rect, point)) {
                self.itemTakeEffect(self.items[i]);
                break;
            }
        }
        return true;
    },

    updateGame:function(){
        //更新时间类参数
        this.totolTime += this.timeUnit;
        for(var i in gCoolDownCount){
            gCoolDownCount[i] = Math.max(0, gCoolDownCount[i]-this.timeUnit);
        }
        this.UI.time.setString(this.aliveTime());
        if(this.intervalTime_cur <= 0 || this.intervalTime_cur == null ){
            var item = null;
            if(this.totolTime >= this.item_condition.func_addhp.nextTime) {
                item = new Item("func_addhp");
                this.resetCondition_addhp();
            }
            else if(this.clickCount >= this.item_condition.func_clean.nextCount  && gStillExist.virus >= gItemInfo.func_clean.needItems) {
                item = new Item("func_clean");
                this.resetCondition_clean();
            }
            else
                item = new Item();
            this.items.push(item);
            this.addChild(item.sprite);
            //如果目前处于减速状态，则新产生的item，要修改其Action
            if(this.slowTime > 0){
                var v_origin = (gVisibleHeight + item.sprite.height) / item.t;
                var v_slow = v_origin / 2;
                var slow_end = v_slow * this.slowTime;
                var left_s_beforeSlow = gVisibleHeight + item.sprite.height - item.sprite.y;
                var left_s_afterSlow = left_s_beforeSlow - slow_end;
                item.sprite.stopAllActions();
                item.sprite.runAction(new cc.Sequence(
                    new cc.MoveTo(this.slowTime, cc.p(item.sprite.x, item.sprite.y + slow_end)),
                    new cc.MoveTo(left_s_afterSlow/v_origin, cc.p(item.sprite.x, gVisibleHeight + item.sprite.height)),
                    new cc.CallFunc(item.failAndDelete, item)
                ));
            }
            this.intervalTime_cur = Math.max(this.intervalTime_slow + this.intervalTime_reduce * this.totolTime, this.intervalTime_fast);
            this.UI.level.setString(this.getLevel());
        }
        else{
            this.intervalTime_cur -= this.timeUnit;
        }

        //如果当前处于slowdown道具的有效时间内，更新slowTime的计时
        if(this.slowTime > 0){
            this.slowTime -= this.timeUnit * 2;
        }
        else if(this.IsSlowDown){
            this.unschedule(this.updateGame);
            this.schedule(this.updateGame, this.timeUnit, cc.kCCRepeatForever);
            this.IsSlowDown = false;
        }
    },

    itemTakeEffect: function(item){
        if(item.type == "bomb")
            this.gameOver();
        else{
            this.clickCount++;
            item.sprite.stopAllActions();
            this.items.splice(this.items.indexOf(item),1);
            item.sprite.runAction(cc.Sequence.create(
                cc.FadeOut.create(0.2),
                cc.CallFunc.create(item.touchedAndDelete, this, item)
            ))
            if(item.name == "func_freeze"){
                for(var i = 0; i < this.items.length; i++){
                    var element = this.items[i];
                    element.sprite.stopAllActions();
                    var t_left = element.t * (1 - element.sprite.y / (gVisibleHeight + element.sprite.height));
                    element.sprite.runAction(new cc.Sequence(
                        new cc.DelayTime(item.duration),
                        new cc.MoveTo(t_left, cc.p(element.sprite.x, gVisibleHeight + element.sprite.height)),
                        new cc.CallFunc(element.failAndDelete, element)
                    ));
                }
                this.unschedule(this.updateGame);
                this.schedule(this.updateGame, this.timeUnit, cc.kCCRepeatForever, item.duration);
            }
            else if(item.name == "func_slow"){
                for(var i = 0; i < this.items.length; i++){
                    var element = this.items[i];
                    element.sprite.stopAllActions();
                    var v_origin = (gVisibleHeight + element.sprite.height) / element.t;
                    var v_slow = v_origin / 2;
                    var slow_end = v_slow * item.duration;
                    var left_s_beforeSlow = gVisibleHeight + element.sprite.height - element.sprite.y;
                    //减速期间，就运动到最边缘，则不需要恢复动作
                    if(slow_end >= left_s_beforeSlow){
                        element.sprite.runAction(new cc.Sequence(
                            new cc.MoveTo(left_s_beforeSlow/v_slow, cc.p(element.sprite.x, gVisibleHeight + element.sprite.height)),
                            new cc.CallFunc(element.failAndDelete, element)
                        ));
                    }
                    else{
                        var left_s_afterSlow = left_s_beforeSlow - slow_end;
                        element.sprite.runAction(new cc.Sequence(
                            new cc.MoveTo(item.duration, cc.p(element.sprite.x, element.sprite.y + slow_end)),
                            new cc.MoveTo(left_s_afterSlow/v_origin, cc.p(element.sprite.x, gVisibleHeight + element.sprite.height)),
                            new cc.CallFunc(element.failAndDelete, element)
                        ));
                    }
                }
                this.IsSlowDown = true;
                this.slowTime = item.duration;
                this.unschedule(this.updateGame);
                this.schedule(this.updateGame, this.timeUnit * 2, cc.kCCRepeatForever);
            }
            else if(item.name == "func_addhp"){
                this.hp++;
                this.UI.hp.setString(this.hp.toString());
            }
            else if(item.name == "func_clean"){
                for(var i = 0; i < this.items.length;){
                    var element = this.items[i];
                    if(element.type != "virus") i++;
                    else
                        this.itemTakeEffect(element);
                }
            }
        }
    },

    gameOver: function(){
        this.stopAllActions();
        this.unschedule(this.updateGame);
        this.children.forEach(function(item){
            item.stopAllActions();
        }, this);
        cc.log("game Over!");
    },

    aliveTime: function(){
        var left = Math.floor(this.totolTime);
        var str = "";
        var sec = left % 60;
        var min = (left - sec) / 60;
        return str + (min>=10?"":"0") + min.toString() + ":" + (sec>=10?"":"0") + sec.toString();
    },

    resetCondition_addhp: function(){
        var func_addhp = this.item_condition.func_addhp;
        func_addhp.nextTime += func_addhp.timeIntervalBase + Math.floor(Math.random() * func_addhp.timeIntervalRandom);
    },

    resetCondition_clean: function(){
        var func_clean = this.item_condition.func_clean;
        func_clean.nextCount += func_clean.countBase * (func_clean.countLevel++) + Math.floor(Math.random() * func_clean.countRandom);
    },

    getLevel: function(){
        if(this.intervalTime_cur == null) {
            this.level = 1;
        }
        else {
            this.level = Math.min(Math.floor(1 + 9 / this.super_time * this.totolTime),10);
        }
        return this.level.toString();
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gLayers.gameLayer = new GameLayer();
        this.addChild(gLayers.gameLayer);
        gLayers.gameLayer.init();
    }
});

