/**
 * Created by lizaoji on 7/24/14.
 */
var WIN_SIZE_WIDTH = 960;
var WIN_SIZE_HEIGHT = 640;

var PADDING = 5;

var PASSENGER_WIDTH = 150;
var PASSENGER_HEIGHT = 200;

var STATUS_WIDTH = 100;
var STATUS_HEIGHT = 30;

var PASSENGER_NUM = 5;
var UNIT_DIS = 5;
var UNIT_VELOCITY = 2;
var UNIT_VALUE = 5;
var UNIT_TIME = 0.1;
var LEVELUP_TIME_ADD = 5;
var LEVELUP_MINVALUE_ADD = 10;
var CHARACTOR_NUM = 3; //nameIndex跟该参数有关

var STATION_WIDTH =  (PASSENGER_WIDTH + PADDING) * PASSENGER_NUM + PADDING;
var STATION_HEIGHT = (2 * PADDING + PASSENGER_HEIGHT + STATUS_HEIGHT);

var STATION_COLOR = cc.color(206, 193, 165, 255);
var TIMER_LAYER_COLOR = cc.color(34, 34, 34, 255);
var SHOWBOARD_TIME_LAYER_COLOR = cc.color(237, 229, 218, 255);
var SHOWBOARD_LVL_LAYER_COLOR = cc.color(235,226,200,255);
var SHOWBOARD_FONT_COLOR = cc.color(118, 111, 101, 255);
var SHOWBOARD_MIN_SCORE_LAYER_COLOR = cc.color(237, 127, 98, 255);
var SHOWBOARD_CURRENT_SCORE_LAYER_COLOR = cc.color(235, 180, 123, 255);

var allPassenger = [];
var enterPassenger = [];