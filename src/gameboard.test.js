import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

test("The gameboard has specific dimensions (8 x 8)", () => {
    expect(new Gameboard().numRows).toBe(8);
    expect(new Gameboard().numCols).toBe(8);
});

test("The gameboard is initially filled with zeros", () => {
    const gb = new Gameboard();
    for (let x = 0; x < gb.numCols; x++) {
        for (let y = 0; y < gb.numRows; y++) {
            expect(gb.grid[y][x]).toBe(0);
        }
    }
});

test("Out of bounds coordinates can be detected", () => {
    expect(new Gameboard().isOutOfBounds([0,0])).toBeFalsy();
})

test("The gameboard can retrieve the next coordinate in a given direction", () => {
    const gb = new Gameboard();
    const a = [4,4];
    expect(gb.nextCoord(a, Gameboard.Direction.Up)).toStrictEqual([4,5]);
    expect(gb.nextCoord(a, Gameboard.Direction.Right)).toStrictEqual([5,4]);
    expect(gb.nextCoord(a, Gameboard.Direction.Down)).toStrictEqual([4,3]);
    expect(gb.nextCoord(a, Gameboard.Direction.Left)).toStrictEqual([3,4]);
});

test("Invalid next coords result in a range error", () => {
    const gb = new Gameboard();
    expect(() => gb.nextCoord([0,0], Gameboard.Direction.Down)).toThrow(RangeError);
    expect(() => gb.nextCoord([7,7], Gameboard.Direction.Up)).toThrow(RangeError);
});

test("Gameboards initially provide a set of unplaced ships with lengths 1 to 5 (one of each)", () => {
    const gb = new Gameboard();
    const sortedLengths = gb.unplacedShips.map((ship) => ship.length).sort();
    expect(sortedLengths).toStrictEqual([1,2,3,4,5]);
});

test("A ship can be placed at a specific location", () => {
    const gb = new Gameboard();
    const ship = gb.getUnplacedShip(3);
    gb.placeShip(ship, [2,2], Gameboard.Direction.Up);
    for (let x = 0; x < gb.numCols; x++) {
        for (let y = 0; y < gb.numRows; y++) {
            if (x === 2 && y > 1 && y <5) {
                expect(gb.grid[x][y]).toBe(ship);
            } else {
                expect(gb.grid[x][y]).toBe(0);
            }
        }
    }
});

test("Ships must be taken from the unplacedShips list", () => {
    const gb = new Gameboard();
    const ship = new Ship(3);
    expect(() => gb.placeShip(ship, [0,0], Gameboard.Direction.Up)).toThrowError();
})

test("Ships must be placed at a starting coordinate inside the bounds of the grid", () => {
    const gb = new Gameboard();
    const ship = gb.getUnplacedShip(3);
    expect(() => gb.placeShip(ship, [-1, -1], Gameboard.Direction.Up)).toThrow(RangeError);
});

test("Ships must not be placed such that they extend beyond the bounds of the grid", () => {
    const gb = new Gameboard();
    const ship = gb.getUnplacedShip(3);
    expect(() => gb.placeShip(ship, [0, 0], Gameboard.Direction.Left)).toThrow(RangeError);
});

test("Ships must not be placed such that they overlap another ship", () => {
    const gb = new Gameboard();
    const shipOne = gb.getUnplacedShip(3);
    const shipTwo = gb.getUnplacedShip(4);
    gb.placeShip(shipOne, [1,1], Gameboard.Direction.Up);
    expect(() => gb.placeShip(shipTwo, [0,1], Gameboard.Direction.Right)).toThrowError();
});

test("Placing ship should remove it from unplacedShips and add it to placedShips", () => {
    const gb = new Gameboard();
    const ship = gb.getUnplacedShip(3);
    const prevNumUnplacedShips = gb.unplacedShips.length;
    const prevNumPlacedShips = gb.placedShips.length;

    gb.placeShip(ship, [0,0], Gameboard.Direction.Up);

    expect(gb.unplacedShips.length).toBeLessThan(prevNumUnplacedShips);
    expect(gb.placedShips.length).toBeGreaterThan(prevNumPlacedShips);
    expect(gb.unplacedShips.includes(ship)).toBeFalsy();
    expect(gb.placedShips.includes(ship)).toBeTruthy();
})

test("When gameboard receives attack on a ship, it causes it to be hit", () => {
    const gb = new Gameboard();
    const ship = gb.getUnplacedShip(3);
    gb.placeShip(ship, [0,0], Gameboard.Direction.Up);
    gb.receiveAttack([0,0]);
    expect(ship.hitCount).toBe(1);
});

test("The same cell cannot be the target of more than one attack", () => {
    const gb = new Gameboard();
    // Empty cell test
    gb.receiveAttack([0,0]);
    expect(() => gb.receiveAttack([0,0])).toThrowError();
    // Ship test
    const ship = gb.getUnplacedShip(3);
    gb.placeShip(ship, [2,2], Gameboard.Direction.Up);
    gb.receiveAttack([2,2]);
    expect(() => gb.receiveAttack([2,2])).toThrowError();
})

test("Gameboard recognises when all (placed) ships have been sunk", () => {
    const gb = new Gameboard();
    const ship = gb.getUnplacedShip(3);
    gb.placeShip(ship, [0,0], Gameboard.Direction.Up);

    gb.receiveAttack([0,0]);
    gb.receiveAttack([0,1]);

    expect(gb.allShipsSunk()).toBeFalsy();

    gb.receiveAttack([0,2]);

    expect(gb.allShipsSunk()).toBeTruthy();
})