import './js/libs/weapp-adapter'
import './js/libs/symbol'
import './js/libs/pixi-adapter'
import './js/bundle'

const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync();
const resolution = 4
let opt = {}
opt.backgroundColor = 0x000000
//渲染比例
opt.resolution = resolution
opt.width = windowWidth * pixelRatio / resolution
opt.height = windowHeight * pixelRatio / resolution
opt.view = canvas

PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
	point.x = x * pixelRatio / resolution
	point.y = y * pixelRatio / resolution
}

new 主空间.主应用(opt)
opt = null