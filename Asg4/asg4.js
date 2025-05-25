var canvas;
var gl;
var a_UV;

var u_Sampler0;
var u_Sampler1;
var u_Sampler2;
let g_shapesList = [];
var g_Camera;
const WORLD_SCALE = 0.5;
var a_Position;
var u_FragColor;
var u_Size;
var u_ModelMatrix;
var u_ViewMatrix;
var u_GlobalRotateMatrix;
var u_ProjectionMatrix;
var u_NormalMatrix;

var u_lightColor;

var u_whichTexture;
var g_cameraAngle = 0;
var g_cameraAngleX = 0;
var g_cameraAngleY = 0;

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

var g_eye = new Vector3([0, 0, 3]);
var g_at = new Vector3([0, 0, -100]);
var g_up = new Vector3([0, 1, 0]);

var u_spotLightDir;
var u_spotCutoff;
var u_spotExponent;
var a_Normal;
var u_NormalOn;
var g_normalOn = false;
var u_lightPos;
var u_lightAnime;
var g_lightAnime = true;
var u_lightOn;
var g_lightOn = true;
var u_spotOn;
var g_spotOn = false;
var g_lightPos = [0, 1, 1];
let g_lightColor = [1.0, 1.0, 1.0];

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_Normal;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform vec3 u_lightPos;
    uniform mat3 u_NormalMatrix;

    varying vec2 v_UV;
    varying vec3 v_NormalDir;
    varying vec3 v_LightDir;
    varying vec3 v_FragPos;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

        v_UV = a_UV;
        vec4 worldPos = u_ModelMatrix * a_Position;
        v_FragPos = vec3(worldPos);
        v_NormalDir = normalize(u_NormalMatrix * a_Normal);
        v_LightDir = normalize(u_lightPos - v_FragPos);
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
varying vec2 v_UV;
varying vec3 v_NormalDir;
varying vec3 v_LightDir;
varying vec3 v_FragPos;

uniform vec4 u_FragColor;
uniform int u_whichTexture;
uniform bool u_NormalOn;
uniform vec3 u_lightPos;
uniform vec3 u_lightColor;
uniform bool u_lightOn;
uniform bool u_spotOn;
uniform vec3 u_spotLightDir;  
uniform float u_spotCutoff;
uniform float u_spotExponent;

uniform vec3 u_eyePos;  // Add this uniform to get camera position

