/**
 * @typedef {(0x8B30|0x8B31)} WebGLShaderType
 */

/**
 * Creates and compiles a shader.
 *
 * @param {WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {WebGLShaderType} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
    // Create the shader object
    const shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation; get the error
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {WebGLRenderingContext} gl The WebGL context.
 * @param {WebGLShader} vertexShader A vertex shader.
 * @param {WebGLShader} fragmentShader A fragment shader.
 * @return {WebGLProgram} A program.
 */
function createProgram(gl, vertexShader, fragmentShader) {
    // create a program.
    const program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw ("program failed to link:" + gl.getProgramInfoLog (program));
    }

    return program;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} fileSource
 * @param {WebGLShaderType} shaderType
 */
async function createShaderFromFile(gl, fileSource, shaderType) {
    const response = await fetch(fileSource);
    if (!response.ok) {
        throw("Shader: " + fileSource + " not found!");
    }
    const shaderText = await response.text();
    console.log(shaderText);

    return compileShader(gl, shaderText, shaderType)
}

/**
 * Creates a program from 2 shader files.
 *
 * @param {WebGLRenderingContext} gl The WebGL Context.
 * @param {string[]} shaderURLs Array of ids of the script
 *        tags for the shaders. The first is assumed to be the
 *        vertex shader, the second the fragment shader.
 * @return {WebGLProgram} A program
 */
async function createProgramFromFiles(
    gl, shaderURLs) {
    const vertexShader = await createShaderFromFile(gl, shaderURLs[0], gl.VERTEX_SHADER);
    const fragmentShader = await createShaderFromFile(gl, shaderURLs[1], gl.FRAGMENT_SHADER);
    return createProgram(gl, vertexShader, fragmentShader);
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
    }
    return false;
}

export { createProgramFromFiles, resizeCanvasToDisplaySize }
