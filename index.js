"use strict";
const canvas = document.querySelector("#canvas"), gl = canvas.getContext("webgl"), screenWidth = canvas.width, screenHeight = canvas.height, halfScreenWidth = canvas.width / 2, halfScreenHeight = canvas.height / 2;
// check gl.
if (gl == null) {
    throw "GL Assignment failed";
}
// Step 1, create graphics objects and shader program object.
let vertexBuffer = gl.createBuffer();
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
let shaderProgram = gl.createProgram();
if (shaderProgram == null) {
    throw "shaderProgram failed";
}
// Step 2, set code for shaders.
let vertCode = `
        attribute vec2 coordinates;
        void main(void) 
        {
            gl_Position = vec4(coordinates, 0.0, 1.0);
            gl_PointSize = 1.0;
        }`;
let fragCode = `
        void main(void)
        { 
            // Red green blue alpha
            gl_FragColor = vec4(100.0,0.0,0.0, 0.5);
        }`;
// Step3 Compile.
// For the fragment shader.
if (fragmentShader != null) {
    gl.shaderSource(fragmentShader, fragCode);
    gl.compileShader(fragmentShader);
    console.log(gl.getShaderInfoLog(fragmentShader));
}
// For the VertexShader.
if (vertexShader != null) {
    gl.shaderSource(vertexShader, vertCode);
    gl.compileShader(vertexShader);
    console.log(gl.getShaderInfoLog(vertexShader));
}
else {
    throw "vertexShader null";
}
// Step4 Attach and link.
if (shaderProgram != null
    && vertexShader != null
    && fragmentShader != null) {
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    console.log(gl.getProgramInfoLog(shaderProgram));
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
}
else {
    throw "ShaderProgram invaild";
}
// Step5 bind
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
let coord;
// Other
if (shaderProgram != null) {
    coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.viewport(0, 0, canvas.width, canvas.height);
}
const glDraw = (vertBuffer, array, type, length) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.drawArrays(type, 0, length);
};
const translateX = (num) => {
    if (num == 0) {
        return -1;
    }
    else if (num == screenWidth) {
        return 1;
    }
    else if (num == halfScreenWidth) {
        return 0;
    }
    else {
        return num / halfScreenWidth - 1;
    }
};
const translateY = (num) => {
    if (num == 0) {
        return 1;
    }
    else if (num == screenHeight) {
        return -1;
    }
    else if (num == halfScreenHeight) {
        return 0;
    }
    else {
        return num / halfScreenHeight * -1 + 1;
    }
};
const drawLine = (x, y, endX, endY) => {
    const line = [
        translateX(x),
        translateY(y),
        translateX(endX),
        translateY(endY)
    ];
    glDraw(vertexBuffer, line, gl.LINES, line.length);
};
// Incorrect because too small.
const drawRectangleLines = (x, y, width, height) => {
    x = translateX(x);
    width /= halfScreenHeight;
    y = translateY(y);
    height /= halfScreenWidth;
    // TODO: Fix hacks.
    // Will have to write down the math to make this
    // correct.
    // Could also jsut draw a rectangle and erase the
    // middle.
    const lines = [
        x, y,
        x + width + 0.015, y,
        x + width + 0.015, y,
        x + width + 0.015, y - height - 0.23,
        x + width + 0.015, y - height - 0.23,
        x, y - height - 0.23,
        x, y - height - 0.23,
        x, y,
    ];
    glDraw(vertexBuffer, lines, gl.LINES, lines.length);
};
const drawRectangle = (x, y, width, height) => {
    let points = []; // Array holding all of the points we will draw.
    x = translateX(x);
    y = translateY(y);
    width /= halfScreenHeight;
    height /= halfScreenWidth;
    // TODO: Handle negative x and y.
    for (let xPos = x; xPos < width + x; xPos += 0.001) {
        for (let yPos = y; yPos > y - height; yPos -= 0.001) {
            points.push(xPos, yPos);
        }
    }
    glDraw(vertexBuffer, points, gl.POINTS, points.length);
};
drawRectangle(100, 100, 500, 500);
