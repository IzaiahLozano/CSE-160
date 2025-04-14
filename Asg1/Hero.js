function drawHero() {
    const drk = [0.3, 0.2, 0.1, 1.0];   // dark brown
    const tan = [0.8, 0.6, 0.3, 1.0];    // tan
    const bbb = [1.0, 1.0, 1.0, 1.0];  // white
    const size = 10;
  
    // Nose
    new Triangle([-0.5, -0.5], [0.0, -1.0], [0.5, -0.5], tan, size).render(); // mid low strip
    new Triangle([-0.5, -0.5], [0.0, -1.0], [-0.1, -0.5], drk, size).render(); // left btm cheek
    new Triangle([0.5, -0.5], [0.0, -1.0], [0.1, -0.5], drk, size).render(); // right btm cheek

    new Triangle([-0.5, -0.5], [-0.7, -1.0], [0.0, -1.0], tan, size).render(); // left torso
    new Triangle([0.5, -0.5], [0.7, -1.0], [0.0, -1.0], tan, size).render(); // left torso
    
    new Triangle([-0.5, -0.5], [-0.7, 0.2], [-0.1, -0.5], drk, size).render(); // left top cheek
    new Triangle([0.5, -0.5], [0.7, 0.2], [0.1, -0.5], drk, size).render(); // right top cheek

    new Triangle([-0.7, 0.4], [-0.7, 1.0], [-0.5, 0.7], drk, size).render(); // left inner ear
    new Triangle([0.7, 0.4], [0.7, 1.0], [0.5, 0.7], drk, size).render(); // right inner ear

    new Triangle([-0.8, 0.8], [-0.7, 0.4], [-0.7, 1.0], tan, size).render(); // left outer ear
    new Triangle([0.8, 0.8], [0.7, 0.4], [0.7, 1.0], tan, size).render(); // left outer ear


    new Triangle([-0.7, 0.4], [0.0, 0.2], [-0.5, 0.7], tan, size).render(); // left top head
    new Triangle([0.7, 0.4], [0.0, 0.2], [0.5, 0.7], tan, size).render(); // right top head
    new Triangle([-0.5, 0.7], [0.0, 0.2], [0.5, 0.7], drk, size).render(); // Mid head

    new Triangle([-0.7, 0.2], [0.0, 0.2], [-0.7, 0.4], tan, size).render(); // left btm head
    new Triangle([0.7, 0.2], [0.0, 0.2], [0.7, 0.4], tan, size).render(); // right btm head

    new Triangle([-0.7, 0.2], [0, -0.7], [0.7, 0.2], tan, size).render(); // big mid
    new Triangle([-0.2, -0.5], [0, -0.7], [-0.1, -0.4], tan, size).render(); // left snout
    new Triangle([0.2, -0.5], [0, -0.7], [0.1, -0.4], tan, size).render(); // right snout
    new Triangle([-0.1, -0.4], [0, -0.7], [0.1, -0.4], tan, size).render(); // mid snout


    new Triangle([-0.1, -0.6], [0, -0.7], [0.1, -0.6], drk, size).render(); // nose

    new Circle([-0.3, 0], drk, 13, 30).render(); // left eye outer
    new Circle([-0.3, 0], tan, 10, 30).render(); // left eye mid
    new Circle([-0.3, 0], drk, 8, 30).render(); // left eye inner
    new Circle([-0.35, 0.02], bbb, 3, 30).render(); // left eye shine

    new Circle([0.3, 0], drk, 13, 30).render(); // right eye outer
    new Circle([0.3, 0], tan, 10, 30).render(); // right eye mid
    new Circle([0.3, 0], drk, 8, 30).render(); // right eye inner
    new Circle([0.27, 0.02], bbb, 3, 30).render(); // right eye shine

    

  
    // // Right ear
    // new Triangle([0.6, 0.7], [0.5, 0.9], [0.7, 0.8], colorDark, size).render();
  
    // // Head shape
    // new Triangle([-0.5, 0.6], [0.5, 0.6], [0.0, -0.5], colorTan, size).render();
    // new Triangle([-0.5, 0.6], [0.0, -0.5], [-0.6, 0.2], colorTan, size).render();
    // new Triangle([0.5, 0.6], [0.6, 0.2], [0.0, -0.5], colorTan, size).render();
  
    // // Snout
    // new Triangle([-0.2, -0.1], [0.2, -0.1], [0.0, -0.4], colorDark, size).render();
  
    // // Nose
    // new Triangle([-0.05, -0.35], [0.05, -0.35], [0.0, -0.4], colorBlack, size).render();
  
    // // Eyes
    // new Triangle([-0.25, 0.2], [-0.2, 0.15], [-0.3, 0.15], colorBlack, size).render();
    // new Triangle([0.25, 0.2], [0.2, 0.15], [0.3, 0.15], colorBlack, size).render();
  }
  