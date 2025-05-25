class WallMesh {
  constructor(map, scale = 0.7) {
    this.map = map;
    this.cubes = [];
    this.scale = scale;
    this.generateCubes();
  }

  generateCubes() {
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[x].length; y++) {
        const height = this.map[x][y];
        if (height > 0) {
          for (let h = 0; h < height; h++) {
            const cube = new Cube();

            cube.color = [
              Math.random() * 0.5 + 0.5,
              Math.random() * 0.5 + 0.5,
              Math.random() * 0.5 + 0.5,
              1.0,
            ];

            cube.matrix.translate(
              (x - 16) * this.scale,
              (h - 0.75) * this.scale,
              (y - 16) * this.scale
            );
            cube.matrix.scale(this.scale, this.scale, this.scale);

            this.cubes.push(cube);
          }
        }
      }
    }
  }

  render() {
    for (let cube of this.cubes) {
      cube.drawCube();
    }
  }
}
