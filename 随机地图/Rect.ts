namespace 主空间{
    export class Rect{
        constructor(x, y, width, height){
            
        }

        distanceTo(other:Rect){
            return 0
        }

        forEach(fun:Function){

        }

        /**
         * 矩形范围内是否包含该坐标
         */
        contains(坐标:Vec){
            return false
        }

        /**
         * 大概是填充的意思
         */
        inflate(p1:number){
            return {}
        }
    }
}