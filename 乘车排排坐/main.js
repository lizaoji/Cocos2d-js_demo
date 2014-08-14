cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(false);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MetroScene());
    }, this);
};
cc.game.run();