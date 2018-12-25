//适配,将pixi的变量挂载到window下
import * as PIXI from './pixi'
(function (window,PIXI) {
	window.PIXI = PIXI
})(window, PIXI);