class Triangle {
    constructor(...args) {
      this.type = 'triangle';
      this.outline = 0;
      this.rotation = 0.0;
  
      if (args.length === 3) {
        const [center, color, size] = args;
        this.center = center;
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        this.size = size || 5.0;
      } else if (args.length === 5) {
        const [p1, p2, p3, color, size] = args;
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        this.size = size || 5.0;
        this.vertices = [...p1, ...p2, ...p3];
      } else {
        throw new Error("Invalid Triangle constructor usage");
      }
    }
  
    generateVertices() {
      const scale = this.size / 150;
      const [cx, cy] = this.center;
  
      // Points relative to center
      let p1 = [0, scale];
      let p2 = [-scale, -scale];
      let p3 = [scale, -scale];
  
      // Degrees → radians
      const rad = (this.rotation * Math.PI) / 180;
  
      const rotatePoint = ([x, y]) => {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return [
          x * cos - y * sin,
          x * sin + y * cos
        ];
      };
  
      // Rotate + translate
      p1 = rotatePoint(p1).map((v, i) => v + (i === 0 ? cx : cy));
      p2 = rotatePoint(p2).map((v, i) => v + (i === 0 ? cx : cy));
      p3 = rotatePoint(p3).map((v, i) => v + (i === 0 ? cx : cy));
  
      this.vertices = [...p1, ...p2, ...p3];
    }
  
    render() {
      if (!this.vertices && this.center) {
        this.generateVertices();
      }
  
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
  