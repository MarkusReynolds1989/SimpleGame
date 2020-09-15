const main = () => {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");
    const SCREEN_WIDTH = canvas.width;
    const HALF_SCREEN_WIDTH = canvas.width / 2;
    const SCREEN_HEIGHT = canvas.height;
    const HALF_SCREEN_HEIGHT = canvas.height / 2;
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
            gl_PointSize = 10.0;
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
        gl_FragColor = vec4(0.0,0.0,1.0,0.5);
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

    // Takes a number and translate it from an integer
    // to a float on the x axis for vertex
    // writing.
    const translateX = (num) => {
        if (num == 0) {
            return -1;
        }
        else if (num == SCREEN_WIDTH) {
            return 1;
        }
        else if (num == HALF_SCREEN_WIDTH) {
            return 0;
        }
        else {
            return num / HALF_SCREEN_WIDTH - 1;
        }
    }

    // See above, same except for y.
    const translateY = (num) => {
        if (num == 0) {
            return 1;
        }
        else if (num == SCREEN_HEIGHT) {
            return -1;
        }
        else if (num == HALF_SCREEN_HEIGHT) {
            return 0;
        }
        else {
            return num / HALF_SCREEN_HEIGHT * -1 + 1;
        }
    }

    // Takes two points and draws a line between them.
    const drawLine = (x, y, endX, endY) => {
        const line = [translateX(x), translateY(y), translateX(endX), translateY(endY)];
        for (let x of line) {
            console.log(x);
        }
        // Bind empty array to buffer object.
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        // Pass vertices data to buffer
        gl.bufferData(gl.ARRAY_BUFFER
            , new Float32Array(line)
            , gl.STATIC_DRAW);

        // Unbind buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.drawArrays(gl.LINES, 0, line.length)
    };

    const drawRectangleLines = (x, y, width, height) => {
        x = translateX(x);
        width = translateX(width);
        y = translateY(y);
        height = translateY(height);
        lines = [x, y,
            width - x,  y, // Pair
            width - x, y,
            width - x, height - y, // Pair
            width - x, height - y,
            x, height - y, // Pair
            x, height - y,
            x, y]; // Final Pair
        // Bind empty array to buffer object.
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        // Pass vertices data to buffer
        gl.bufferData(gl.ARRAY_BUFFER
            , new Float32Array(lines)
            , gl.STATIC_DRAW);

        // Unbind buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.drawArrays(gl.LINES, 0, lines.length)
    };

    drawRectangleLines(10, 10, 20, 20);
};

window.onload = main();