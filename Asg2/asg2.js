var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
var gAnimalGlobalRotation = 0;
var g_animate = false; 
var g_leftUpperArmAngle = 0;
var g_leftLowerArmAngle = 0;
var g_leftHandAngle = 0;
var g_rightUpperArmAngle = 0;
var g_rightLowerArmAngle = 0;
var g_rightHandAngle = 0;
var g_headTiltAngle = 0;
var g_leftLegAngle = 0;
var g_rightLegAngle = 0;




var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_GlobalRotateMatrix;\n' +
    'void main() {\n' +
    ' gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' + 
    '}\n';

function addActionsForHtmlUI(){
    // Color Slider Events
    document.getElementById('camera').addEventListener('input', function() { gAnimalGlobalRotation = Number(this.value); renderScene();});
    document.getElementById('leftUpperArm').addEventListener('input', function() {g_leftUpperArmAngle = Number(this.value);});
    document.getElementById('leftLowerArm').addEventListener('input', function() {g_leftLowerArmAngle = Number(this.value);});
    document.getElementById('leftHand').addEventListener('input', function() {g_leftHandAngle = Number(this.value);});
    document.getElementById('rightUpperArm').addEventListener('input', function() {g_rightUpperArmAngle = Number(this.value);});
    document.getElementById('rightLowerArm').addEventListener('input', function() {g_rightLowerArmAngle = Number(this.value);});
    document.getElementById('rightHand').addEventListener('input', function() {g_rightHandAngle = Number(this.value);});
    document.getElementById('leftLeg').addEventListener('input', function() {g_leftLegAngle = Number(this.value);});
    document.getElementById('rightLeg').addEventListener('input', function() {g_rightLegAngle = Number(this.value);});
    
}

function setupWebGL(){
    canvas = document.getElementById('asg2');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    gl = getWebGLContext(canvas);
    if(!gl){
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
    console.log('Failed to get u_FragColor');
    return;
}

u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
    console.log('Failed to get u_ModelMatrix');
    return;
}

u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
if (!u_GlobalRotateMatrix) {
    console.log('Failed to get u_GlobalRotateMatrix');
    return;
}

let globalRotMat = new Matrix4();
globalRotMat.setRotate(gAnimalGlobalRotation, 0, 1, 0); 
gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    gl.clearColor(0.5, 0.7, 0.6, 1.0);

    renderScene();

    requestAnimationFrame(tick);
} 

function updateAnimationAngles() {
    if (g_animate) {
        g_leftUpperArmAngle = 70 * Math.sin(g_seconds);
        g_leftLowerArmAngle = 50 + 20 * Math.sin(g_seconds * 3);
        g_leftHandAngle = 25 * Math.sin(g_seconds * 4);

        g_headTiltAngle = 10 * Math.sin(g_seconds * 2);

    }
}

function tick() {
    g_seconds = performance.now()/1000.0 - g_startTime; 

    updateAnimationAngles();

    let globalRotMat = new Matrix4();
    globalRotMat.setRotate(gAnimalGlobalRotation, 0, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    renderScene();
    requestAnimationFrame(tick);
  }

function renderScene() {
    var globalRotMat = new Matrix4().rotate(gAnimalGlobalRotation, 0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    animalDraw();
}

