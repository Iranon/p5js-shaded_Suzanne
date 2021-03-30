var suz;
var shd;
var Suz_AO;

function preload() {

  suz = loadModel('mesh/Suz.obj', true);  //load 3D mesh
  shd = loadShader('shaders/vertex.vert', 'shaders/toon_cel-shading.frag'); //load shader
}

function setup() {

  var cnv = createCanvas(700, 700, WEBGL);
  cnv.parent("p5_script");  //put the canvas inside the 'p5_script' <div> (html)
  noCursor();
  noStroke();
  background(210);
  Suz_AO = loadImage('textures/Suz_AO.png');  //load AO texture
}

function draw() {

  //Pass AO texture to the shader
  shd.setUniform('AO', Suz_AO);

  //Set light position
  var mX = map(mouseX - width/2, 0.0, width, 0.0, 0.0+width);
  var mY = map(mouseY - height/2, 0.0, height, 0.0, 0.0+height);
  shd.setUniform( 'mousePos', [ (mX), (mY), 8 ] );

  push();
  rotateZ(PI);
  scale(1.3);
  shader(shd);  //apply shader
  model(suz); //draw model
  pop();
}
