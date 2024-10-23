class MatrixOperations {
    static multiply(a, b) {
        const a00 = a[0 + 0], a01 = a[0 + 1], a02 = a[0 + 2];
        const a10 = a[3 + 0], a11 = a[3 + 1], a12 = a[3 + 2];
        const a20 = a[6 + 0], a21 = a[6 + 1], a22 = a[6 + 2];
        const b00 = b[0 + 0], b01 = b[0 + 1], b02 = b[0 + 2];
        const b10 = b[3 + 0], b11 = b[3 + 1], b12 = b[3 + 2];
        const b20 = b[6 + 0], b21 = b[6 + 1], b22 = b[6 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    }

    static identity() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }

    static translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    }

    static translate(matrix, tx, ty) {
        return this.multiply(matrix, this.translation(tx, ty));
    }

    static rotation(angleInRadians) {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }

    static rotate(matrix, angleInRadians) {
        return this.multiply(matrix, this.rotation(angleInRadians));
    }

    static scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    static scale(matrix, sx, sy) {
        return this.multiply(matrix, this.scaling(sx, sy));
    }

    static projection(width, height) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1,
        ]
    }
}

export { MatrixOperations };
