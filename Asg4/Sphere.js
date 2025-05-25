class Sphere {
  constructor(segments = 24, rings = 24) {
    this.type = "sphere";
    this.color = [1.0, 0.2, 0.2, 1.0];
    this.matrix = new Matrix4();
    this.segments = segments;
    this.rings = rings;

    this.vertexBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();

    this.vertices = [];
    this.normals = [];

    this.generateSphere();
  }

  generateSphere() {
    for (let lat = 0; lat <= this.rings; lat++) {
      let theta = (lat * Math.PI) / this.rings;
      let sinTheta = Math.sin(theta);
      let cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= this.segments; lon++) {
        let phi = (lon * 2 * Math.PI) / this.segments;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);

        let x = sinTheta * cosPhi;
        let y = cosTheta;
        let z = sinTheta * sinPhi;

        this.vertices.push(x, y, z);
        this.normals.push(x, y, z);
      }
    }

    const indices = [];
    for (let lat = 0; lat < this.rings; lat++) {
      for (let lon = 0; lon < this.segments; lon++) {
        let first = lat * (this.segments + 1) + lon;
        let second = first + this.segments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    this.indexCount = indices.length;

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.normals),
      gl.STATIC_DRAW
    );
  }

  drawSphere() {
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, -2);
    gl.uniform4f(u_FragColor, ...this.color);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
