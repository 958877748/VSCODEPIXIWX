namespace 主空间 {
    export class DeadEndsDungeon extends Dungeon {

        // get showRegions():boolean{
        //     return false
        // }
        leaveOpen = 1000

        constructor() {
            super("dead-ends")//, speed: 4)
            this.showRegions = false
            this.roomTries = 0
        }


        reset() {
            super.reset()
            this._startMazeCell()
            this._growMaze(true)
            this._findOpenCells()
        }

        update() {
            if (this._openCells.length < this.leaveOpen) {
                return false
            }

            return this._removeDeadEnd()
        }
    }
}