//let x = 50;
let inputM1;
let inputM2;
let inputB1;
let inputB2;
let buttonFire;
let buttonHelp;
let cnv;
let SW;
let SH;
let plot;
let intX = 0; //coords of interception of lines
let intY = 0;
let ifFired = false; //if fired bool


class LINE {
	constructor() {
		this.m = 0; //slope
		this.b = 0; //yint
		this.maxX = 0; //max value x
		this.maxY = 0; //max value y
		this.currX = 0; //current x
		this.currY = 0; //current y
	}
}

let line1 = new LINE();
let line2 = new LINE();


function setup() { //setting up stuff
	SW = windowWidth / 2;
	SH = windowHeight / 2;
	cnv = createCanvas(500, 600);
	cnv.parent('sketch-holder');
	background(0);
	
	inputM1 = createInput('0', "number");
	inputM1.size(50);
	inputM1.position(SW - 220, 700);
	
	inputB1 = createInput('0', "number");
	inputB1.size(50);
	inputB1.position(SW - 120, 700);
	
	inputM2 = createInput('0', "number");
	inputM2.size(50);
	inputM2.position(SW - 20, 700);
	
	inputB2 = createInput('0', "number");
	inputB2.size(50);
	inputB2.position(SW + 80, 700);
	
	buttonFire = createButton("FIRE");
	buttonFire.size(50);
	buttonFire.position(SW + 140, 700);
	buttonFire.mousePressed(fired);
	
	buttonHelp = createButton("HELP");
	buttonHelp.size(50);
	buttonHelp.position(SW + 190, 700);
	
}

function windowResized() { //changes location of buttons depending on window size BECAUSE CREATEINPUT JUST CREATES AN HTML INPUT TAG!!!!!!
	SW = windowWidth / 2;
	SH = windowHeight / 2;
	inputM1.position(SW - 220, 700);
	inputB1.position(SW - 120, 700);
	inputM2.position(SW - 20, 700);
	inputB2.position(SW + 80, 700);
	buttonFire.position(SW + 140, 670);
	
}

function draw() { //drawing stuff
	//Setup grid
	background(255);
	fill(255);	
	
	textSize(16);
	text(line1.maxY, 100, 100);
	text(line1.maxX, 100, 200);
	text(line1.currX, 100, 300);
	text(20 + setInitialX(line1), 100, 400);
	//text(line2.currX, 150, 400);
	fill(255, 153, 51);
	
	stroke(255, 153, 51);
	strokeWeight(1);
	
	for (var i = 20; i < width; i += 50) {
		for (var j = 20; j < height - 50; j += 50) {
			line(i, 20, i, height - 80);
			line(20, j, width, j);
			text((j - 20) / 50, j - 5, height - 60);
		}
		text((height - 80 - i) / 50, 0, i + 5);
	}
	
	if (line1.currX >= line1.maxX && line2.currX >= line2.maxX) {
		ifFired = false;
	}
	increment(line1);
	increment(line2);
	
	//Actual drawing of lines
	stroke(255, 0, 0);
	fill(255, 0, 0);
	line(20 + setInitialX(line1), 520 - (ifZero(line1.b) * 50), 20 + (line1.currX * 50), 520 - (line1.currY * 50)); //line 1
	text("M1 = ", 0, 587);
	text("B1 = ", 100, 587);
	stroke(0, 0 , 255);
	fill(0, 0, 255);
	line(20 + setInitialX(line2), 520 - (ifZero(line2.b) * 50), 20 + (line2.currX * 50), 520 - (line2.currY * 50)); //line 2
	text("M2 = ", 200, 587);
	text("B2 = ", 300, 587);
	
	ellipse(20 + (intX * 50), 520 - (intY * 50),  10, 10); //This should be in a separate function eventually if you want the ellipses to stay
	
}

function maxValue(l) {
	if (l.m > 0) {
		l.maxY = 10;
		l.maxX = (Number(l.maxY) - Number(l.b)) / Number(l.m);
	} else {
		l.maxY = 0;
		l.maxX = (Number(l.maxY) - Number(l.b)) / Number(l.m);
	}
}

function fired() {
	line1.m = Math.round(inputM1.value());
	line2.m = Math.round(inputM2.value());
	line1.b = Math.round(inputB1.value());
	line2.b = Math.round(inputB2.value());
	intX = (line2.b - line1.b) / (line1.m - line2.m);
	intY = line1.m * intX + Number(line1.b); //This cast to number to fix the stupid problem where b1 was a character/string due to stupid js typesafe shit
	maxValue(line1);
	maxValue(line2);
	line1.currX = ifZero(-1 * line1.b) / line1.m;
	line1.currY = 0;
	line2.currX = ifZero(-1 * line2.b) / line2.m;
	line2.currY = 0;
	ifFired = true;
}

function increment(l) {
	if (ifFired == true) {
		if (l.currX < l.maxX + 0.05 && l.m > 0) {
			l.currX += 0.05;
			l.currY = (l.m * l.currX) + Number(l.b);
			if (l.currY > l.maxY && l.m > 0) {
				l.currX = l.maxX;
				l.currY = l.maxY;
			}
		}
		if (l.currX < l.maxX + 0.05 && l.m < 0) {
			l.currX += 0.05;
			l.currY = (l.m * l.currX) + Number(l.b);
			if (l.currY < l.maxY && l.m < 0) {
				l.currX = l.maxX;
				l.currY = l.maxY;
			}
		}
	}
}

function ifZero(n) {
	if (n > 0) {
		return n;
	} else {
		return 0;
	}
}

function setInitialX(l) {
	if (l.b < 0) {
		return ((0 - l.b) / l.m) * 50;
	} else {
		return 0;
	}
}
