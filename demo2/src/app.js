"use strict";
var gWinWidth = 640,
    gWinHeight = 960,
    gItemWidth = 120,
    gItemHeight = 120,
    gLayers = {},
    gColor = {
        bgColor: cc.color(159, 159, 158),
        hpHealth: cc.color(50, 167, 85),
        hpInjured: cc.color(227, 108, 70),
        hpDying: cc.color(220, 12, 31),
        score: cc.color(227, 228, 226),
        combol: cc.color(254, 46, 200),
        multiplier: cc.color(255, 0, 64)
    },
    gInfinityTime = 999999999;

var Gamelayer = cc.LayerColor.extend({
    tag: {
        pause_button: 1,
        hp:2,
        score:3,
        combol_label: 4,
        multiplier_label: 5
    },
    items_info: {
        //item的默认属性，另外有type属性，是动态添加的
        value_5 : {pic:res.item_5pts, value:5, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        value_10 : {pic:res.item_10pts, value:10, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        value_50 : {pic:res.item_50pts, value:50, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        value_100 : {pic:res.item_100pts, value:100, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        bomb_1: {pic:res.item_bomb, value:0, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        func_x2: {pic:res.item_multiply2, value:0, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        func_x05: {pic:res.item_multiply05, value:0, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        func_x1: {pic:res.item_multiply1, value:0, t:{x:gInfinityTime, y:3}, effect_last:0, p:0, v:{x:0, y:0}},
        func_freeze: {pic:res.item_freeze, value:0, t:{x:gInfinityTime, y:3}, effect_last:3, p:0, v:{x:0, y:0}}

    },
    //游戏层的精灵
    pause_button:null,
    items:[],
    hp:null,
    score:null,
    combo_label:null,
    multiplier_label:null,
    missed_label:null,
    //上下极限位置
    topLimit: gWinHeight * 9 / 10,
    bottomLimit: 0,
    //时间单位
    unit_time: 0.1,
    //已被点击的item
    touched_items:[],
    combo_count: 0,
    combo_delta: 0,
    multiplier: 1.0,
    missed_count: 0,

    ctor:function () {
        this._super();
        this.setColor(gColor.bgColor);
        //时间相关参数
        this.gameTimer = {
            newPlayerTime: 1 / this.unit_time,
            normalPlayerTime: 2 / this.unit_time,
            betterPlayerTime: 3 / this.unit_time,
            masterPlayerTime: 4 / this.unit_time,
            //游戏总进行时间
            totalTime: 0,
            lastCreateItemTime: null
        };
        this.gameLevel = {
            //不变数值, 直接手工设定
            hp_total: 100,
            hp_reduceToZero_time_slow: 30 / this.unit_time,
            hp_reduceToZero_time_fast: 10 / this.unit_time,
            //产生物件的时间间隔最小最大值
            createItemInterval_fast: 0.16 / this.unit_time,
            createItemInterval_slow: 0.16 / this.unit_time,

            //中间计算结果，只在游戏init时计算一次
            hp_reduceDelta_fast: null,
            hp_reduceDelta_slow: null,

            //动态计算数值
            //当前产生物件的时间间隔
            createItemInterval_cur: 0,
            //每次更新生命扣减数
            hp_reduceDelta_cur:0,
            //分数
            score_value: 0,
            //生命值数
            hp_cur: 100
        };

    },
    //初始化用于添加静态必定存在的Sprite
    init: function(){
        //pause按钮
        this.pause_button = new cc.Sprite(res.pause_png);
        this.pause_button.attr({
            anchorX: 0,
            anchorY: 0,
            x: 0,
            y: 0,
            tag: this.tag.pause_button
        });
        this.addChild(this.pause_button);

        //hp
        this.hp = new cc.LayerColor(gColor.hpHealth, gWinWidth, 10);
        this.hp.attr({
            x: 0,
            y: this.topLimit,
            tag: this.tag.hp
        });
        this.addChild(this.hp);

        //score
        this.score = new cc.LabelTTF(this.gameLevel.score_value.toString(),'Helvetica', 50);
        var left = gWinHeight - this.topLimit - this.hp.getContentSize().height;
        this.score.attr({
            anchorX: 0,
            anchorY: 0,
            x:70,
            y:(left - this.score.getContentSize().height) / 2 + this.topLimit + this.hp.getContentSize().height,
            tag: this.tag.score,
            color: gColor.score
        });
        this.addChild(this.score);

        //combol_label
        this.combo_label = new cc.LabelTTF(this.combo_count.toString(),'Helvetica', 50);
        this.combo_label.attr({
            anchorX: 0,
            anchorY: 0,
            x: 300,
            y: this.score.y,
            tag: this.tag.combol_label,
            color: gColor.combol
        });
        this.addChild(this.combo_label);

        //multiplier_label
        this.multiplier_label = new cc.LabelTTF("x" + this.multiplier.toString(),'Helvetica', 30);
        this.multiplier_label.attr({
            anchorX: 0,
            anchorY: 0,
            x: 5,
            y: this.score.y,
            tag: this.tag.multiplier_label,
            color: gColor.multiplier
        });
        this.addChild(this.multiplier_label);


        //update Level中的中间计算结果
        this.gameLevel.hp_reduceDelta_fast = this.gameLevel.hp_total / this.gameLevel.hp_reduceToZero_time_fast;
        this.gameLevel.hp_reduceDelta_slow = this.gameLevel.hp_total / this.gameLevel.hp_reduceToZero_time_slow;

        //missed
        this.missed_label = new cc.LabelTTF(this.missed_count.toString(),'Helvetica', 50);
        this.missed_label.attr({
            x: 500,
            y: this.score.y
        });
        this.addChild(this.missed_label);
        //更新items的概率
        this.initProbability();

        //添加监听事件
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.touch_check
            //onTouchMoved: this.touch_check
        }), this);

        //添加计划任务
        this.schedule(this.updateGame, 0.1, cc.kCCRepeatForever, 0);

    },

    updateHp: function(){
        this.hp.attr({
            width: gWinWidth * this.gameLevel.hp_cur / this.gameLevel.hp_total
        });

        if(this.gameLevel.hp_cur == 0) {
            //this.gameOver();
        }
    },

    updateLevel: function(){
        this.gameTimer.totalTime++;
        //更新发球时间间隔参数
        //0秒时，发球间隔为slow，masterPlayerTime之后，发球间隔为fast，a+bx=y的线性公式算法
        //如果倒数到0，则发一个新球，并重新算，否则就自减1
        if(this.gameLevel.createItemInterval_cur <= 0) {
            this.gameLevel.createItemInterval_cur = this.gameLevel.createItemInterval_slow +
                (this.gameLevel.createItemInterval_fast - this.gameLevel.createItemInterval_slow) / this.gameTimer.masterPlayerTime * Math.min(this.gameTimer.totalTime, this.gameTimer.masterPlayerTime);
        }
        else
            this.gameLevel.createItemInterval_cur--;

        //更新血量
        //更新每次血量扣减速度,a+bx=y的算法
        this.gameLevel.hp_reduceDelta_cur = this.gameLevel.hp_reduceDelta_slow +
            (this.gameLevel.hp_reduceDelta_fast - this.gameLevel.hp_reduceDelta_slow) / this.gameTimer.masterPlayerTime * Math.min(this.gameTimer.totalTime,this.gameTimer.masterPlayerTime);
        this.gameLevel.hp_cur = Math.max(0, this.gameLevel.hp_cur - this.gameLevel.hp_reduceDelta_cur);
    },

    //每隔一段时间，要产生新气球
    updateGame: function(){
        this.updateLevel();
        this.updateHp();
        //产生新气球
        if(this.gameLevel.createItemInterval_cur <= 0){
            this.newItem();
        }

    },

    gameOver: function(){
        this.pause();
        this.getChildren().forEach(function(item){
            item.pause();
        },this);
    },

    newItem: function(){
//        item的数据结构：
//        {
//            info    //items_info类型
//            sprite  //存储精灵
//        }
        var ran_num = Math.random();
        var addedProbability = 0;
        //TODO:随机挑选气球种类时，对于X2、BOMB要特殊处理一下，最好不要连续出现，连续出现X2会没有意义
        var index_name = "";
        for(var i in this.items_info){
            if(ran_num > this.items_info[i].p + addedProbability){
                addedProbability += this.items_info[i].p;
            }
            else{
                index_name = i;
                break;
            }
        }
        var item = {};
        //深度复制一下类型的静态属性，以免只是引用传递
        for(var i in this.items_info[index_name])
            item[i] = this.items_info[index_name][i];
        //添加动态属性type和isTouched
        item.type = index_name.split("_");
        item.isTouched = false;
        item.sprite = new cc.Sprite(item.pic);
        item.sprite.attr({
            anchorX:0,
            anchorY:1,
            x:(gWinWidth - item.sprite.getContentSize().width)* Math.random(),
            y:0,
            tag: item.tag
        });
        this.addChild(item.sprite, item.type[0] == 'bomb'?0:1);
        item.v.x = (gWinWidth + gItemWidth) / item.t.x;
        item.v.y = (gWinHeight + gItemHeight) / item.t.y;
        //计算在x和y分量上，最短飞出屏幕的时间
        var t = Math.min(item.t.x, item.t.y);
        item.sprite.runAction(new cc.Sequence(
            new cc.MoveTo(t, cc.p(item.sprite.x + t * item.v.x, item.sprite.y + t*item.v.y)),
            new cc.CallFunc(this.delete_item, this, ["item", item, true])
            ));
        this.items.push(item);
    },

    initProbability: function(){
        //概率设定方法：不直接写概率值，而是设定如果总共出现base个，里面有多少个炸弹，多少个道具，剩下的均为数值类型
        var p ={};
        p.type_base = 10;
        p.type_bomb = 1;
        p.type_func = 1;
        p.type_value = p.type_base - p.type_bomb - p.type_func;

        //数值小内概率设计
        p.value_base = 10;
        p.value_100 = 1;
        p.value_50 = 2;
        p.value_10 = 3;
        p.value_5 = p.value_base - p.value_100 - p.value_50 - p.value_10;

        //炸弹概率设计,只有一种炸弹
        p.bomb_base = 1;
        p.bomb_1 = 1;

        //功能型概率设计
        p.func_base = 10;
        p.func_freeze = 1;
        p.func_x1 = 2;
        p.func_x2 = 1;
        p.func_x05 = p.func_base - p.func_x2 - p.func_x1 - p.func_freeze;

        //更新item_info中的概率p属性
        for(var i in this.items_info){
            var type = "type_" + i.split("_")[0];
            var base = i.split("_")[0] + "_base";
            this.items_info[i].p = p[type] / p.type_base * p[i] / p[base];
        };
    },
    //arg的是参数列表，arg[0]:type，arg[1]:传递过来要销毁的东西, arg[2]:是否要重置combo
    delete_item: function(sender, arg){
        var type = arg[0];
        //如果要销毁的item
        if(type == "item") {
            var item = arg[1];
            var isCombolFail = arg[2];
            this.removeChild(item.sprite);
            var index = this.items.indexOf(item);
            if (index == -1) {
                cc.log("no such item in items array!!!Must be wrong");
            }
            else {
                this.items.splice(index, 1);
            }
            //如果是点击销毁的方式，则要清除touched_items数组里面的内容
            if (item.isTouched)
                this.touched_items.splice(this.touched_items.indexOf(item), 1);
            //如果是要重置combo
            if (item.type[0] != "bomb" && isCombolFail) {
                this.setCombol(0);
                this.setMultiplier(1.0);
                this.missed_count++;
                this.missed_label.setString(this.missed_count.toString());
                if(this.missed_count == 3){
                    this.gameOver();
                }

            }
        }
        //如果要销毁的枪孔
        else if(type == "shoot_hole"){
            this.removeChild(arg[1]);
        }
    },

    touch_check: function(touch, event){
        var self = event.getCurrentTarget();
        var point = touch.getLocation();
        var shoot_hole = new cc.Sprite(res.shoot_hole);
        shoot_hole.attr({
            x:point.x,
            y:point.y
        });
        shoot_hole.runAction(cc.Sequence.create(
            cc.FadeOut.create(0.2),
            cc.CallFunc.create(self.delete_item, self, ["shoot_hole", shoot_hole])));
        self.addChild(shoot_hole);
        //倒序判断，数组下标越大的是越后面添加的，所以应该在更上层
        for (var i = self.items.length - 1; i >= 0; i--) {
            if (!self.items[i].isTouched) {
                var s = self.items[i].sprite;
                var rect = new cc.rect(s.x, s.y - gItemHeight, s.width, s.height);
                if (cc.rectContainsPoint(rect, point)) {
                    self.items[i].isTouched = true;
                    self.itemTakeEffect(self.items[i]);
                    break;
                }
            }
        }
        return true;
    },

    //item被点击或划破后，处理效果的函数
    itemTakeEffect:function(item){
        //先处理combo，因为会影响分数的计算
        this.combo(item);
        this.addScore(item);
        this.addHp(item);
        this.addEffect(item);

    },

    //加分
    addScore: function(item){
        if(item.value != 0) {
            this.gameLevel.score_value += Math.floor(item.value * this.multiplier);
            this.score.setString(this.gameLevel.score_value.toString());
        }
    },

    //加血
    //TODO:加血数字的算法需要考虑，目前是直接加定值
    addHp: function(item){
        if(item.type[0] != "bomb")
            this.gameLevel.hp_cur = Math.min(this.gameLevel.hp_total, this.gameLevel.hp_cur + 5);
        else
            this.gameLevel.hp_cur = 0;
        this.hp.width = gWinWidth * (this.gameLevel.hp_cur) / this.gameLevel.hp_total;
    },

    //处理item的特殊效果
    addEffect: function(item){
        //如果是bomb就直接通过gameover来接管后续工作
        if(item.type[0] == "bomb")
            return;
        else{
            //首先该item停止运动，然后播放一个渐隐动画后消失,
            item.sprite.stopAllActions();
            item.sprite.runAction(new cc.Sequence(
                cc.FadeOut.create(0.3),
                new cc.CallFunc(this.delete_item, this, ["item", item, false])
            ));

            if(item.type[1] == "freeze"){
                for(var i = 0; i < this.items.length; i++){
                    var element = this.items[i];
                    cc.log("%d, %d",i, element.pic);
                    if(element == item){
                        continue;

                    }
                    element.sprite.stopAllActions();
                    element.v.x = (gWinWidth + gItemWidth) / element.t.x;
                    element.v.y = (gWinHeight + gItemHeight) / element.t.y;
                    //计算在x和y分量上，最短飞出屏幕的时间
                    var t_total = Math.min(element.t.x, element.t.y);
                    var end_p = cc.p(element.sprite.x + t_total * element.v.x, t_total*element.v.y);
                    //计算剩余还要走多少时间，保持速度是一致的
                    var t_left = (1- element.sprite.y / (t_total*element.v.y)) * t_total;
                    element.sprite.runAction(new cc.Sequence(
                        new cc.DelayTime(item.effect_last),
                        new cc.MoveTo(t_left, end_p),
                        new cc.CallFunc(this.delete_item, this, ["item", element, true])
                    ));
                }
                this.unschedule(this.updateGame);
                this.schedule(this.updateGame, 0.1, cc.kCCRepeatForever, item.effect_last);
            }
            else if(item.type[1][0] == "x"){
                var multiplier_value = item.type[1][1] == "0"?
                    Number(item.type[1].slice(2))/10:
                    Number(item.type[1].slice(1));
                this.addMultiplier(multiplier_value);
            }
        }
    },

    combo: function(item){
        if(item.type[0] != "bomb") {
            this.addCombol(1);
            this.combo_delta++;
            if(this.combo_delta == 10) {
                this.addMultiplier(0.1);
                this.combo_delta = 0;
            }
        }
    },

    //辅助函数
    setCombol: function(num){
        this.combo_count = num;
        this.combo_label.setString(this.combo_count);
    },

    addCombol: function(num){
        this.combo_count += num;
        this.combo_label.setString(this.combo_count);
    },

    setMultiplier: function(num){
        this.multiplier = num;
        var str = this.multiplier.toString();
        var dot = str.indexOf(".")
        this.multiplier_label.setString("x"+str.slice(0,dot+2));
    },

    addMultiplier: function(num){
        this.multiplier += num;
        var str = this.multiplier.toString();
        var dot = str.indexOf(".")
        this.multiplier_label.setString("x" + str.slice(0,dot+2));
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gLayers.gameLayer = new Gamelayer();
        gLayers.gameLayer.init();
        this.addChild(gLayers.gameLayer);
    }
});

//TODO: Combol的效果
//TODO: 气球加入大小变化区分
//TODO: 加分以一个过程的形式展现