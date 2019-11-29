namespace 主空间{
    const TILE_SIZE = 12

    const TILE_FLOOR = 0
    const TILE_SOLID = 1
    const TILE_WALL = 2
    const TILE_H_DOOR = 3
    const TILE_V_DOOR = 4

    const CELL_SOLID = 0
    const CELL_MERGED = -1
    const CELL_DOOR = -2

    const WIGGLE_PERCENT = 50
    export class Dungeon{
        
        //画布
        _canvas:any//HtmlCanvasElement;
        //画布上下文
        _context:any//CanvasRenderingContext2D;

        readonly cellSize:number
        readonly speed:number
        roomTries:number

        /**
         * 最大房间大小
         */
        maxRoomSize:number

        /**
         * 运行中
         */
        _running:boolean = false

        _floors:Array2D<number>//Array2D<int> 

        /**
         * 所有生成的房子
         */
        private readonly _rooms//:Array<Rect>

        /**
         * 房间尝试次数
         */
        private _roomTriesLeft:number
        _currentRegion:number

        // 当前迷宫的起始位置。
        // Starting position of the current maze.
        /**
         * 迷宫起始X
         */
        _mazeStartX:number
        /**
         * 迷宫起始Y
         */
        _mazeStartY:number

        /**
         * 最后一个迷宫点
         */
        _lastMazeDir:Vec

        // 当前迷宫正在生成的开放单元格。
        // The open cells for the current maze being generated.
        readonly _mazeCells:ArrayList<Vec>

        //List<Vec> _connectors;
        _connectors:ArrayList<Vec>

        //final _mergeCells = new Queue<Vec>()
        readonly _mergeCells:ArrayList<Vec>

        //final _openCells = <Vec>[];
        readonly _openCells

        _deadEndSeek:number

        // 单元格中的地牢大小, 而不是像素。
        // Size of the dungeon in cells, not pixels.
        _dungeonWidth:number
        _dungeonHeight:number

        _scale:any//double

        showRegions:boolean = true

        constructor(id:string,cellSize?:number,speed?:number,roomTries?:number,maxRoomSize?:number){
            cellSize?this.cellSize=cellSize:this.cellSize=6
            speed?this.speed=speed:this.speed=2
            roomTries?this.roomTries=roomTries:this.roomTries=200
            maxRoomSize?this.maxRoomSize=maxRoomSize:this.maxRoomSize=5
            //拿到画布
            //this._canvas = html.querySelector("#$id") as html.CanvasElement
            //拿到画布上下文
            //this._context = _canvas.context2D

            let width = 570
            let height = 390

            //  ~/  为先除法再向下取整
            this._dungeonWidth = parseInt(width/this.cellSize + '')
            this._dungeonHeight = parseInt(height/this.cellSize + '')

            // Handle high-resolution (i.e. retina) displays.
            this._scale = 1//html.window.devicePixelRatio;
            this._canvas.width = (width * this._scale)//.toInt();
            this._canvas.height = (height * this._scale)//.toInt();

            // Array2D 应该为一个2维数组
            //_floors = new Array2D<int>(_dungeonWidth, _dungeonHeight);
            this._floors = new Array2D<number>(this._dungeonWidth,this._dungeonHeight)
            //监听画布点击,随机开始
            //this._canvas.onClick.listen((_) {
                //重置
                this.reset()
                //开始随机
                this.start()
            //});
        
            this.reset()
        }

        /**
         * 开始随机
         */
        start() {
            //以16.6ms的间隔调用tick方法
            if (!this._running) {
                window.requestAnimationFrame(this.tick)
            }
            this._running = true
        }

        tick(time) {
            for (var i = 0; i < this.speed; i++) {
                if (!this.update()) {
                    this._running = false
                    return
                }
            }
            window.requestAnimationFrame(this.tick)
        }

        /**
         * 重置所有
         */
        reset() {
            this._roomTriesLeft = this.roomTries;
            this._rooms.clear();
        
            this._currentRegion = 0;
        
            this._mazeStartX = 1;
            this._mazeStartY = 1;
            this._lastMazeDir = null;
        
            this._connectors = []
            
            // 当前迷宫正在生成的开放单元格。
            // The open cells for the current maze being generated.
            this._mazeCells.clear()
            //this._mergeCells.clear()
        
            this._openCells.clear()
        
            // for (var pos in _floors.bounds) {
            //   _carve(pos, CELL_SOLID);
            // }
        }   
        
        update():boolean {
            //先添加一个房子,有一个返回true,就不继续运行下去
            return this._addRoom() 
                || this._growMaze() 
                || this._startMaze() 
                || this._fillMerge() 
                || this._mergeRegion() 
                || this._removeDeadEnd()
        }

        /**
         * 添加一个房子
         * @param fast 是否只添加一个房子(默认值=false,会尝试所有次数取添加房子)
         * @returns 添加房子是否成功
         */
        _addRoom(fast:boolean = false):boolean {

            //如果房间尝试次数小于等于0,则返回false
            if (this._roomTriesLeft <= 0) return false

                //循环递减尝试次数至0
                while (this._roomTriesLeft >= 0,this._roomTriesLeft--) {

                    var width = this.范围随机(2, this.maxRoomSize) * 2 + 1
                    var height = this.范围随机(2, this.maxRoomSize) * 2 + 1
                    
                    let m1 = parseInt((this._dungeonWidth - width)/ 2 +'')
                    let m2 = parseInt((this._dungeonHeight - height) / 2+'')
                    var x = this.范围随机(0, m1) * 2 + 1
                    var y = this.范围随机(0, m2) * 2 + 1
                
                    //创建一个房子,随机x, y, width, height
                    let 房子 = new Rect(x, y, width, height)
        
                    let 是否重叠 = false
                    for (var other in this._rooms) {
                        if (房子.distanceTo(this._rooms[other]) <= 0) {
                            //如果房子和其他所有房子中的一个房子的距离小于等于0
                            //则房子重叠,跳出循环
                            是否重叠 = true
                            break
                        }
                    }
        
                    //如果重叠了跳出本次while循环,继续下次while循环
                    if (是否重叠) continue
        
                    //没有重叠就加入房子集合中
                    this._rooms.add(房子)
                    //计数加1
                    this._currentRegion++
                    房子.forEach(this._carve)
        
                    //如果fast为true,则只添加一个房子
                    if (!fast) return true
                }
        
            return false
        }

        /**
         * 启动迷宫
         */
        _startMaze() {
            if (this._mazeStartY >= this._dungeonHeight - 1) return false
        
            // 找到下一个坚实的地方开始迷宫。
            // Find the next solid place to start a maze.
            while (this._floors.get(this._mazeStartX, this._mazeStartY) != CELL_SOLID) {
                this._mazeStartX += 2
                if (this._mazeStartX >= this._dungeonWidth - 1) {
                    this._mazeStartX = 1
                    this._mazeStartY += 2
            
                    // 如果我们扫描了整个地牢就停下来
                    // Stop if we've scanned the whole dungeon.
                    if (this._mazeStartY >= this._dungeonHeight - 1) {
                        this._findConnectors()
                        return false
                    }
                }
            }
        
            this._startMazeCell()
            return true
        }

        /**
         * 开始迷宫雕刻
         */
        _startMazeCell() {
            //从迷宫起点开始雕刻
            var pos = new Vec(this._mazeStartX, this._mazeStartY)
            //加入所有雕刻点
            this._mazeCells.add(pos)
            //当前雕刻数加1
            this._currentRegion++
            //雕刻此点
            this._carve(pos)
        }

        /**
         * 第二步,迷宫房子周围生长满通道
         * @param fast 
         */
        _growMaze(fast=false) {
            //如果迷宫格子是空的,返回false
            if (this._mazeCells.isEmpty) return false
        
            //当迷宫格子不为空
            while (this._mazeCells.isNotEmpty) {
                //从现有的迷宫格子中获取最后一个迷宫单元格
                let cell = this._mazeCells.last
        
                // 查看相邻的单元格处于打开状态。
                // See which adjacent cells are open.
                let 相邻的点且可打开 = new ArrayList<Vec>()
        
                let 相邻的点 = new ArrayList<Vec>()
                let 上 = new Vec(cell.x,cell.y-1)
                let 下 = new Vec(cell.x,cell.y+1)
                let 左 = new Vec(cell.x-1,cell.y)
                let 右 = new Vec(cell.x+1,cell.y)
                相邻的点.add(上)
                相邻的点.add(下)
                相邻的点.add(左)
                相邻的点.add(右)

                相邻的点.forEach(点 => {
                    //包含此点,且此点是固体
                    if (this._floors.bounds.contains(点) && this._floors.get(点.x,点.y) == CELL_SOLID) {
                        相邻的点且可打开.add(点)
                    } 
                })
        
                // 如果里没有一个元素
                if (相邻的点且可打开.isEmpty) {
                    // 没有相邻的未雕刻单元格。
                    // 删除最后一个元素
                    this._mazeCells.removeLast()
                    // 循环继续
                    continue
                }
        
                let dir:Vec
                //如果 openDirs 包含 this._lastMazeDir 且 2分之1的概率
                if (相邻的点且可打开.contains(this._lastMazeDir) && this.范围随机(0,100) > WIGGLE_PERCENT) {
                    dir = this._lastMazeDir
                } else {
                    //这句可能意思是,在列表中随机一个
                    //dir = rng.item(相邻的点且可打开)
                }
        
                this._lastMazeDir = dir
        
                // this._carve(cell + dir)
                // this._carve(cell + dir * 2)
        
                //将雕刻过的格子添加到_mazeCells
                //this._mazeCells.add(cell + dir * 2)
        
                // 取得了进展, 所以刷新。
                // Made progress, so refresh.
                if (!fast) return true
            }
        
            return false
        }

        _findConnectors() {
            for (var pos in this._floors.bounds.inflate(-1)) {
                // 不可能已经是一个地区的一部分。
                // Can't already be part of a region.
                if (this._floors[pos] > CELL_SOLID) continue
            
                var regions = this._getRegionsTouching(pos)
                if (regions.length < 2) continue
            
                this._connectors.add(pos)
            }
        
            this._connectors.shuffle()
        
            // 通过将一个房间转换为合并颜色来启动合并。
            // Start the merge by turning one room into the merge color.
            this._startMerge()
        }

        _startMerge() {
            this._mergeCells.add(this._rooms.first.center)
            this._carve(this._rooms.first.center, CELL_MERGED)
        }

        /**
         * 合并区域
         */
        _mergeRegion() {
            if (this._connectors.isEmpty) return false
        
            // Find a connector that's touching the merged area.
            var connector
            var merged
            for (var i = 0; i < this._connectors.length; i++) {
                merged = this._getRegionsTouching(this._connectors[i])
                if (merged.contains(CELL_MERGED)) {
                    connector = this._connectors[i]
                    this._connectors.removeAt(i)
                    break
                }
            }
        
            // 删除不再需要的所有连接器。
            // Remove any connectors that aren't needed anymore.
            this._connectors.removeWhere((pos)=>{
                // 不允许连接器彼此相邻。
                // Don't allow connectors right next to each other.
                if (connector - pos < 2) return true
            
                // 如果连接器没有较长的时间跨越不同的区域, 我们不需要它。
                // If the connector no long spans different regions, we don't need it.
                var regions = this._getRegionsTouching(pos)
                    .where((region) => !merged.contains(region))
                if (regions.isNotEmpty) return false
            
                // 这个连接器是不需要的, 但偶尔连接它, 这样地牢就不会单独连接。
                // This connecter isn't needed, but connect it occasionally so that the
                // dungeon isn't singly-connected.
                if (rng.oneIn(50)) this._carve(pos, CELL_DOOR)
            
                return true
            })
        
            // 启动合并洪水填充。
            // Start the merge floodfill.
            this._mergeCells.add(connector)
            this._carve(connector, CELL_DOOR)
            return true
        }

        /**
         * 填充合并
         */
        _fillMerge() {
            if (this._mergeCells.isEmpty) return false
        
            while (this._mergeCells.isNotEmpty) {
                var pos = this._mergeCells.removeFirst()
            
                for (var dir in Direction.CARDINAL) {
                    var here = pos + dir
                    if (this._floors[here] <= CELL_SOLID) continue
            
                    this._carve(here, CELL_MERGED)
                    this._mergeCells.add(here)
                }
            
                break
            }
        
            // Done merging, so get ready to remove the dead ends.
            if (this._mergeCells.isEmpty && this._connectors.isEmpty) {
                this._findOpenCells()
            }
        
            return true
        }

        _findOpenCells() {
            for (var pos in this._floors.bounds.inflate(-1)) {
              if (this._floors[pos] != CELL_SOLID) this._openCells.add(pos)
            }
        
            this._openCells.shuffle()
            this._deadEndSeek = 0
        }

        /**
         * 删除死端
         */
        _removeDeadEnd() {
            if (this._openCells.isEmpty) return false
        
            var start = this._deadEndSeek
        
            while (true) {
                var pos = this._openCells[this._deadEndSeek]
            
                // 如果它只有一个出口, 那就是死胡同。
                // If it only has one exit, it's a dead end.
                var exits = 0
                for (var dir in Direction.CARDINAL) {
                    if (this._floors[pos + dir] != CELL_SOLID) exits++
                }
            
                if (exits == 1) {
                    this._carve(pos, CELL_SOLID)
                    this._openCells.removeAt(this._deadEndSeek)
                    if (this._deadEndSeek == this._openCells.length) this._deadEndSeek = 0
                    return true
                }
        
                // 转到下一个候选人。
                // Move on to the next candidate.
                this._deadEndSeek = (this._deadEndSeek + 1) % this._openCells.length
        
                // 如果我们做了一个完整的周期, 没有找到死胡同, 就不能再有了。
                // If we did a full cycle and didn't find a dead end, there must not be
                // any more.
                if (this._deadEndSeek == start) {
                    this._openCells.clear()
                    break
                }
            }
        
            return false
        }

        _getRegionsTouching(pos:Vec ) {
            var regions = new Set<number>()
            for (var dir in Direction.CARDINAL) {
              var region = this._floors[pos + dir]
              if (region != CELL_SOLID) regions.add(region)
            }
        
            return regions
        }

        /**
         * 雕刻
         */
        _carve(pos:Vec,value?:number) {
            if (value == null) {
                if (this.showRegions) {
                    value = this._currentRegion
                } else {
                    value = CELL_MERGED
                }
            }
        
            //给2维数组中指定坐标赋值一个元素
            this._floors.set(pos,value)
        
            if (value > CELL_SOLID) {
                // 打开区域。
                // Open region.
                this._drawTile(pos.x, pos.y, TILE_FLOOR);
        
                // 画笔填充样式
                this._context.fillStyle = 'hsla(${value * 17 % 360}, 100%, 20%, 0.5)'
                // 画笔填充矩形
                // this._context.fillRect(
                //     pos.x * cellSize * _scale, pos.y * cellSize * _scale,
                //     cellSize * _scale, cellSize * _scale)
            } else if (value == CELL_SOLID) {
                // 画墙。
                // Draw the wall.
                if (pos.y < this._dungeonHeight - 1 &&
                    this._floors.get(pos.x, pos.y + 1) != CELL_SOLID) {
                        this._drawTile(pos.x, pos.y, TILE_WALL);
                } else {
                    this._drawTile(pos.x, pos.y, TILE_SOLID);
                }
        
                // 如果上面的瓷砖是一堵墙, 现在是实心的。
                // If the tile above this was a wall, it's solid now.
                if (pos.y > 0 && this._floors.get(pos.x, pos.y - 1) == CELL_SOLID) {
                    this._drawTile(pos.x, pos.y - 1, TILE_SOLID);
                }
            } else if (value == CELL_DOOR) {
                // Draw the door.
                if (this._floors.get(pos.x - 1, pos.y) == CELL_SOLID) {
                    this._drawTile(pos.x, pos.y, TILE_H_DOOR);
                } else {
                    this._drawTile(pos.x, pos.y, TILE_V_DOOR);
                }
            
                // Make solid above this a wall.
                if (pos.y > 0 && this._floors.get(pos.x, pos.y - 1) == CELL_SOLID) {
                    this._drawTile(pos.x, pos.y - 1, TILE_WALL);
                }
            } else {
                this._drawTile(pos.x, pos.y, TILE_FLOOR);
            
                // Make solid above this a wall.
                if (pos.y > 0 && this._floors.get(pos.x, pos.y - 1) == CELL_SOLID) {
                    this._drawTile(pos.x, pos.y - 1, TILE_WALL);
                }
            }
        }

        /**
         * 绘制磁贴
         */
        _drawTile(x:number, y:number, tile:number) {
            //绘制图像缩放从源
            this._context.drawImageScaledFromSource(_tileset,
                tile * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE,
                x * this.cellSize * this._scale, y * this.cellSize * this._scale,
                this.cellSize * this._scale, this.cellSize * this._scale);
        }

        /**
         * 绘制连接器
         */
        _drawConnector(pos:Vec) {
            this._context.fillStyle = '#ca8'
            this._context.fillRect(
               (pos.x * this.cellSize + 2) * this._scale,
               (pos.y * this.cellSize + 2 ) * this._scale,
               (this.cellSize - 4) * this._scale, (this.cellSize - 4) * this._scale)
        }

        范围随机(最小:number,最大:number){
            //在最大和最小的范围内随机出一个数
            let 随机数 = Math.random()
            let 随机范围 = 最大 - 最小
            let 未取整的随机数 = 随机数 * 随机范围 + 最小
            return parseInt(未取整的随机数+'')
        }
    }
}