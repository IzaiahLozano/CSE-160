// DrawTriangle.js (c) 2012 matsuda
var ctx;
var canvas;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color){
  ctx.strokeStyle = color; 
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, canvas.height/2);
  ctx.lineTo(canvas.width / 2 + v.elements[0] * 20, canvas.height / 2 - v.elements[1] * 20);
  ctx.stroke();
}

function handleDrawEvent(){

  //Reset Canvas  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  //Read Values of 1st Vector
  let x1 = document.getElementById('xCoord1').value;
  let y1 = document.getElementById('yCoord1').value;

  let v1 = new Vector3([x1, y1, 0.0]);
  drawVector(v1, 'red');

  //Read Values of 1st Vector
  let x2 = document.getElementById('xCoord2').value;
  let y2 = document.getElementById('yCoord2').value;

  let v2 = new Vector3([x2, y2, 0.0]);
  drawVector(v2, 'blue');


}

function handleDrawOperationEvent(){
  //Reset Canvas  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Read Values of 1st Vector
  let x1 = document.getElementById('xCoord1').value;
  let y1 = document.getElementById('yCoord1').value;

  let v1 = new Vector3([x1, y1, 0.0]);
  drawVector(v1, 'red');

  //Read Values of 1st Vector
  let x2 = document.getElementById('xCoord2').value;
  let y2 = document.getElementById('yCoord2').value;

  let v2 = new Vector3([x2, y2, 0.0]);
  drawVector(v2, 'blue');

  var operator = document.getElementById('opt').value;

   // Add and Sub
   if (operator == "Add"){
      v1.add(v2);
      drawVector(v1, "green");
   } else if (operator == "Sub"){
      v1.sub(v2);
      drawVector(v1, "green");
   } 
   
   // Mul and Div
   else if (operator == "Mul"){
      var scale = document.getElementById('scalar').value;
      v1.mul(scale);
      drawVector(v1, "green");
      v2.mul(scale);
      drawVector(v2, "green");
   } else if (operator == "Div"){
      var scale = document.getElementById('scalar').value;
      v1.div(scale);
      drawVector(v1, "green");
      v2.div(scale);
      drawVector(v2, "green");
   }

    // Mag and Norm
    else if (operator == "Mag"){
      console.log("Magnitude V1: "+ v1.magnitude());
      console.log("Magnitude V2: "+ v2.magnitude());
   } else if (operator == "Norm"){
        var v1n = v1.normalize();
        drawVector(v1n, "green");
        var v2n = v2.normalize();
        drawVector(v2n, "green");
   }

   // Angle
   else if (operator == "Ang"){
    console.log("Angle: " + (angleBetween(v1, v2)).toFixed(2));
   }

   //Area
   else if (operator == "Area"){
    console.log("Area of this triangle: " + (areaTriangle(v1, v2)).toFixed(1));
 }


}

// The function below is a slighlty modified ChatGPT answer, I didn't know how to translate that equation in code
function angleBetween(v1, v2){

   // Compute dot product
   const dotProd = Vector3.dot(v1, v2);

   // Compute magnitudes
   const magV1 = v1.magnitude();
   const magV2 = v2.magnitude();
 
   // Guard against division by zero
   if (magV1 === 0 || magV2 === 0) {
     console.error("Cannot compute angle with zero-length vector.");
     return null;
   }
 
   // Compute cosine of angle in radians
   var cosTheta = Math.acos(dotProd / (magV1 * magV2));
   cosTheta *= 180/Math.PI;
 
   // Return angle 
   return cosTheta;
}

// The function below is a slighlty modified ChatGPT answer, I didn't know how to translate that equation in code
function areaTriangle(v1, v2) {
  // Compute the cross product
  const crossProd = Vector3.cross(v1, v2);

  var newV = new Vector3([crossProd[0], crossProd[1], crossProd[2]])

  // Get magnitude of the cross product vector
  const areaParallelogram = newV.magnitude();

  // Triangle is half the area
  return 0.5 * areaParallelogram;
}
