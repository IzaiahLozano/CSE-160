class Circle {
    constructor(center, color, size, segments) {
      this.type = 'circle';
      this.position = center;
      this.color = color || [1.0, 1.0, 1.0, 1.0];
      this.size = size || 5.0;
      this.segmentCount = segments || 12;
      this.outline = 0;
    }
  
    render() {
      const [cx, cy] = this.position;
      const angleStep = (2 * Math.PI) / this.segmentCount;
      const radius = this.size / 150;
      const vertices = [];
  
      for (let i = 0; i <= this.segmentCount; i++) {
        const angle = i * angleStep;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        vertices.push(x, y);
      }
  
      // Add center point at start
      vertices.unshift(cy);
      vertices.unshift(cx);
  
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
      gl.uniform4f(u_FragColor, ...this.color);
      gl.uniform1f(u_Size, this.size);
  
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segmentCount + 2);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }
  