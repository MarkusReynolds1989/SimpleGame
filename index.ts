const canvas = <HTMLCanvasElement>document.querySelector("#canvas")
    , gl = canvas.getContext("webgl")
    , screenWidth = canvas.width
    , screenHeight = canvas.height
    , halfScreenWidth = canvas.width / 2
    , halfScreenHeight = canvas.height / 2;

// check gl.
if (gl == null) {
    throw "GL Assignment failed";
}

class Shader {
    vertexShader: WebGLShader | null | undefined;
    fragmentShader: WebGLShader | null | undefined;
    shaderProgram: WebGLProgram | null | undefined;
    defaultVShaderCode: string;
    defaultFShaderCode: string;

    constructor() {
        this.vertexShader = gl?.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl?.createShader(gl.FRAGMENT_SHADER);
        this.shaderProgram = gl?.createProgram();
        this.defaultVShaderCode = `
            attribute vec2 coordinates;
            void main(void) 
            {
                gl_Position = vec4(coordinates, 0.0, 1.0);
                gl_PointSize = 1.0;
            }`;
        this.defaultFShaderCode = `
            void main(void)
            { 
                // Red green blue alpha
                gl_FragColor = vec4(100.0,0.0,0.0, 0.5);
            }`;
    }

    compileFragmentShader(color: string = this.defaultFShaderCode) {
        if (this.fragmentShader != null) {
            gl?.shaderSource(this.fragmentShader, color);
            gl?.compileShader(this.fragmentShader);
            console.log(gl?.getShaderInfoLog(this.fragmentShader));
        }
    }

    compileVertexShader() {
        if (this.vertexShader != null) {
            gl?.shaderSource(this.vertexShader, this.defaultVShaderCode);
            gl?.compileShader(this.vertexShader);
            console.log(gl?.getShaderInfoLog(this.vertexShader));
        }
    }

    // Step4 Attach and link.
    attachLink() {
        if (this.shaderProgram != null
            && this.vertexShader != null
            && this.fragmentShader != null
            && gl != null) {
            gl.attachShader(this.shaderProgram, this.vertexShader);
            gl.attachShader(this.shaderProgram, this.fragmentShader);
            gl.linkProgram(this.shaderProgram);
            console.log(gl.getProgramInfoLog(this.shaderProgram));
            gl.useProgram(this.shaderProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        } else {
            throw "ShaderProgram invaild";
        }
    }


    setFragColor(red: number, green: number, blue: number, alpha: number) {
        this.defaultFShaderCode = `
        void main(void)
        {
            gl_FragColor = vec4(${red}, ${green}, ${blue}, ${alpha});
        }`;
    }

    final() {
        let coord: number;
        // Other
        if (gl != null) {
            if (shaderCompiler.shaderProgram != null) {
                coord = gl.getAttribLocation(shaderCompiler.shaderProgram, "coordinates");
                gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(coord);
                gl.viewport(0, 0, canvas.width, canvas.height);
            } else {
                throw "Shader issue";
            }
        }
    }
}

// Step 1, create graphics objects and shader program object.
let vertexBuffer: WebGLBuffer | null = gl.createBuffer();

let shaderCompiler: Shader = new Shader();

const CompilerShader = () => {
    shaderCompiler.compileFragmentShader();
    shaderCompiler.compileVertexShader();
    shaderCompiler.attachLink();
    shaderCompiler.final();
};

const CompilerShaderColor = (red: number, green: number, blue: number, alpha: number) => {
    shaderCompiler.setFragColor(red, green, blue, alpha);
    shaderCompiler.compileFragmentShader();
    shaderCompiler.compileVertexShader();
    shaderCompiler.attachLink();
    shaderCompiler.final();
}

const glDraw = (vertBuffer: WebGLBuffer | null
    , array: number[]
    , type: number
    , length: number): void => {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.drawArrays(type, 0, length);
};

const translateX = (num: number): number => {
    if (num == 0) {
        return -1;
    } else if (num == screenWidth) {
        return 1;
    } else if (num == halfScreenWidth) {
        return 0
    } else {
        return num / halfScreenWidth - 1;
    }
};

const translateY = (num: number): number => {
    if (num == 0) {
        return 1;
    } else if (num == screenHeight) {
        return -1;
    } else if (num == halfScreenHeight) {
        return 0;
    } else {
        return num / halfScreenHeight * - 1 + 1;
    }
};

const drawLine = (x: number
    , y: number
    , endX: number
    , endY: number) => {
    const line = [
        translateX(x)
        , translateY(y)
        , translateX(endX)
        , translateY(endY)
    ];
    glDraw(vertexBuffer, line, gl.LINES, line.length);
};

// Incorrect because too small.
const drawRectangleLines = (x: number
    , y: number
    , width: number
    , height: number) => {
    x = translateX(x);
    width /= halfScreenHeight;
    y = translateY(y);
    height /= halfScreenWidth;
    // TODO: Fix hacks.
    // Will have to write down the math to make this
    // correct.
    // Could also jsut draw a rectangle and erase the
    // middle.
    const lines: number[] = [
        x, y,
        x + width + 0.015, y, // To the right
        x + width + 0.015, y,
        x + width + 0.015, y - height - 0.23, // To the bottom
        x + width + 0.015, y - height - 0.23,
        x, y - height - 0.23, // To the bottom and
        x, y - height - 0.23,
        x, y, // To the top
    ];

    glDraw(vertexBuffer, lines, gl.LINES, lines.length);
};

const drawRectangle = (x: number
    , y: number
    , width: number
    , height: number) => {
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
    CompilerShaderColor(0.0, 100.0, 0.0, 0.5);
    glDraw(vertexBuffer, points, gl.POINTS, points.length);
};

drawRectangle(100, 100, 500, 500);

