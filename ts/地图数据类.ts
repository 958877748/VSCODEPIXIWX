namespace 主空间{
    export class 地图数据类{
        constructor(地图json数据){
            this.地图高度 = 地图json数据.height
            this.所有地图层 = 地图json数据.layers
            this.地图块高度 = 地图json数据.tileheight
            this.所有地图纹理集 = 地图json数据.tilesets
            this.地图块宽度 = 地图json数据.tilewidth
            this.地图宽度 = 地图json数据.width

            this.地图层数据 = this.所有地图层[0].data
            
        }

        根据地图块坐标取地图块数据(坐标: { x: number, y: number }){
            if(坐标.x >= this.地图宽度 || 坐标.y >= this.地图高度){
                return -1
            }
            if(坐标.x <0 ||坐标.y<0){
                return -1
            }
            //根据XY坐标算出数据下标
            let 下标 = 坐标.y * 30 + 坐标.x
            //返回该下标的数据
            return this.地图层数据[下标]
        }

        地图层数据
        所有地图纹理集
        所有地图层
        /**
         * 单位:地图块
         */
        地图高度
        /**
         * 单位:地图块
         */
        地图宽度
        /**
         * 单位:像素
         */
        地图块高度
        /**
         * 单位:像素
         */
        地图块宽度

    }
}