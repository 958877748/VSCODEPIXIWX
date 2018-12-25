namespace 主空间 {
    export class 设置类 {
        constructor(参数){
            this.舞台宽度 = 参数.width
            this.舞台高度 = 参数.height
            this.屏幕宽度 = 参数.width * 参数.resolution
            this.屏幕高度 = 参数.height * 参数.resolution
            this.缩放比例 = 参数.resolution
        }
        /**
         * 物理像素数量
         */
        屏幕宽度:number
        /**
         * 物理像素数量
         */
        屏幕高度:number
        /**
         * 像素化下的宽
         */
        舞台宽度:number
        /**
         * 像素化下的高
         */
        舞台高度:number
        /**
         * 舞台宽度 X 缩放比例 = 屏幕宽度
         */
        缩放比例:number
    }
}