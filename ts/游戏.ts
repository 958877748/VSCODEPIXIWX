namespace 主空间 {
    export class 游戏 {
        主舞台: PIXI.Container
        constructor(舞台: PIXI.Container) {
            this.主舞台 = 舞台
            this.开始游戏2()
        }

        private 开始游戏() {
            PIXI.loader
            .add('地图图集','json/dilao.json')
            .add('地图数据','json/untitled.json')
            .load(()=>{
                let 地图图集 = PIXI.loader.resources['地图图集'].textures
                let 地图数据 = PIXI.loader.resources['地图数据'].data
                let 地图 = new 地图类(地图图集,地图数据)
                this.主舞台.addChild(地图)
                地图.interactive = true

                地图.on('touchstart',(eve:PIXI.interaction.InteractionEvent)=>{
                    let tx = parseInt(eve.data.global.x+'')
                    let ty = parseInt(eve.data.global.y+'')
                    let cx = tx-地图.x
                    let cy = ty-地图.y
                    地图.on('touchmove',(eve:PIXI.interaction.InteractionEvent)=>{
                        let x = parseInt(eve.data.global.x+'')
                        let y = parseInt(eve.data.global.y+'')
                        地图.x = x - cx
                        地图.y = y - cy
                        地图.移动矩形()
                    })
                    地图.once('touchend',(eve:PIXI.interaction.InteractionData)=>{
                        地图.off('touchmove')
                    })
                })
            })
        }

        private 开始游戏2(){
            let 精灵 = new PIXI.Sprite()
            let 随机地图数据 = new Array2D(100,100)
            let 所有房子 = new Array<房子>()
            let 随机房子尝试次数 = 200
            while (随机房子尝试次数 > 0 && 随机房子尝试次数--) {
                let 房子宽度 = 随机模块.范围随机整数(2,5)
                let 房子高度 = 随机模块.范围随机整数(2,5)
            }
        }
    }
}