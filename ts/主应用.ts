namespace 主空间{
    export class 主应用 extends PIXI.Application{
        static 单例:主应用
        游戏:游戏
        设置:设置类
        
        constructor(参数:PIXI.ApplicationOptions){
            super(参数)
            this.设置 = new 设置类(参数)
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
            主应用.单例 = this
            this.开始运行()
        }

        private 开始运行(){
            this.游戏 = new 游戏(this.stage)
        }
    }
}
window['主空间'] = 主空间