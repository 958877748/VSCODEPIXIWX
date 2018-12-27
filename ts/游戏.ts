namespace 主空间 {
    export class 游戏 {
        主舞台: PIXI.Container
        constructor(舞台: PIXI.Container) {
            this.主舞台 = 舞台
            this.开始游戏()
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
                    console.log('canshu')
                    let tx = parseInt(eve.data.global.x+'')
                    let ty = parseInt(eve.data.global.y+'')
                    let cx = tx-地图.x
                    let cy = ty-地图.y
                    地图.on('touchmove',(eve:PIXI.interaction.InteractionEvent)=>{
                        console.log('canshu')
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

                
                // let sheet = PIXI.loader.resources['dilao']
                // let text = sheet.textures['tiles-9.png']
                // let sp = new PIXI.Sprite(text)
                // sp.x = 0
                // sp.y = 0
                // sp.interactive = true
                // sp.on('touchstart',()=>{
                //     let sjs = Math.random()*29 +''
                //     sp.texture = sheet.textures['tiles-'+parseInt(sjs)+'.png']
                // })
                // this.主舞台.addChild(sp)
                // let text2 = sheet.textures['tiles-1.png']
                // let sp2 = new PIXI.Sprite(text2)
                // sp2.x = 24
                // sp2.y = 0
                // sp2.interactive = true
                // sp2.on('click',()=>{
                //     let sjs = Math.random()*29 +''
                //     sp2.texture = sheet.textures['tiles-'+parseInt(sjs)+'.png']
                // })
                // this.主舞台.addChild(sp2)
            })
        }
    }
}