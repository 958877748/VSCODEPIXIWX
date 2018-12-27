import './js/libs/weapp-adapter'
import './js/libs/symbol'
import './js/libs/pixi-adapter'
import './js/bundle'

const {
	pixelRatio,
	windowWidth,
	windowHeight
} = wx.getSystemInfoSync();
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

function show(str) {
	if (typeof str == 'string') {
		console.log('[日志]' + str)
	} else {
		console.log(str)
	}
}
//----------授权
show('获取用户授权设置')
wx.getSetting({
	success: (res) => {
		show('拿到用户授权结果')
		let authSetting = res.authSetting
		show('检查是否授权用户信息')
		let isuserInfo = authSetting["scope.userInfo"]
		if (isuserInfo) {
			show('用户已授权')
		} else {
			show('用户没授权,创建按钮让用户授权')
			let button = wx.createUserInfoButton({
				type: 'text',
				text: '授权',
				style: {
					left: 100,
					top: 100,
					width: 120,
					height: 50,
					backgroundColor: '#14c814',
					borderColor: '#0c820c',
					borderWidth: 3,
					borderRadius: 5,
					textAlign: 'center',
					fontSize: 18,
					lineHeight: 45
				},
				withCredentials: false
			})
			button.onTap((res) => {
				let userInfo = res.userInfo
				if (userInfo) {
					button.destroy()
					show('用户点击了授权')
					show(userInfo)
				} else {
					show('用户拒绝了授权')
				}
			})
		}
	},
	fail: () => {
		show('获取用户授权设置失败')
	}
})