namespace 主空间{
    export class 地图块类 extends PIXI.Sprite{
        /**
         * 0:未使用,1:正在显示
         */
        显示标识 = 0

        constructor(){
            super()
            this.width = 24
            this.height = 24
        }

        
    }
}