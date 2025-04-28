class Cube {
    constructor() {
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
    }
  
    drawCube() {
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
  
      // Vertex coordinates for cube
      const vertices = [
        -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,   -0.5,  0.5,  0.5,  // front
        -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,   -0.5,  0.5, -0.5   // back
      ];
  
      const indices = [
        0, 1, 2,  0, 2, 3,    
        5, 4, 7,  5, 7, 6,   
        3, 2, 6,  3, 6, 7,    
        4, 5, 1,  4, 1, 0,    
        1, 5, 6,  1, 6, 2,    
        4, 0, 3,  4, 3, 7     
      ];
  
      let unpackedVerts = [];
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i] * 3;
        unpackedVerts.push(vertices[idx], vertices[idx + 1], vertices[idx + 2]);
      }
  
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedVerts), gl.STATIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  

      gl.drawArrays(gl.TRIANGLES, 0, unpackedVerts.length / 3);

      //Below is used to determine where blockas are located and how they fit together
  
      // // ---- Draw edges (wireframe) ----
      // const edgeIndices = [
      //   0, 1,  1, 2,  2, 3,  3, 0,    // front
      //   4, 5,  5, 6,  6, 7,  7, 4,    // back
      //   0, 4,  1, 5,  2, 6,  3, 7     // sides
      // ];
  
      // let edgeVerts = [];
      // for (let i = 0; i < edgeIndices.length; i++) {
      //   const idx = edgeIndices[i] * 3;
      //   edgeVerts.push(vertices[idx], vertices[idx + 1], vertices[idx + 2]);
      // }
  
      // const edgeBuffer = gl.createBuffer();
      // gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuffer);
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edgeVerts), gl.STATIC_DRAW);
  
      // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      // gl.enableVertexAttribArray(a_Position);
  
      // // Set color for edges
      // gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0);
      // gl.drawArrays(gl.LINES, 0, edgeVerts.length / 3);
    }
  }