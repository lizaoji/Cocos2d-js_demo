var layers = {};
var ROWS = 9,
    COLS = 9,
    BLOCK_WIDTH = 63,
    BLOCK_HEIGHT = 72,
    RANDOM_MIN = 7,
    RANDOM_MAX = 20;


var GameLayer = cc.Layer.extend({
    winSize: null,
    blocks: null,
    block_batch: null,
    block1_rect : cc.rect(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
    block2_rect : cc.rect(BLOCK_WIDTH+1, 0, BLOCK_WIDTH, BLOCK_HEIGHT),
    blocks_Xstart: null,
    blocks_Ystart: null,
    blocks_Xoffset: 2,
    blocks_Yoffset: 2,
    player: {width: 100,
            height: 178,
            normalFrame: [],
            surroundFrame: [],
            normalAni: null,
            surroundAni: null
            },

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.winSize = cc.director.getWinSize();

        //游戏初始化时，只有背景
        var bgLayer = cc.Layer.create();
        bgLayer.setPosition(0, 0);
        var bgPicSprY = cc.Sprite.create(res.BackGround);
        bgPicSprY.setPosition(this.winSize.width / 2, this.winSize.height / 2);
        bgLayer.addChild(bgPicSprY);
        this.addChild(bgLayer);

        //准备相关成员的值
        this.blocks_Xstart = (this.winSize.width - (COLS + 1/2) * BLOCK_WIDTH - this.blocks_Xoffset * (COLS - 1)) / 2;
        this.blocks_Ystart = (this.winSize.height * 2.05 / 3 - (ROWS - (ROWS - 1) * 1/4) * BLOCK_HEIGHT - this.blocks_Yoffset * (ROWS - 1)) / 2;
        this.block_batch = cc.SpriteBatchNode.create(res.Block, ROWS*COLS);
        return true;
    },

    initGame :function(){
        this.initBlocks();
        this.addChild(this.block_batch);
        //添加动画
        for(var i = 0; i < 4; i++){
            this.player.normalFrame[i] = cc.SpriteFrame.create(res.Player,
                cc.rect(i*this.player.width, this.player.height, this.player.width, this.player.height));
        }
//        for(var i = 0; i < 6; i++){
//            this.player.surroundFrame[i] = cc.SpriteFrame.create(res.Player,
//                cc.rect(i*this.play.width, 0, this.player.width, this.player.height));
//        }
        //this.player.normalAni = cc.RepeatForever.create(cc.Animate.create(cc.Animation(this.player.normalFrame, 0.2)));
//        this.player.surroundAni = cc.RepeatForever.create(cc.Animate.create(cc.Animation(this.player.surroundFrame, 0.2)));
        //this.runAction(this.player.normalAni);

        //添加游戏界面内的点击方法
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                var x = touch.getLocation(), r, c;
                var self = event.getCurrentTarget();
                r = Math.floor((x.y - self.blocks_Ystart) /  (3/4*BLOCK_HEIGHT + self.blocks_Yoffset));
                c = Math.floor((x.x - self.blocks_Xstart - (r%2==1?0:1/2*BLOCK_WIDTH)) / (BLOCK_WIDTH + self.blocks_Xoffset));
                if(r < ROWS && r >= 0 && c < COLS && c >= 0 && self.blocks[r][c].stop == false){
                    self.setYBlock(self.blocks[r][c]);
                }
                return true;
            }
        }), this);
    },
    initBlocks : function (){
        this.blocks = [];
        this.block_batch.removeAllChildren();
        //初始化所有结点为非阻挡
        for (var i = 0; i < ROWS; i++) {
            var row = [];
            for (var j = 0; j < COLS; j++) {
                var block = cc.Sprite.create(res.Block, this.block2_rect);
                block.attr({
                    x: this.blocks_Xstart + (j + 1 / 2) * BLOCK_WIDTH + (i % 2 ? 0 : BLOCK_WIDTH / 2) + this.blocks_Xoffset * j,
                    y: this.blocks_Ystart + 1 / 2 * BLOCK_HEIGHT + i * 3 / 4 * BLOCK_HEIGHT + this.blocks_Yoffset * i
                });
                row[j] = {sprite:block, stop:false};
            }
            this.blocks[i] = row;
        }
        //生成随机阻挡Block
        this.randomYBlocks();
        //添加到Batch
        this.blocks.forEach(function(row){
            row.forEach(function(element){
                this.block_batch.addChild(element.sprite);
            }, this)
        }, this)
    },
    //函数作用：随机生成阻挡Block
    randomYBlocks: function (){
        var total = RANDOM_MIN + Math.floor(Math.random() * 10000) % (RANDOM_MAX - RANDOM_MIN + 1);
        cc.log(total);
        var current = 0;
        while(current < total){
            var left = (COLS * ROWS - current);
            var index = Math.floor(Math.random() * 10000) % left;
            var isFind = false;
            for(var i = 0; i < ROWS; i++) {
                for( var j = 0; j < COLS; j++){
                    if(this.blocks[i][j].stop == false && index == 0){
                        this.blocks[i][j].stop = true;
                        var position = this.blocks[i][j].sprite.getPosition();
                        this.blocks[i][j].sprite = cc.Sprite.create(res.Block, this.block1_rect);
                        this.blocks[i][j].sprite.setPosition(position);
                        isFind = true;
                        current++;
                        break;
                    }
                    else if(this.blocks[i][j].stop == false && index > 0)
                        index--;
                }
                if(isFind)
                    break;
            }
        }
    },

    setYBlock: function(block){
        if(block.stop == false){
            block.stop = true;
            var p = block.sprite.getPosition();
            this.block_batch.removeChild(block.sprite);
            block.sprite = new cc.Sprite(res.Block, this.block1_rect);
            block.sprite.setPosition(p);
            this.block_batch.addChild(block.sprite);
        }
    }
});

var CrazySheepScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        layers.game = new GameLayer();
        this.addChild(layers.game);
        layers.game.initGame();
    }
});

