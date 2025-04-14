// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size; 
  void main() {
  gl_Position = a_Position; 
  gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;  // uniform変数
  void main() {
    gl_FragColor = u_FragColor;
  }`;

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let g_selectedSize = 20; 
let u_Size;
var g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_shapesList = [];
let g_selectedType = POINT;
let g_segmentCount = 12;
let g_rotation = 0;


function setupWebGL(){

    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL(){

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
 
    // Get the storage location of a-position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
 
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
    console.log('Failed to get u_Size');
    return;
}
 
}

function addActionsForHtmlUI(){

    // Button Events
    document.getElementById('clear').onclick = function() { g_shapesList = []; renderAllShapes(); };
    document.getElementById('sqrButton').onclick = function() { g_selectedType = POINT; g_outline = 0;};
    document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE; g_outline = 0;};
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE; g_outline = 0;};
    document.getElementById('DogButton').onclick = function () {drawHero();};
 
    // Color Slider Events
    document.getElementById('red').addEventListener('mouseup', function() { g_selectedColor[0] = this.value*0.1; });
    document.getElementById('green').addEventListener('mouseup', function() { g_selectedColor[1] = this.value*0.1; });
    document.getElementById('blue').addEventListener('mouseup', function() { g_selectedColor[2] = this.value*0.1; });

    document.getElementById('segmentSlider').addEventListener('input', function () {g_segmentCount = parseInt(this.value);
    document.getElementById('segmentLabel').textContent = g_segmentCount;
    });

    document.getElementById("rotationSlider").addEventListener("input", function(e) {
        g_rotation = parseFloat(e.target.value);
        document.getElementById("rotationLabel").innerText = g_rotation;
      });
 
 }

function main() {

    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    canvas.onmousedown = click;

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    const slider = document.getElementById("sizeSlider");
    const label = document.getElementById("sizeLabel");

    slider.addEventListener("input", function(ev) {
        g_selectedSize = ev.target.value;
        label.textContent = g_selectedSize;
    });

    canvas.onmousemove = function(ev) {
        if (ev.buttons === 1) click(ev); // Only draw if mouse button is down
      };
      

}

function click(ev) {

    var [x,y] = convertCoordinatesEventToGL(ev);
    const color = g_selectedColor.slice();
    let point;
    if (g_selectedType === POINT) {
        point = new Point([x, y], color, parseFloat(g_selectedSize));
        point.rotation = g_rotation;
        g_shapesList.push(point);
    }
    else if (g_selectedType === TRIANGLE) {
        triangle = new Triangle([x, y], color, parseFloat(g_selectedSize));
        triangle.rotation = g_rotation;
        g_shapesList.push(triangle);
    }
    else if (g_selectedType === CIRCLE) {
        circle = new Circle([x, y], color, parseFloat(g_selectedSize), g_segmentCount);
        g_shapesList.push(circle);
    }

    renderAllShapes();
}

// Get Coordinates 
function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect() ;
 
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
 
    return [x,y];
 }

 // Draw every shape on canvas
function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let shape of g_shapesList) {
        shape.render();
    }
 
 }
