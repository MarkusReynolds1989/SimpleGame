const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");
const SCREEN_WIDTH = canvas.width;
const HALF_SCREEN_WIDTH = canvas.width / 2;
const SCREEN_HEIGHT = canvas.height;
const HALF_SCREEN_HEIGHT = canvas.height / 2;
// Alert if web gl fails.
if (gl === null) {
    alert("No web gl.");
    return;
}

// New buffer object.
let vertex_buffer = gl.createBuffer();

// Vertex shader source code
let vertCode = `
           attribute vec2 coordinates;
           void main(void) 
           {
               gl_Position = vec4(coordinates,0.0, 1.0);
               gl_PointSize = 1.0;
           }`;

// Vertex shader object.
let vertShader = gl.createShader(gl.VERTEX_SHADER);

// attach vertex shader code
gl.shaderSource(vertShader, vertCode);

// compile vertex shader
gl.compileShader(vertShader);

// Fragment shader code
let fragCode = `
       void main(void) 
       {
           // Red green blue alpha
           gl_FragColor = vec4(255.0,255.0,255.0,0.5);
       }`;

// create frag shader object
let fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// attach frag to code
gl.shaderSource(fragShader, fragCode);

// compile frag
gl.compileShader(fragShader);

// Shader object for vertex/frag shader combo
var shaderProgram = gl.createProgram();

// attach vertex shader
gl.attachShader(shaderProgram, vertShader);

gl.attachShader(shaderProgram, fragShader);

gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram);

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

let coord = gl.getAttribLocation(shaderProgram, "coordinates");

gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(coord);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);

// Fill, empty, and draw the buffer.
// vertBuffer is the buffer from the shader.
// Array is the items you want to draw.
const glDraw = (vertBuffer, array, type, length) => {
    // Bind empty array to buffer object.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    // Pass vertices data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    // Unbind buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Draw items.
    gl.drawArrays(type, 0, length);
};

// Takes a number and translate it from an integer
// to a float on the x axis for vertex
// writing. Only for finding points, not good for
// drawing squares.
const translateX = (num) => {
    if (num == 0) {
        return -1;
    } else if (num == SCREEN_WIDTH) {
        return 1;
    } else if (num == HALF_SCREEN_WIDTH) {
        return 0;
    } else {
        return num / HALF_SCREEN_WIDTH - 1;
    }
};

// See above, same except for y.
const translateY = (num) => {
    if (num == 0) {
        return 1;
    } else if (num == SCREEN_HEIGHT) {
        return -1;
    } else if (num == HALF_SCREEN_HEIGHT) {
        return 0;
    } else {
        return (num / HALF_SCREEN_HEIGHT) * -1 + 1;
    }
};

// TODO: Implement colors for drawing functions.
// Takes two points and draws a line between them.
const drawLine = (x, y, endX, endY) => {
    const line = [
        translateX(x),
        translateY(y),
        translateX(endX),
        translateY(endY),
    ];

    glDraw(vertex_buffer, line, gl.LINES, line.length);
};

// Incorrect because too small.
const drawRectangleLines = (x, y, width, height) => {
    x = translateX(x);
    width /= HALF_SCREEN_WIDTH;
    y = translateY(y);
    height /= HALF_SCREEN_WIDTH;
    // TODO: Fix hacks.
    // Will have to write down the math to make this
    // correct.
    // Could also jsut draw a rectangle and erase the
    // middle.
    lines = [
        x, y,
        x + width + 0.015, y, // To the right
        x + width + 0.015, y,
        x + width + 0.015, y - height - 0.23, // To the bottom
        x + width + 0.015, y - height - 0.23,
        x, y - height - 0.23, // To the bottom and
        x, y - height - 0.23,
        x, y, // To the top
    ];

    glDraw(vertex_buffer, lines, gl.LINES, lines.length);
};

const drawRectangle = (x, y, width, height) => {
    let points = []; // Array holding all of the points we will draw.
    x = translateX(x);
    y = translateY(y);
    width /= HALF_SCREEN_WIDTH;
    height /= HALF_SCREEN_HEIGHT;

    // TODO: Handle negative x and y.
    for (let xPos = x; xPos < width + x; xPos += 0.001) {
        for (let yPos = y; yPos > y - height; yPos -= 0.001) {
            points.push(xPos, yPos);
        }
    }

    glDraw(vertex_buffer, points, gl.POINTS, points.length);
}

export default main; 