class Point {
    constructor(position, color, size) {
        this.type = 'point';
        this.position = position || [0.0, 0.0];
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        this.size = size || 5.0;
        this.rotation = 0.0;
        }

        render() {
            gl.enableVertexAttribArray(a_Position);
          
            // Calculate rotated square vertices around the center point
            const angle = this.rotation * Math.PI / 180;
            const halfSize = this.size / 200; // Adjust to canvas scale
          
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
          
            // 4 corners of the square before rotation
            const square = [
              [-halfSize, -halfSize],
              [halfSize, -halfSize],
              [halfSize, halfSize],
              [-halfSize, halfSize]
            ];
          
            // Apply rotation and translation
            const rotated = square.map(([dx, dy]) => {
              const x = dx * cosA - dy * sinA + this.position[0];
              const y = dx * sinA + dy * cosA + this.position[1];
              return [x, y];
            });
          
            const vertices = new Float32Array([
              ...rotated[0], ...rotated[1], ...rotated[2],
              ...rotated[0], ...rotated[2], ...rotated[3],
            ]);
          
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
          
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.uniform4f(u_FragColor, ...this.color);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
          }
          
  }