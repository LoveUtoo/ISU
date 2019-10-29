let x = 50;
let left = true;
let cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-holder');
  //cnv.center();
  background(100);
}

function draw() {
	background(100);
	fill(255);	
	
  ellipse(x, 50, 80, 80);
  if(left) {
	x += 1;
	if(x >= 500)
		left = false
  }
  if(!left) {
	x -= 1;
	if (x <=50){
		left = true;
	}
  }
}
