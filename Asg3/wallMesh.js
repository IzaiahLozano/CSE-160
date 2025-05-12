class WallMesh {
  constructor(map) {
    this.map = map;
    this.vertices = [];
    this.uvs = [];
    this.modelMatrix = new Matrix4();
    this.textureNum = 1; // Assuming texture 1 for walls
    this.initBuffers();
  }

  initBuffers() {
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[x].length; y++) {
        const height = this.map[x][y];
        if (height > 0) {
          for (let h = 0; h < height; h++) {
            this.addCube(x - 16, h - 0.75, y - 16);
          }
        }
      }
    }

    // Vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    // UV buffer
    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
  }

  addCube(x, y, z) {
    const faceVerts = [
      // Front
      [0,0,0, 1,1,0, 1,0,0,   0,0,0, 0,1,0, 1,1,0],
      // Top
      [0,1,0, 0,1,1, 1,1,1,   0,1,0, 1,1,1, 1,1,0],
      // Right
      [1,1,1, 1,1,0, 1,0,0,   1,0,1, 1,1,1, 1,0,0],
      // Back
      [0,0,1, 1,1,1, 1,0,1,   0,0,1, 0,1,1, 1,1,1],
      // Bottom
      [1,0,1, 0,0,1, 1,0,0,   0,0,0, 0,0,1, 1,0,0],
      // Left
      [0,0,0, 0,1,0, 0,0,1,   0,1,0, 0,1,1, 0,0,1],
    ];
    const faceUVs = [
      [0,0, 1,1, 1,0,  0,0, 0,1, 1,1],
      [0,0, 0,1, 1,1,  0,0, 1,1, 1,0],
      [1,1, 1,0, 0,0,  1,0, 1,1, 0,0],
      [0,0, 1,1, 1,0,  0,0, 0,1, 1,1],
      [0,1, 0,1, 0,0,  0,0, 0,1, 0,0],
      [0,0, 1,0, 0,1,  1,0, 1,1, 0,1]
    ];

    for (let i = 0; i < faceVerts.length; i++) {
      for (let j = 0; j < 6; j++) {
        this.vertices.push(
          faceVerts[i][j * 3 + 0] + x,
          faceVerts[i][j * 3 + 1] + y,
          faceVerts[i][j * 3 + 2] + z
        );
        this.uvs.push(faceUVs[i][j * 2 + 0], faceUVs[i][j * 2 + 1]);
      }
    }
  }

  render() {
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);

    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // UVs
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
