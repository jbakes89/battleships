export class Ship {
    hitCount = 0;

    constructor(length) {
        if (length < 1) {
            throw RangeError("Ship length must be an integer greater than 0");
        } else if (!Number.isInteger(length)) {
            throw TypeError("Ship length must be an integer greater than 0");
        }
        this.length = length;
    }

    hit() {
        if (!this.isSunk) {
            this.hitCount += 1;
        }
    }

    get isSunk() {
        return this.hitCount === this.length
    }
}