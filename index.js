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

    let drawLine = (x, y, endX, endY) => {
        const line = [x, y, endX, endY];
        x = (x - HALF_SCREEN_WIDTH) / HALF_SCREEN_WIDTH;
        y = (y - SCREEN_HEIGHT) / SCREEN_HEIGHT; 
        endX = (endX - HALF_SCREEN_WIDTH) / HALF_SCREEN_WIDTH;
        endY = (endY - SCREEN_HEIGHT) / SCREEN_HEIGHT; 
        console.log(x, y, endX, endY);
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

    drawLine(0,0,100,0);

};

window.onload = main();