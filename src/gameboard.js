import { Ship } from "./ship";

export class Gameboard {
    static Direction = {
        Up: "up", Right: "right", Down: "down", Left: "left"   
    };

    static oobMessage(coord) {
        return `Coordinate (x: ${coord[0]}, y: ${coord[1]}) is out of range ` +
        `(grid dimensions: ${this.numCols} x ${this.numRows})`;
    } 

    grid = Array.from(new Array(8), () => new Array(8).fill(0));

    get numRows() {
        return this.grid.length;
    }

    get numCols() {
        return this.grid[0].length;
    }

    unplacedShips = Array.from(new Array(5)).map((v, i) => new Ship(i+1));

    placedShips = [];

    allShipsSunk() {
        return this.placedShips.reduce((prev, current) => {
            return prev && current.isSunk
        }, true)
    }

    isBlank(coord) {
        return this.grid[coord[0]][coord[1]] === 0;
    }

    isOutOfBounds(coord) {
        return (
            coord[0] < 0
            || coord[1] < 0
            || coord[0] >= this.numCols
            || coord[1] >= this.numRows
        )
    }

    placeShip(ship, coord, direction) {
        const shipIndex = this.unplacedShips.indexOf(ship)
        if (this.isOutOfBounds(coord)) {
            throw new RangeError(Gameboard.oobMessage(coord));
        }
        if (shipIndex < 0) {
            throw new RangeError("Ship must be taken from Gameboard.unplacedShips");
        }
        let next = coord;
        for (let i = 0; i < ship.length; i++) {
            if (!this.isBlank(next)) {
                throw Error(`Trying to place ship over an occupied space: ${next}`)
            }
            this.grid[next[0]][next[1]] = ship;
            try {
                next = this.nextCoord(next, direction);
            } catch (e) {
                if (e instanceof RangeError) {
                    throw RangeError(
                        `Trying to place a ${ship.length}-long ship at (x: ${coord[0]}, y: ${coord[1]} ` +
                        `in the ${direction} direction causes the ship to extend out of bounds`
                    )
                }
            }
        }
        this.unplacedShips.splice(shipIndex, 1);
        this.placedShips.push(ship);
    }

    nextCoord(start, direction) {
        let deltaX = 0;
        let deltaY = 0;
        switch (direction) {
            case Gameboard.Direction.Up:
                deltaY = 1;
                break;
            case Gameboard.Direction.Right:
                deltaX = 1;
                break;
            case Gameboard.Direction.Down:
                deltaY = -1;
                break;
            case Gameboard.Direction.Left:
                deltaX = -1;
                break;
        }
        const [newX, newY] = [start[0] + deltaX, start[1] + deltaY];
        // Check bounds
        if (this.isOutOfBounds([newX, newY])) {
            throw new RangeError(Gameboard.oobMessage([newX, newY]));
        }
        return [newX, newY];
    }

    getUnplacedShip(length) {
        return this.unplacedShips.find((ship => ship.length == length));
    }

    receiveAttack(coord) {
        const cellValue = this.grid[coord[0]][coord[1]];
        if (cellValue > 0) {
            throw Error(`The cell (x: ${coord[0]}, y: ${coord[1]}) has already been attacked`);
        }
        if (cellValue instanceof Ship) {
            cellValue.hit();
            this.grid[coord[0]][coord[1]] = 1;
            if (this.allShipsSunk()) {
                this.gameOver();
            }
        } else {
            this.grid[coord[0]][coord[1]] = 2;
        }
    }

    gameOver() {
        
    }
}