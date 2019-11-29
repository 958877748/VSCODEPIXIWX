namespace 主空间 {
    export class 用户授权 {
        constructor(){
        }

        private 获取用户授权设置(){
            wx.getSetting({})
        }
    }
}