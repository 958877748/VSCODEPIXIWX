namespace 主空间{
    export class MazeFillDungeon extends Dungeon {
        constructor(){
            super("maze-fill")//, roomTries: 600)
        }

        update():boolean{
            return this._addRoom() || this._growMaze() || this._startMaze()
        }

        _findConnectors() {}
    }
}