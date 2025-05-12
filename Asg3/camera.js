class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -10]);
        this.up = new Vector3([0, 1, 0]);
        
        // Initialize viewMatrix and projectionMatrix
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
                                   this.at.elements[0], this.at.elements[1], this.at.elements[2],
                                   this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }

    moveForward() {
        var d = new Vector3([0, 0, 0]);

        d.set(this.at);
        d.sub(this.eye);
        d.normalize();

        d.mul(0.1);
        this.at.add(d);
        this.eye.add(d);
    }

    moveBackward() {
        var d = new Vector3([0, 0, 0]);

        d.set(this.at);
        d.sub(this.eye);
        d.normalize();

        d.mul(0.1);
        this.at.sub(d);
        this.eye.sub(d);
    }

    moveLeft() {
        var d = new Vector3([0, 0, 0]);

        d.set(this.at);
        d.sub(this.eye);
        d.normalize();

        let left = Vector3.cross(d, this.up);
        left.mul(0.1);
        this.at.add(left);
        this.eye.add(left);
    }

    moveRight() {
        var d = new Vector3([0, 0, 0]);

        d.set(this.at);
        d.sub(this.eye);
        d.normalize();

        var right = Vector3.cross(d, this.up);
        right.mul(0.1);
        this.eye.sub(right);
        this.at.sub(right);
    }

    panLeft() {
      let l = new Vector3([0, 0, 0]);
      l.set(g_Camera.at);
      l.sub(g_Camera.eye);

      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(5,  g_Camera.up.elements[0], g_Camera.up.elements[1], g_Camera.up.elements[2]);
      
      let rotate = rotationMatrix.multiplyVector3(l);
      let temp = new Vector3([0, 0, 0]);
      temp.set(g_Camera.eye);
      g_Camera.at = temp.add(rotate);
    }

    panRight() {
      let l = new Vector3([0, 0, 0]);
      l.set(g_Camera.at);
      l.sub(g_Camera.eye);

      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(-5,  g_Camera.up.elements[0], g_Camera.up.elements[1], g_Camera.up.elements[2]);
      
      let rotate = rotationMatrix.multiplyVector3(l);
      let temp = new Vector3([0, 0, 0]);
      temp.set(g_Camera.eye);
      g_Camera.at = temp.add(rotate);
    }
    deleteBlock()
    {
        var direction = new Vector3([0, 0, 0]);
        direction.set(this.at);
        direction.sub(this.eye);
        direction.normalize();

      
        var distance = 2; // Control how close the block is
        var blockPosition = new Vector3([0, 0, 0]);
        blockPosition.set(this.eye);
        blockPosition.add(direction.mul(distance));

        let mapRow = Math.floor(blockPosition.elements[0] + 16);
        let mapCol = Math.floor(blockPosition.elements[2] + 16); // Use Z-axis for col
        
        if (mapRow < 0 || mapRow >= g_Map.length || mapCol < 0 || mapCol >= g_Map[0].length) return;

        g_Map[mapRow][mapCol] = 0; // Delete block
        wallMesh = new WallMesh(g_Map); // Rebuild mesh
        renderAllShapes();
    }
    addBlock()
    {
        var direction = new Vector3([0, 0, 0]);
        direction.set(this.at);
        direction.sub(this.eye);
        direction.normalize();

        var distance = 2; // Control how close the block is
        var blockPosition = new Vector3([0, 0, 0]);
        blockPosition.set(this.eye);
        blockPosition.add(direction.mul(distance));

        let mapRow = Math.floor(blockPosition.elements[0] + 16);
        let mapCol = Math.floor(blockPosition.elements[2] + 16); // Use Z-axis for col
        
        if (mapRow < 0 || mapRow >= g_Map.length || mapCol < 0 || mapCol >= g_Map[0].length) return;

        g_Map[mapRow][mapCol] = 1; // Add block
        wallMesh = new WallMesh(g_Map); // Rebuild mesh
        renderAllShapes();
    }
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotationX = 0.0;
var rotationY = 0.0;
var sensitivity = 20; 

function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

function handleMouseMove(event) {
  if (!mouseDown) {
    return;
  }

  var newX = event.clientX;
  var newY = event.clientY;
  var deltaX = newX - lastMouseX;
  var deltaY = newY - lastMouseY;
  lastMouseX = newX;
  lastMouseY = newY;

  rotationY += sensitivity * deltaX;
  rotationX += sensitivity * deltaY;

  g_cameraAngleX = rotationX * Math.PI / 180;
  g_cameraAngleY = rotationY * Math.PI / 180;
}