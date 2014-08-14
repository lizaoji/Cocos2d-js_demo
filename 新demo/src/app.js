gLayer = {};
var GameTrueScene = cc.Scene.extend({
    onEnter:function(){
        this._super()
        gLayer.gameLayer = new GameLayer();
        gLayer.gameLayer.init();
        this.addChild(gLayer.gameLayer);
    }
});

var GameLayer = cc.LayerColor.extend({
    touchStartPoint: cc.p(0.0, 0.0),
    touchIsEffective: false,
    touchEnumDirection:{ "UP", "DOWN", "LEFT", RIGHT, NODIR };
    touchEnumDirection currentDirection = NODIR;
    int map[GAME1_ROWS][GAME1_COLS];
    MovedTile * allTile[GAME1_ROWS][GAME1_COLS] = {nullptr};
    LayerColor * gameBoard;
    bool init();
    unsigned int totalTiles = 0;
    unsigned int best = 0;
    unsigned int score = 0;
    bool isGameOver = false;
})