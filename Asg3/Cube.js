class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;
  }

  drawCube() {
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, ...this.color);

    const positions = [
      // Front
      0, 0, 0,   1, 0, 0,   1, 1, 0,
      0, 0, 0,   1, 1, 0,   0, 1, 0,
      // Top
      0, 1, 0,   1, 1, 0,   1, 1, 1,
      0, 1, 0,   1, 1, 1,   0, 1, 1,
      // Right
      1, 0, 0,   1, 0, 1,   1, 1, 1,
      1, 0, 0,   1, 1, 1,   1, 1, 0,
      // Back
      1, 0, 1,   0, 0, 1,   0, 1, 1,
      1, 0, 1,   0, 1, 1,   1, 1, 1,
      // Bottom
      0, 0, 0,   1, 0, 0,   1, 0, 1,
      0, 0, 0,   1, 0, 1,   0, 0, 1,
      // Left
      0, 0, 1,   0, 1, 1,   0, 1, 0,
      0, 0, 1,   0, 1, 0,   0, 0, 0
    ];

    const uvs = [
      // Front
      0, 0, 1, 0, 1, 1,
      0, 0, 1, 1, 0, 1,
      // Top
      0, 1, 1, 1, 1, 0,
      0, 1, 1, 0, 0, 0,
      // Right
      0, 0, 1, 0, 1, 1,
      0, 0, 1, 1, 0, 1,
      // Back
      0, 0, 1, 0, 1, 1,
      0, 0, 1, 1, 0, 1,
      // Bottom
      0, 0, 1, 0, 1, 1,
      0, 0, 1, 1, 0, 1,
      // Left
      0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0
    ];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
  }
}
