function animalDraw(){
    
    let body = new Cube();
    body.color = [1.0, 1.0, 1.0, 1.0];
    body.matrix.setTranslate(0, -0.18, 0);
    body.matrix.scale(.7, 0.75, .6);
    body.drawCube();

    let chest = new Cube();
    chest.color = [0.0, 0.0, 0.0, 1.0];
    chest.matrix.setTranslate(0, 0.3, 0);
    chest.matrix.scale(.7, 0.2, .6);
    chest.drawCube();

    let head = new Cube();
    head.color = [1.0, 1.0, 1.0, 1.0];
    head.matrix.setTranslate(0, .55, 0);
    head.matrix.rotate(g_headTiltAngle, 0, 0, 1); // 🆕 Head tilts side to side (Z axis)
    let headMatrix = new Matrix4(head.matrix);
    head.matrix.scale(.47, .3, .4);
    head.drawCube();

    let leftEye = new Cube();
    leftEye.color = [0.0, 0.0, 0.0, 1.0];
    leftEye.matrix = new Matrix4(headMatrix);
    leftEye.matrix.translate(-0.13, 0.02, -0.2);
    leftEye.matrix.scale(0.1, 0.15, 0.05);
    leftEye.drawCube();

    let rightEye = new Cube();
    rightEye.color = [0.0, 0.0, 0.0, 1.0];
    rightEye.matrix = new Matrix4(headMatrix);
    rightEye.matrix.translate(0.13, 0.02, -0.2);
    rightEye.matrix.scale(0.1, 0.15, 0.05);
    rightEye.drawCube();

    let leftPupil = new Cube();
    leftPupil.color = [0.14, 0.74, 0.36, 1.0];
    leftPupil.matrix = new Matrix4(headMatrix);
    leftPupil.matrix.translate(0.11, 0.03, -0.21);
    leftPupil.matrix.scale(0.05, 0.07, 0.05);
    leftPupil.drawCube();

    let rightPupil = new Cube();
    rightPupil.color = [0.14, 0.74, 0.36, 1.0];
    rightPupil.matrix = new Matrix4(headMatrix);
    rightPupil.matrix.translate(-0.11, 0.03, -0.21);
    rightPupil.matrix.scale(0.05, 0.07, 0.05);
    rightPupil.drawCube();

    let leftEar = new Cube();
    leftEar.color = [0.0, 0.0, 0.0, 1.0];
    leftEar.matrix = new Matrix4(headMatrix);
    leftEar.matrix.translate(-0.25, .15, 0);
    leftEar.matrix.scale(0.15, 0.15, 0.05);
    leftEar.drawCube();

    let rightEar = new Cube();
    rightEar.color = [0.0, 0.0, 0.0, 1.0];
    rightEar.matrix = new Matrix4(headMatrix);
    rightEar.matrix.translate(0.25, .15, 0);
    rightEar.matrix.scale(0.15, 0.15, 0.05);
    rightEar.drawCube();

    let snout = new Cube();
    snout.color = [1.0, 1.0, 1.0, 1.0];
    snout.matrix = new Matrix4(headMatrix);
    snout.matrix.translate(0, -0.1, -0.2);
    snout.matrix.scale(.25, 0.08, 0.1);
    snout.drawCube();

    let nose = new Cube();
    nose.color = [0, 0, 0, 1.0];
    nose.matrix = new Matrix4(headMatrix);
    nose.matrix.translate(0, -0.08, -0.21);
    nose.matrix.scale(.1, 0.04, 0.1);
    nose.drawCube();

    let pants = new Cube();
    pants.color = [1.0, 0.8, 0.6, 1.0];
    pants.matrix.setTranslate(0, -0.7, 0);
    pants.matrix.scale(.7, 0.3, .6);
    pants.drawCube();

    let tail = new Cube();
    tail.color = [0, 0, 0, 1.0];
    tail.matrix.setTranslate(0, -.7, 0.3);
    tail.matrix.scale(.1, 0.08, 0.13);
    tail.drawCube();

    let leftLeg = new Cube();
    leftLeg.color = [0.0, 0.0, 0.0, 1.0];
    leftLeg.matrix.setTranslate(-0.2, -0.7, -0.52);
    leftLeg.matrix.rotate(g_leftLegAngle, 1, -0.3, 0);
    leftLeg.matrix.scale(.3, 0.3, 0.45);
    leftLeg.drawCube();

    let rightLeg = new Cube();
    rightLeg.color = [0.0, 0.0, 0.0, 1.0];
    rightLeg.matrix.setTranslate(0.2, -0.7, -0.52);
    rightLeg.matrix.rotate(g_rightLegAngle, 1, -0.3, 0);
    rightLeg.matrix.scale(.3, 0.3, 0.45);
    rightLeg.drawCube();

    let leftUpperArm = new Cube();
    leftUpperArm.color = [0.0, 0.0, 0.0, 1.0];
    leftUpperArm.matrix.setTranslate(-0.45, 0.05, -0.05);
    leftUpperArm.matrix.rotate(g_leftUpperArmAngle, 1, -0.3, 0);
    let leftupperArmMatrix = new Matrix4(leftUpperArm.matrix);  
    leftUpperArm.matrix.scale(0.3, 0.55, 0.3);
    leftUpperArm.drawCube();

    let rightUpperArm = new Cube();
    rightUpperArm.color = [0.0, 0.0, 0.0, 1.0];
    rightUpperArm.matrix.setTranslate(0.45, 0.05, -0.05);
    rightUpperArm.matrix.rotate(g_rightUpperArmAngle, 1, 0.3, 0);
    let rightupperArmMatrix = new Matrix4(rightUpperArm.matrix);
    rightUpperArm.matrix.scale(0.3, 0.55, 0.3);
    rightUpperArm.drawCube();

    let leftLowerArm = new Cube();
    leftLowerArm.color = [0.0, 0.0, 0.0, 1.0];
    leftLowerArm.matrix = new Matrix4(leftupperArmMatrix);
    leftLowerArm.matrix.translate(0, -0.3, 0); 
    leftLowerArm.matrix.rotate(g_leftLowerArmAngle, 1, -0.5, 0); 
    let leftlowerArmMatrix = new Matrix4(leftLowerArm.matrix); 
    leftLowerArm.matrix.scale(0.3, 0.45, 0.3);
    leftLowerArm.drawCube();

    let rightLowerArm = new Cube();
    rightLowerArm.color = [0.0, 0.0, 0.0, 1.0];
    rightLowerArm.matrix = new Matrix4(rightupperArmMatrix);
    rightLowerArm.matrix.translate(0.0, -0.3, 0);
    rightLowerArm.matrix.rotate(g_rightLowerArmAngle, 1, 0.5, 0); 
    let rightlowerArmMatrix = new Matrix4(rightLowerArm.matrix); 
    rightLowerArm.matrix.scale(0.3, 0.45, 0.3);
    rightLowerArm.drawCube();

    let leftHand = new Cube();
    leftHand.color = [0.0, 0.0, 0.0, 1.0];
    leftHand.matrix = new Matrix4(leftlowerArmMatrix);
    leftHand.matrix.translate(0., -0.25, 0);
    leftHand.matrix.rotate(g_leftHandAngle, 1, -0.5, 0)
    let leftHandMatrix = new Matrix4(leftHand.matrix);
    leftHand.matrix.scale(0.3, 0.1, 0.3);
    leftHand.drawCube();

    let rightHand = new Cube();
    rightHand.color = [0.0, 0.0, 0.0, 1.0];
    rightHand.matrix = new Matrix4(rightlowerArmMatrix);
    rightHand.matrix.translate(0., -0.25, 0);
    rightHand.matrix.rotate(g_rightHandAngle, 1, 0.5, 0)
    rightHand.matrix.scale(0.3, 0.1, 0.3);
    rightHand.drawCube();

    let bamboo = new Cube();
    bamboo.color = [0.13, 0.63, 0.05, 1.0];
    bamboo.matrix = new Matrix4(leftHandMatrix);
    bamboo.matrix.translate(0, 0, 0.1);
    bamboo.matrix.scale(0.07, 0.07, 1);
    bamboo.drawCube();
 }