void main() {
    if (u_NormalOn) {
        gl_FragColor = vec4(normalize(v_NormalDir) * 0.5 + 0.5, 1.0);
        return;
    }

    if (!u_lightOn) {
        gl_FragColor = u_FragColor;
        return;
    }

    vec3 normal = normalize(v_NormalDir);
    vec3 lightDir = normalize(v_LightDir);
    vec3 viewDir = normalize(u_eyePos - v_FragPos);

    float nDotL = max(dot(normal, lightDir), 0.0);
    float specularStrength = 0.4;
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);

    vec3 ambient = vec3(0.1, 0.1, 0.1);
    vec3 diffuse = vec3(u_FragColor) * nDotL;
    vec3 specular = u_lightColor * specularStrength * spec;

    if (u_spotOn) {
        float spotEffect = dot(lightDir, normalize(-u_spotLightDir));

        if (spotEffect > u_spotCutoff) {
            float spotIntensity = pow(spotEffect, u_spotExponent);
            diffuse *= spotIntensity;
            specular *= spotIntensity;
        } else {
            diffuse *= 0.0;
            specular *= 0.0;
        }
    }

    vec3 finalColor = ambient + diffuse + specular;
    gl_FragColor = vec4(finalColor, u_FragColor.a);
}
`;

function addActionsForHtmlUI() {
  document
    .getElementById("lightx")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[0] = this.value / 100;
      }
    });
  document
    .getElementById("lighty")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[1] = this.value / 100;
      }
    });
  document
    .getElementById("lightz")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[2] = this.value / 100;
      }
    });
  document.getElementById("normal_on").onclick = function () {
    g_normalOn = true;
    console.log("Normal visualization ON");
  };
  document.getElementById("normal_off").onclick = function () {
    g_normalOn = false;
    console.log("Normal visualization OFF");
  };
  document.getElementById("light_on").onclick = function () {
    g_lightOn = true;
  };
  document.getElementById("light_off").onclick = function () {
    g_lightOn = false;
  };
  document.getElementById("lightanime_on").onclick = function () {
    g_lightAnime = true;
  };
  document.getElementById("lightanime_off").onclick = function () {
    g_lightAnime = false;
  };
  document.getElementById("spot_on").onclick = function () {
    g_spotOn = true;
  };
  document.getElementById("spot_off").onclick = function () {
    g_spotOn = false;
  };
  document.getElementById("lightColor").addEventListener("input", function () {
    const r = this.value / 100;
    g_lightColor = [r, 1.0, 1.0];
  });
}

function setupWebGL() {
  canvas = document.getElementById("webgl");
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Shader init failed.");
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  u_NormalOn = gl.getUniformLocation(gl.program, "u_NormalOn");
  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");
  u_spotOn = gl.getUniformLocation(gl.program, "u_spotOn");
  u_lightColor = gl.getUniformLocation(gl.program, "u_lightColor");
  u_spotLightDir = gl.getUniformLocation(gl.program, "u_spotLightDir");
  u_spotCutoff = gl.getUniformLocation(gl.program, "u_spotCutoff");
  u_spotExponent = gl.getUniformLocation(gl.program, "u_spotExponent");
  u_eyePos = gl.getUniformLocation(gl.program, "u_eyePos");
}

function setNormalMatrixFrom(modelMatrix) {
  let normalMat = new Matrix4(modelMatrix);
  normalMat.transpose();
  normalMat.invert();
  let normalMat3 = [
    normalMat.elements[0],
    normalMat.elements[1],
    normalMat.elements[2],
    normalMat.elements[4],
    normalMat.elements[5],
    normalMat.elements[6],
    normalMat.elements[8],
    normalMat.elements[9],
    normalMat.elements[10],
  ];
  gl.uniformMatrix3fv(u_NormalMatrix, false, normalMat3);
}

function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_Camera.eye.elements[0],
    g_Camera.eye.elements[1],
    g_Camera.eye.elements[2],
    g_Camera.at.elements[0],
    g_Camera.at.elements[1],
    g_Camera.at.elements[2],
    g_Camera.up.elements[0],
    g_Camera.up.elements[1],
    g_Camera.up.elements[2]
  );

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var rotateMat = new Matrix4().rotate(g_cameraAngleX, 1, 0, 0);
  rotateMat.rotate(g_cameraAngleY, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, rotateMat.elements);
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform1i(u_NormalOn, g_normalOn);
  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform1i(u_spotOn, g_spotOn);
  gl.uniform3f(u_lightColor, ...g_lightColor);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform3f(u_spotLightDir, 0.0, -1.0, 0.0);
  const u_eyePos = gl.getUniformLocation(gl.program, "u_eyePos");
  gl.uniform3f(
    u_eyePos,
    g_Camera.eye.elements[0],
    g_Camera.eye.elements[1],
    g_Camera.eye.elements[2]
  );
  let spotlightAngleDegrees = 50.0;
  gl.uniform1f(u_spotCutoff, Math.cos((12.5 * Math.PI) / 180));
  gl.uniform1f(u_spotExponent, 20.0);

  // Ground
  var floor = new Cube();
  floor.color = [0.03, 0.48, 0.07, 1];
  floor.matrix.translate(-13, -0.5, -13);
  floor.matrix.scale(25, 0, 25);
  setNormalMatrixFrom(floor.matrix);
  floor.drawCube();

  // Sky
  var skyBox = new Cube();
  skyBox.color = [1, 0.3, 1, 1];
  skyBox.matrix.translate(-5, -0.55, -5);
  skyBox.matrix.scale(3, 3, 3);
  setNormalMatrixFrom(skyBox.matrix);
  skyBox.drawCube();

  // Light Box
  let lightCube = new Cube();
  lightCube.color = [1, 1, 0, 1];
  lightCube.matrix.translate(g_lightPos[0], g_lightPos[1] - 0.7, g_lightPos[2]);
  lightCube.matrix.scale(0.5, 0.5, 0.5);
  setNormalMatrixFrom(lightCube.matrix);
  lightCube.drawCube();

  // Sphere
  let sphere = new Sphere();
  sphere.color = [1.0, 0.3, 0.5, 1.0];
  sphere.matrix.translate(0, 0.0, 0);
  sphere.matrix.scale(0.2, 0.2, 0.2);
  setNormalMatrixFrom(sphere.matrix);
  sphere.drawSphere();

  drawMap();

  for (let shape of g_shapesList) {
    setNormalMatrixFrom(shape.matrix);
    shape.drawCube();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML(
    "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration),
    "numdot"
  );
}

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;

  if (g_lightAnime) updateAnimationAngles();

  g_Camera.viewMatrix.setLookAt(
    g_Camera.eye.elements[0],
    g_Camera.eye.elements[1],
    g_Camera.eye.elements[2],
    g_Camera.at.elements[0],
    g_Camera.at.elements[1],
    g_Camera.at.elements[2],
    g_Camera.up.elements[0],
    g_Camera.up.elements[1],
    g_Camera.up.elements[2]
  );
  renderAllShapes();
  requestAnimationFrame(tick);
}

function keydown(ev) {
  //camera = new Camera();
  if (ev.keyCode == 87) {
    // w
    g_Camera.moveForward();
  } else if (ev.keyCode == 83) {
    // s
    g_Camera.moveBackward();
  } else if (ev.keyCode == 65) {
    // a
    g_Camera.moveRight();
  } else if (ev.keyCode == 68) {
    // d

    g_Camera.moveLeft();
  } else if (ev.keyCode == 81) {
    // q
    g_Camera.panLeft();
  } else if (ev.keyCode == 69) {
    // e

    g_Camera.panRight();
  }

  renderAllShapes();
  console.log(ev.keyCode);
}

function updateAnimationAngles() {
  let r = 2.0;
  g_lightPos[0] = r * Math.cos(g_seconds);
  g_lightPos[2] = r * Math.sin(g_seconds);
  g_lightPos[1] = 4.0;
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  g_Camera = new Camera();

  addActionsForHtmlUI();

  document.onkeydown = keydown;
  canvas.onmousedown = handleMouseDown;
  canvas.onmouseup = handleMouseUp;
  canvas.onmousemove = handleMouseMove;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  tick();
}
