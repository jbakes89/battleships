import { Ship } from "./ship";

test("New ships must be created with a length", () => {
    expect(Ship).toThrow(TypeError);
});

test("Ship length must be greater than 0", () => {
    expect(() => new Ship(0)).toThrow(RangeError);
    expect(() => new Ship(-1)).toThrow(RangeError);
})

test("Ship length must be an integer", () => {
    expect(() => new Ship(1.5)).toThrow(TypeError);
})

test("New ships have a hit count of 0", () => {
    expect(new Ship(3).hitCount).toBe(0);
})

test("Ships can be hit, and being hit increases the hit count by 1", () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hitCount).toBe(1);
    ship.hit();
    expect(ship.hitCount).toBe(2);
})

test("Once Ship.hitCount === Ship.length, the ship should be sunk", () => {
    const ship = new Ship(3);
    while (ship.hitCount < ship.length) {
        ship.hit();
    }
    expect(ship.isSunk).toBeTruthy;
})

test("Hitting a sunk ship shouldn't increase hitCount", () => {
    const ship = new Ship(3);
    while (ship.hitCount < ship.length) {
        ship.hit();
    }
    ship.hit();
    expect(ship.hitCount).toBe(ship.length);
})