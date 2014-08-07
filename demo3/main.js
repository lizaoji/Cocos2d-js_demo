cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    if (cc.sys.isMobile)
        cc.view.setDesignResolutionSize(320, 500, cc.ResolutionPolicy.FIXED_WIDTH);
    else cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.EXACT_FIT);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new CrazySheepScene());
    }, this);
};
cc.game.run();