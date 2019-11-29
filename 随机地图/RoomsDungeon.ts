namespace 主空间{
    export class RoomsDungeon extends Dungeon {
        constructor(){
            super("rooms") 
            this.showRegions = false
        }

        update() {
            return this._addRoom()
        }
    }
}