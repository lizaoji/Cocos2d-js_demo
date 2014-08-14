/**
 * Created by lizaoji on 8/4/14.
 */

//item的属性配置表
var gItemInfo = {
        virus:         { type:"virus", t:2.5, pic:res.virus_png, p:0.85,  duration:0, cooldown:0, maxNum:999,  needItems:-999 }, //0.85
        bomb:           { type:"bomb",   t:2.5, pic:res.bomb_png,   p:0.1,   duration:0, cooldown:0, maxNum:2,    needItems:2 }, //0.1
        func_freeze:    { type:"func",   t:2, pic:res.freeze_png, p:0.025, duration:3, cooldown:10, maxNum:1,   needItems:8 }, //0.025
        func_slow:      { type:"func",   t:2, pic:res.slow_png,   p:0.025, duration:3, cooldown:10, maxNum:1,   needItems:8 }, //0.025
        func_addhp:     { type:"func",   t:1.5, pic:res.addHp_png,  p:0,     duration:0, cooldown:0, maxNum:1,    needItems:0 }, //0
        func_clean:     { type:"func",   t:1.5, pic:res.clean_png,  p:0,     duration:0, cooldown:0, maxNum:1,    needItems:10 } //0
    },
    //道路数量
    gLane = 6,
    gLeftRightPadding = 0.1,
    gPositionDif = 0.3,
    gCoolDownCount = {
        func_freeze:0,
        func_slow:0
    },
    gStillExist = {
        func_freeze:0,
        func_slow:0,
        bomb:0,
        virus:0
    };

    //item的构造函数
var Item = function(name){
    if(arguments.length == 0)
        this.name = this.randomName();
    else
        this.name = name;

    //初始化其他信息
    for(var i in gItemInfo[this.name]){
        this[i] = gItemInfo[this.name][i];
    }
    //初始化sprite
    this.sprite = cc.Sprite.create(this.pic);
    //初始化位置
    this.sprite.attr({
        x:this.randomX(),
        y:0,
        anchorX:0.5,
        anchorY:1
    });
    this.sprite.runAction(cc.Sequence.create(
        cc.MoveTo.create(this.t, cc.p(this.sprite.x, gVisibleHeight + this.sprite.height)),
        cc.CallFunc.create(this.failAndDelete, this)
    ));
};

Item.prototype.randomName = function(){
    //感觉基础概率，生成本轮的概率表
    var randomTable = {};
    var upperLimit = 0;
    for(var i in gItemInfo){
        //如果该类道具现在cooldown还没到0，则不产生，即本轮产生概率为0
        //检查目前场该类道具数量，如果达到最大数量，则本轮产生概率为0
        if(gCoolDownCount[i] > 0 || gStillExist[i] >= gItemInfo[i].maxNum || gItemInfo[i].needItems > gStillExist["virus"])
            randomTable[i] = 0;
        else {
            randomTable[i] = gItemInfo[i].p;
            upperLimit += gItemInfo[i].p;
        }
    }
    var ran = Math.random()*upperLimit;
    var addedP = 0;
    for(var i in randomTable){
        addedP += randomTable[i];
        //随机出了新产生的item类型
        if(ran < addedP) {
            //添加cooldown和在场数量，以便确定在限制条件失效前，场上不再重复出现
            this.addRestriction(i);
            return i;
        }
    }
};

Item.prototype.randomX = function(){
    var laneIndex = Math.floor(Math.random()*gLane);
    var laneWidth = (gWinWidth) / (gLane + 2*gLeftRightPadding);
    //检测一下道路数量是否过密
    if((this.sprite.width / 2) > (0.5 + gLeftRightPadding - gPositionDif) * laneWidth){
        cc.log("显示在屏幕外！" + (this.sprite.width / 2) + "," + (0.5 + gLeftRightPadding) * laneWidth);
    }
    var x = (laneIndex + 0.5 + gLeftRightPadding + cc.randomMinus1To1() * gPositionDif) *laneWidth
    return  Math.min(Math.max(this.sprite.width / 2, x), gWinWidth - this.sprite.width / 2);
};

Item.prototype.failAndDelete = function(sprite){
    var self = gLayers.gameLayer;
    //删除掉item
    self.items.splice(self.items.indexOf(this),1);
    self.removeChild(sprite);
    if(gStillExist.hasOwnProperty(this.name))
        gStillExist[this.name]--;
    //扣减生命值
    if(this.type == "virus"){
        if((--self.hp) == 0)
            self.gameOver();
        self.UI.hp.setString(self.hp.toString());
    }
};

Item.prototype.touchedAndDelete = function(sprite, item){
    this.removeChild(sprite);
    if(gStillExist.hasOwnProperty(item.name))
        gStillExist[item.name]--;
};

Item.prototype.addRestriction = function(name){
    if(gCoolDownCount.hasOwnProperty(name))
        gCoolDownCount[name] = gItemInfo[name].cooldown;
    if(gStillExist.hasOwnProperty(name))
        gStillExist[name]++;
};
