function equilateralPolygon(centroidX, centroidY, verticesNumber, sideLength) {
    let coords = new Array(verticesNumber * 2);

    const vNumbCoefficient = sideLength / (2 * Math.sin(Math.PI / verticesNumber));
    for (let i = 0; i < verticesNumber; i++) {
        const theta = 2 * i * Math.PI / verticesNumber;
        const x = vNumbCoefficient * Math.cos(theta);
        const y = vNumbCoefficient * Math.sin(theta);
        coords[2 * i] = x;
        coords[2 * i + 1] = y;
    }

    return coords;
}

function equilateralPolygonVertices(centroidX, centroidY, verticesNumber, sideLength) {
    if (verticesNumber < 5) {return equilateralPolygon(centroidX, centroidY, verticesNumber, sideLength);}
    else {
        const math_points = [centroidX, centroidY].concat(...equilateralPolygon(centroidX, centroidY, verticesNumber, sideLength));
        math_points.push(math_points[2], math_points[3]);
        return math_points;
    }
}

function circleVertices(centroidX, centroidY, verticesNumber, radius) {
    let vertices = new Array((verticesNumber + 1) * 2);

    for (let i = 0; i < verticesNumber; i++) {
        const phase = 2 * Math.PI * i / verticesNumber;
        vertices[i * 2] = centroidX + Math.cos(phase) * radius;
        vertices[i * 2 + 1] = centroidY + Math.sin(phase) * radius;
    }

    vertices[vertices.length - 2] = vertices[0];
    vertices[vertices.length - 1] = vertices[1];

    return vertices;
}

export { equilateralPolygonVertices, circleVertices };
