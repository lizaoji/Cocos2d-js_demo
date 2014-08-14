/**
 * Created by lizaoji on 8/8/14.
 */
var MovedTile = cc.Node.extend({
    mRow:0,
    mCol:0,
    mNumber:0,
    movedTileColor:null,
    movedTileNumColor:null,
    movedTileColorLayer:null,
    movedTileNumLabel:null,

    init: function(){
        this._super();
        this.mNumber = Math.random() > 0.1 ? 2 : 4;
        switch (this.mNumber) {
            case 2:
                this.movedTileColor = GAME1_COLOR_2_TILE;
                this.movedTileNumColor = GAME1_COLOR_DARKFONT;
                break;
            case 4:
                this.movedTileColor = GAME1_COLOR_4_TILE;
                this.movedTileNumColor = GAME1_COLOR_DARKFONT;
            default:
                break;
        }
        //生成Tile的颜色图层
        this.movedTileColorLayer = cc.LayerColor.create(this.movedTileColor, GAME1_BLOCK_WIDTH, GAME1_BLOCK_HEIGHT);
        this.movedTileColorLayer.setTag(1);
        this.movedTileColorLayer.setScale(0);
        this.addChild(this.movedTileColorLayer, 0);

        //生成Tile的数字Label
        this.movedTileNumLabel = cc.LabelTTF.create(this.mNumber.toString(), "Helvetica", 50);
        this.movedTileNumLabel.setColor(this.movedTileNumColor);
        this.movedTileNumLabel.setPosition(GAME1_BLOCK_WIDTH / 2, GAME1_BLOCK_HEIGHT / 2);
        this.movedTileNumLabel.setTag(2);
        this.movedTileNumLabel.setScale(0);
        this.addChild(this.movedTileNumLabel, 1);
        return true;
    },

    update: function(){
    //Tile update
    switch (this.mNumber) {
        case 2:
            this.movedTileColor = GAME1_COLOR_2_TILE;
            break;
        case 4:
            this.movedTileColor = GAME1_COLOR_4_TILE;
            break;
        case 8:
            this.movedTileColor = GAME1_COLOR_8_TILE;
            break;
        case 16:
            this.movedTileColor = GAME1_COLOR_16_TILE;
            break;
        case 32:
            this.movedTileColor = GAME1_COLOR_32_TILE;
            break;
        case 64:
            this.movedTileColor = GAME1_COLOR_64_TILE;
            break;
        case 128:
            this.movedTileColor = GAME1_COLOR_128_TILE;
            break;
        case 256:
            this.movedTileColor = GAME1_COLOR_256_TILE;
            break;
        case 512:
            this.movedTileColor = GAME1_COLOR_512_TILE;
            break;
        case 1024:
            this.movedTileColor = GAME1_COLOR_1024_TILE;
            break;
        case 2048:
            this.movedTileColor = GAME1_COLOR_2048_TILE;
            break;
        default:
            break;
    }
        this.movedTileColorLayer.setColor(this.movedTileColor);

    //数字update
    if (this.mNumber < 8 ) {
        this.movedTileNumColor = GAME1_COLOR_DARKFONT;
    }
    else{
        this.movedTileNumColor = GAME1_COLOR_LIGHTFONT;
    }
    var movedTileNumLabel = this.getChildByTag(2);
    movedTileNumLabel.setString(this.mNumber.toString());
    movedTileNumLabel.setColor(this.movedTileNumColor);
    this.movedTileColorLayer.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 0.8),cc.ScaleTo.create(0.1, 1.2), cc.ScaleTo.create(0.1, 1)));
    movedTileNumLabel.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 0.8),cc.ScaleTo.create(0.1, 1.2), cc.ScaleTo.create(0.1, 1)));
},

    showAt:function(r,c) {
        this.setPosition((GAME1_BLOCK_WIDTH + GAME1_PADDING ) * c + GAME1_PADDING, (GAME1_BLOCK_HEIGHT + GAME1_PADDING ) * r + GAME1_PADDING);
        this.mRow = r;
        this.mCol = c;
        this.movedTileColorLayer.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 0.8), cc.ScaleTo.create(0.1, 1.2), cc.ScaleTo.create(0.1, 1)));
        this.movedTileNumLabel.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 0.8), cc.ScaleTo.create(0.1, 1.2), cc.ScaleTo.create(0.1, 1)));
    },

    moveTo: function(r, c) {
        var newPosition = cc.p((c - this.mCol) * (GAME1_BLOCK_WIDTH + GAME1_PADDING), (r - this.mRow) * (GAME1_BLOCK_HEIGHT + GAME1_PADDING));
        this.mRow = r;
        this.mCol = c;
        this.runAction(cc.MoveBy.create(0.1, newPosition));
    }
});