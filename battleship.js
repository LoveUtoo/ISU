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
	
	for (var i = 0; i < width; i += width / 10) {
		for (var j = 0; j < height; j += height / 10) {
			stroke(0);
			strokeWeight(1);
			line(i, 0, i, height);
			line(0, j, width, j);
		}
	}
	
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
