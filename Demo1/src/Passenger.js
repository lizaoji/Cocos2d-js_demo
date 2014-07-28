/**
 * Created by lizaoji on 7/24/14.
 */
var Passenger = cc.Node.extend({
    index: 0,
    col: 0,
    velocity: 0,
    value: 0,
    costTime: 0.0,
    needTotalTime: 0.0,
    isOnEnter: false,

    ctor: function(index, col){
        this._super();
        this.index = index;
        this.col = col;
        this.init();
    },

    init: function(){
        this._super();
        var personSprY = null;
        switch (this.index){
            case 0:
                personSprY = cc.Sprite.create(res.conan);
                this.velocity = 4 * UNIT_VELOCITY;
                this.value = 4 * UNIT_VALUE;
                break;
            case 1:
                personSprY = cc.Sprite.create(res.boy);
                this.velocity = 2 * UNIT_VELOCITY;
                this.value = 3 * UNIT_VALUE;
                break;
            case 7:
                personSprY = cc.Sprite.create(res.grandma);
                this.velocity = 1 * UNIT_VELOCITY;
                this.value = 5 * UNIT_VALUE;
                break;
            case 3:
                personSprY = cc.Sprite.create(res.greengiant);
                this.velocity = 1 * UNIT_VELOCITY;
                this.value = 1 * UNIT_VALUE;
                break;
            case 2:
                personSprY = cc.Sprite.create(res.hinada);
                this.velocity = 5 * UNIT_VELOCITY;
                this.value = 1 * UNIT_VALUE;
                break;
            case 5:
                personSprY = cc.Sprite.create(res.lin);
                this.velocity = 3 * UNIT_VELOCITY;
                this.value = 4 * UNIT_VALUE;
                break;
            case 6:
                personSprY = cc.Sprite.create(res.mfc);
                this.velocity = 2 * UNIT_VELOCITY;
                this.value = 5 * UNIT_VALUE;
                break;
            case 4:
                personSprY = cc.Sprite.create(res.momo);
                this.velocity = 4 * UNIT_VELOCITY;
                this.value = 3 * UNIT_VALUE;
                break;
            case 8:
                personSprY = cc.Sprite.create(res.naruto);
                this.velocity = 5 * UNIT_VELOCITY;
                this.value = 5 * UNIT_VALUE;
                break;
            case 9:
                personSprY = cc.Sprite.create(res.outman);
                this.velocity = 5 * UNIT_VELOCITY;
                this.value = 4 * UNIT_VALUE;
                break;
            case 10:
                personSprY = cc.Sprite.create(res.saw);
                this.velocity = 1 * UNIT_VELOCITY;
                this.value = 3 * UNIT_VALUE;
                break;
            case 11:
                personSprY = cc.Sprite.create(res.snakewoman);
                this.velocity = 2 * UNIT_VELOCITY;
                this.value = 2 * UNIT_VALUE;
                break;
            case 12:
                personSprY = cc.Sprite.create(res.yin);
                this.velocity = 2 * UNIT_VELOCITY;
                this.value = 3 * UNIT_VALUE;
                break;
            case 13:
                personSprY = cc.Sprite.create(res.yingmu);
                this.velocity = 4 * UNIT_VELOCITY;
                this.value = 2 * UNIT_VALUE;
                break;
            case 14:
                personSprY = cc.Sprite.create(res.jinzhengen);
                this.velocity = 2 * UNIT_VELOCITY;
                this.value = 5 * UNIT_VALUE;
                break;
            default :
                cc.log("no nameIndex");
                break;
        }
        this.velocity =
        this.needTotalTime = (this.col + 1) * UNIT_DIS / this.velocity / UNIT_TIME;
        this.costTime = 0.0;
        personSprY.setPosition(personSprY.getContentSize().width / 2, personSprY.getContentSize().height / 2);
        personSprY.setTag(1);
        this.addChild(personSprY);

        var status = cc.Sprite.create(res.wait);
        status.setPosition(personSprY.getPositionX(), personSprY.getContentSize().height + status.getContentSize().height / 2);
        status.setTag(2);
        this.addChild(status);

        var process = cc.Sprite.create(res.process);
        process.setPosition(personSprY.getContentSize().width / 2 - process.getContentSize().width / 2, -20);
        process.setTag(3);
        process.setVisible(false);
        process.setAnchorPoint(cc.v2f(0,0));
        this.addChild(process);
        this.showAt(this.col);
        return true;
    },

    showAt: function(col){
        this.setPosition(col * (PASSENGER_WIDTH + PADDING) + PADDING, PADDING);
        this.getChildByTag(1).runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 0.8), cc.ScaleTo.create(0.1, 1.2), cc.ScaleTo.create(0.1,1), null));
    },

    moveTo: function(col){
        if(this.isOnEnter){
            this.runAction(cc.MoveTo.create(0.1, cc.v2f(col * (PASSENGER_WIDTH + PADDING) + PADDING, PADDING + 30)));
        }
        else{
            this.runAction(cc.MoveTo.create(0.1, cc.v2f(col * (PASSENGER_WIDTH + PADDING) + PADDING, PADDING)));
        }
        this.col = col;
    }
})