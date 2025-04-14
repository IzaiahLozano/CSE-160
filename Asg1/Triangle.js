class Triangle {
    constructor(...args) {
      this.type = 'triangle';
      this.outline = 0;
  
      if (args.length === 3) {
        const [center, color, size] = args;
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        this.size = size || 5.0;
        this.vertices = this.generateVertices(center);
      } 
      else if (args.length === 5) {
        const [p1, p2, p3, color, size] = args;
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        this.size = size || 5.0;
        this.vertices = [...p1, ...p2, ...p3];
      } 
      else {
        throw new Error("Invalid Triangle constructor usage");
      }
    }
  
    generateVertices(center) {
      const scale = this.size / 150;
      const [x, y] = center;
      const p1 = [x, y + scale];
      const p2 = [x - scale, y - scale];
      const p3 = [x + scale, y - scale];
      return [...p1, ...p2, ...p3];
    }
  
    render() {
      const vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return;
      }
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
      const [r, g, b, a] = this.color.length === 4 ? this.color : [1.0, 1.0, 1.0, 1.0];
      gl.uniform4f(u_FragColor, r, g, b, a);
      gl.uniform1f(u_Size, this.size);
  
      if (this.outline === 0) {
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
  
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }
  