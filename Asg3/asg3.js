// global variables
var canvas;
var gl;
var a_UV;

var u_Sampler0;
var u_Sampler1;
var u_Sampler2;

var u_whichTexture;
var g_Camera;

var a_Position;
var u_FragColor;
var u_Size;
var u_ModelMatrix;
var u_GlobalRotateMatrix;
var g_cameraAngle = 0;
var g_cameraAngleX = 0;
var g_cameraAngleY = 0;

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Camera variables
var g_eye = new Vector3([0, 0, 3]);
var g_at = new Vector3([0, 0, -100]);
var g_up = new Vector3([0, 1, 0]);

var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
  gl_Position = u_ProjectionMatrix *  u_ViewMatrix  * u_GlobalRotateMatrix * u_ModelMatrix  * a_Position;
  v_UV = a_UV;
}\n`;

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;

  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;               
    }else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);    
    } else if (u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    }else if (u_whichTexture == 1)
    {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }else if (u_whichTexture == 2)
    {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else{
      gl_FragColor = vec4(1,1,1,1);
    }
  }\n`;

function setupWebGL() {

    canvas = document.getElementById("webgl");
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) 
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if(a_UV < 0)
  {
    console.log("Failed to get the storage location of a_UV");
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0)
  {
    console.log("Failed to get the storage location of u_Sampler0");
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1)
  {
    console.log("Failed to get the storage location of u_Sampler0");
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2)
  {
    console.log("Failed to get the storage location of u_Sampler0");
    return;
  }


  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture)
  {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix)
  {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix)
  {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  var matrixM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, matrixM.elements);
}

function addActionsForHtmlUI(){

  document.getElementById('cameraAngleSlider').addEventListener('mousemove', function() {g_cameraAngleX = this.value; renderAllShapes();});

}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;

  renderAllShapes();

  requestAnimationFrame(tick);
}

function drawStuff(){
    var cube = new Cube();
    g_shapesList.push(cube);
    renderAllShapes();
}

function click(ev){
  let [x,y] =  convertCoordinatesEventToGL(ev);

  g_cameraAngleX -= 2 * x ;
  g_cameraAngleY += 2 * y ;
}

function keydown(ev) {
  //camera = new Camera();
  if (ev.keyCode == 87) {         // w
    g_Camera.moveForward();

  } else if (ev.keyCode == 83) {  // s
    g_Camera.moveBackward();

  } else if (ev.keyCode == 65) {  // a
    g_Camera.moveRight();

  } else if (ev.keyCode == 68) {  // d
    
    g_Camera.moveLeft();

  } else if (ev.keyCode == 81) {  // q
    g_Camera.panLeft();

  } else if (ev.keyCode == 69) {  // e
    
    g_Camera.panRight();
  }else if(ev.keyCode == 70) // f
  {
    g_Camera.deleteBlock();
  }else if(ev.keyCode == 71) // g
  {
    g_Camera.addBlock();
  }

  renderAllShapes();
  console.log(ev.keyCode);
}

function randomizeMap() {
    for (let x = 0; x < g_Map.length; x++) {
      for (let y = 0; y < g_Map[x].length; y++) {
        // Randomize with 20% chance of a block
        if (Math.random() < 0.2) {
          g_Map[x][y] = Math.floor(Math.random() * 4) + 1; // heights 1-4
        } else {
          g_Map[x][y] = 0;
        }
      }
    }
  }

function main(){
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    randomizeMap();
    wallMesh = new WallMesh(g_Map);

    initTextures();
    g_Camera = new Camera();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    document.onkeydown = keydown;

    var canvas = document.getElementById('webgl');
    canvas.addEventListener('mousedown', handleMouseDown, false);
    canvas.addEventListener('mouseup', handleMouseUp, false);
    canvas.addEventListener('mousemove', handleMouseMove, false);

    requestAnimationFrame(tick);
}