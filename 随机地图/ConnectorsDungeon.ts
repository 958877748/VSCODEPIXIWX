namespace 主空间 {
    export class ConnectorsDungeon extends Dungeon {
        constructor() {
            super("connectors")
        }

        _tiles//:Iterator<Vec>

        reset() {
            super.reset()
        }

        update() {
            if (this._tiles == null) {
                this._addRoom(true)

                while (this._startMaze()) this._growMaze(true)
                this._findOpenCells()

                this._tiles = this._floors.bounds.inflate(-1).iterator
                return true
            }

            return this._findConnector()
        }

        _startMerge() { }

        _findConnector(): boolean {
            while (this._tiles.moveNext()) {
                var pos = this._tiles.current

                // Can't already be part of a region.
                if (this._floors[pos] > CELL_SOLID) continue

                var regions = this._getRegionsTouching(pos)
                if (regions.length < 2) continue

                this._drawConnector(pos)
                return true
            }

            this._tiles = null
            return false
        }
    }
}