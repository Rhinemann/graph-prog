class Shape {
    /**
     *
     * @param {number[]} verticesCoordinates
     */
    constructor(verticesCoordinates) {
        this.verticesCoordinates = verticesCoordinates;
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return Math.floor(this.verticesCoordinates.length / 2);
    }
}

class IndexedShape extends Shape {
    /**
     *
     * @param {number[]} verticesCoordinates
     * @param {number[]} indices
     */
    constructor(verticesCoordinates, indices) {
        super(verticesCoordinates)
        this.indices = indices;
    }

    get length() {
        return Math.floor(this.indices.length / 2);
    }
}

export {Shape, IndexedShape};

