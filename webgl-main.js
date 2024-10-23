"use strict";

import { createProgramFromScripts, resizeCanvasToDisplaySize } from "./webgl-utils.js";
import {MatrixOperations as m3} from "./matrix-operations.js";
import * as geom from "./geometry-generators.js";
import * as color_utils from "./color-utils.js";
import * as sh_ut from "./shape-utils.js";
import {Shape} from "./shape-utils.js";
import {hexToRgb} from "./color-utils.js";

function main() {
    const canvas = document.querySelector("#gl-canvas");
    const gl = canvas.getContext("webgl2");

    if (!gl) { return; }

    const program = createProgramFromScripts(gl, ["vertexShader", "fragmentShader"]);

    const attributes = {
        positionLocation: gl.getAttribLocation(program, "a_position"),
        colorLocation: gl.getAttribLocation(program, "a_color"),
    }

    const uniforms = {
        matrixLocation: gl.getUniformLocation(program, "u_matrix"),
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let points = new Shape([]);
    let triangles = new Shape([]);
    let circles = new Shape([]);
    let circleCenters = [];

    let pointsColors = [];
    let trianglesColors = [];
    let circlesColors = [];

    let pointsBuffer = createBuffer(gl);
    let trianglesBuffer = createBuffer(gl);
    let circlesBuffer = createBuffer(gl);

    let pointsColorsBuffer = createBuffer(gl);
    let trianglesColorsBuffer = createBuffer(gl);
    let circlesColorsBuffer = createBuffer(gl);

    let currentFunction = noTool;
    let isDrawing = false;

    document.getElementById("clear-canvas").addEventListener("click", clearCanvas)

    document.getElementById("bg-color").addEventListener("change", () => {
        let bgColor = getColorInput("bg-color").map((el) => el / 255);
        gl.clearColor(...bgColor, 1)

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderAll(points, triangles, circles, circleCenters,
            pointsBuffer, trianglesBuffer, circlesBuffer,
            pointsColorsBuffer, trianglesColorsBuffer, circlesColorsBuffer);
    })

    document.getElementById("point").addEventListener("click", () => {
        currentFunction = drawPoint;
    });

    document.getElementById("triangle").addEventListener("click", () => {
        currentFunction = drawTriangle;
    });

    document.getElementById("circle").addEventListener("click", () => {
        currentFunction = drawCircle;
    });

    canvas.addEventListener("mousedown", (e) => {
        switch (e.which) {
            case 1:
                currentFunction(e);
                break;
            case 3:
                document.getElementById("sh-color").click();
        }

    });

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(...getColorInput("bg-color").map((el) => el / 255), 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    function renderPoints(points, pointsBuffer, pointsColorsBuffer) {
        setAttributePointer(gl, pointsBuffer, attributes.positionLocation, 2, gl.FLOAT);
        setAttributePointer(gl, pointsColorsBuffer, attributes.colorLocation, 4, gl.UNSIGNED_BYTE);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.uniformMatrix3fv(uniforms.matrixLocation, false, matrix);

        gl.drawArrays(gl.POINTS, 0, points.length);
    }

    function renderTriangles(triangles, trianglesBuffer, trianglesColorsBuffer) {
        setAttributePointer(gl, trianglesBuffer, attributes.positionLocation, 2, gl.FLOAT);
        setAttributePointer(gl, trianglesColorsBuffer, attributes.colorLocation, 4, gl.UNSIGNED_BYTE);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.uniformMatrix3fv(uniforms.matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, triangles.length - triangles.length % 3);

        gl.drawArrays(gl.POINTS, triangles.length - triangles.length % 3, triangles.length % 3);
    }

    function renderCircles(circles, circleCenters, circlesBuffer, circlesColorsBuffer) {
        setAttributePointer(gl, circlesBuffer, attributes.positionLocation, 2, gl.FLOAT);
        setAttributePointer(gl, circlesColorsBuffer, attributes.colorLocation, 4, gl.UNSIGNED_BYTE);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.uniformMatrix3fv(uniforms.matrixLocation, false, matrix);

        for (let i = 0; i < circleCenters.length; i += 2) {
            if (circleCenters[i] === circles.verticesCoordinates.length - 2) {
                gl.drawArrays(gl.POINTS, circleCenters[i] / 2, 1);
            } else {
                gl.drawArrays(gl.TRIANGLE_FAN, circleCenters[i] / 2, 27);
            }
        }
    }

    function renderAll(
        points, triangles, circles, circleCenters,
        pointsBuffer, trianglesBuffer, circlesBuffer,
        pointsColorsBuffer, trianglesColorsBuffer, circlesColorsBuffer)
    {
        renderPoints(points, pointsBuffer, pointsColorsBuffer);
        renderTriangles(triangles, trianglesBuffer, trianglesColorsBuffer);
        renderCircles(circles, circleCenters, circlesBuffer, circlesColorsBuffer);
    }

    function clearCanvas() {
        points.verticesCoordinates = [];
        triangles.verticesCoordinates = [];
        circles.verticesCoordinates = [];
        circleCenters = []

        pointsColors = [];
        trianglesColors = [];
        circlesColors = [];

        fillBuffer(gl, pointsBuffer, new Float32Array(points.verticesCoordinates));
        fillBuffer(gl, trianglesBuffer, new Float32Array(points.verticesCoordinates));
        fillBuffer(gl, circlesBuffer, new Float32Array(points.verticesCoordinates));

        fillBuffer(gl, pointsColorsBuffer, new Uint8Array(pointsColors))
        fillBuffer(gl, trianglesColorsBuffer, new Uint8Array(pointsColors))
        fillBuffer(gl, circlesColorsBuffer, new Uint8Array(pointsColors))

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderAll(points, triangles, circles, circleCenters,
            pointsBuffer, trianglesBuffer, circlesBuffer,
            pointsColorsBuffer, trianglesColorsBuffer, circlesColorsBuffer);
    }

    function drawPoint(e) {
        points.verticesCoordinates.push(e.offsetX, e.offsetY);
        pointsColors.push(...getColorInput("sh-color"), 255);
        fillBuffer(gl, pointsBuffer, new Float32Array(points.verticesCoordinates));
        fillBuffer(gl, pointsColorsBuffer, new Uint8Array(pointsColors));

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderAll(points, triangles, circles, circleCenters,
            pointsBuffer, trianglesBuffer, circlesBuffer,
            pointsColorsBuffer, trianglesColorsBuffer, circlesColorsBuffer);
    }

    function drawTriangle(e) {
        triangles.verticesCoordinates.push(e.offsetX, e.offsetY);
        trianglesColors.push(...getColorInput("sh-color"), 255);

            fillBuffer(gl, trianglesBuffer, new Float32Array(triangles.verticesCoordinates));
            fillBuffer(gl, trianglesColorsBuffer, new Uint8Array(trianglesColors));

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderAll(points, triangles, circles, circleCenters,
            pointsBuffer, trianglesBuffer, circlesBuffer,
            pointsColorsBuffer, trianglesColorsBuffer, circlesColorsBuffer);
    }

    function drawCircle(e) {
        if (!isDrawing) {
            circles.verticesCoordinates.push(e.offsetX, e.offsetY);
            circleCenters.push(circles.verticesCoordinates.length - 2, circles.verticesCoordinates.length - 1);
            circlesColors.push(...getColorInput("sh-color"), 255);

            isDrawing = true;
        } else {
            const centerIndices = circleCenters.slice(-2);
            const centerCoordinates = circles.verticesCoordinates.slice(centerIndices[0], centerIndices[1] + 1);
            const radius = Math.hypot(e.offsetX - centerCoordinates[0], e.offsetY - centerCoordinates[1]);
            const vertices = geom.circleVertices(centerCoordinates[0], centerCoordinates[1], 25, radius)

            circles.verticesCoordinates.push(...vertices);
            circlesColors.push(...color_utils.colorFill([...getColorInput("sh-color"), 255], vertices.length / 2))

            isDrawing = false;
        }

        fillBuffer(gl, circlesBuffer, new Float32Array(circles.verticesCoordinates));
        fillBuffer(gl, circlesColorsBuffer, new Uint8Array(circlesColors));

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderAll(points, triangles, circles, circleCenters,
            pointsBuffer, trianglesBuffer, circlesBuffer,
            pointsColorsBuffer, trianglesColorsBuffer, circlesColorsBuffer);
    }

    function noTool() {
        window.alert("No drawing tool chosen!")
    }
}

function createBuffer(gl) {
    return gl.createBuffer();
}

function fillBuffer(gl, buffer, data) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
}

function setAttributePointer(gl, buffer, pointer, size, type) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(pointer);
    if (type === gl.FLOAT) {
        gl.vertexAttribPointer(pointer, size, type, false, 0, 0);
    } else if (type === gl.UNSIGNED_BYTE) {
        gl.vertexAttribPointer(pointer, size, type, true, 0, 0);
    }
}

function getColorInput(pickerId) {
    return color_utils.hexToRgb(document.getElementById(pickerId).value);
}

window.addEventListener("load", () => {main();})

