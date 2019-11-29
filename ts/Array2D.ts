namespace 主空间{
    /**
     * 一个指定类型的2维数组
     */
    export class Array2D<T> extends Array{
        //bounds:Rect
        
        constructor(宽度,高度){
            super(宽度)
            for (let index = 0; index < 宽度; index++) {
                this[index] = new Array<T>(高度)
            }
        }

        /**
         * 获取2维数组中的某数据
         * @param x 
         * @param y 
         */
        get(x,y):T{
            return this[x][y]
        }

        /**
         * 更改某坐标上的元素
         * @param 坐标 
         * @param 新元素 
         */
        set(坐标x,坐标y, 新元素:T){
            this[坐标x][坐标y] = 新元素
        }
    }
}