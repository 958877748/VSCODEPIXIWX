namespace 主空间{
    export class 地图块池类{
        private 池:Array<地图块类> = []
        private 纹理引用:PIXI.loaders.TextureDictionary
        private 空白纹理:PIXI.Texture

        constructor(纹理字典:PIXI.loaders.TextureDictionary){
            this.纹理引用 = 纹理字典
            let 地图块 = new 地图块类()
            this.空白纹理 = 地图块.texture
            this.回收地图块(地图块)
        }

        获取地图块(数据):地图块类{
            let 纹理 = this.纹理引用['tiles-'+(数据-1)+'.png']
            let 地图块:地图块类
            let 地图块池 = this.池
            if(地图块池.length>0){
                地图块 = 地图块池.shift()
            }else{
                地图块 = new 地图块类()
            }
            if(纹理){
                地图块.texture = 纹理
            }else{
                console.log('数据'+数据)
            }
            return 地图块
        }

        回收地图块(地图块:地图块类){
            地图块.texture = this.空白纹理
            this.池.push(地图块)
        }
    }
}