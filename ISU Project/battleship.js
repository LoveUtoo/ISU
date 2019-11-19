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
let visible = false;
let ship = [0, 1, 2, 3];
let visPoint = false;
let attemps = 0;


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

class BS {
	contructor() {
		this.x1 = X1;
		this.y1 = Y1;
		this.x2 = X2;
		this.y2 = Y2;
		this.alive = true;
	}
}

let line1 = new LINE();
let line2 = new LINE();


function setup() { //setting up stuff
    SW = windowWidth / 2;
    SH = windowHeight / 2;
    cnv = createCanvas(800, 800);
    cnv.parent('sketch-holder');
    background(0);
	spawnShips();
}

function windowResized() {
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
    background(0, 210, 210);
    fill(0, 139, 139);

    textSize(16);
    text(ship[0].x1, 100, 100);
    text(ship[0].x2, 100, 200);
    text(ship[0].y1, 100, 300);
    text(ship[0].y2, 100, 400);
    //text(line2.currX, 150, 400);
    fill(255);

    stroke(255);
    strokeWeight(1);

    for (var i = 25; i < width; i += 75) { //creating grid
        for (var j = 20; j < height; j += 75) {
            line(i, 20, i, height - 30);
            line(25, j, width - 25, j);
            text((j - 20) / 75, j - 5, height - 10);
        }
        text((height - 25 - i) / 75, 0, i + 5);
    }
	
	if (visible) {
		for (var i = 0; i < 4; i++) {
			rect(25 + (ship[i].x1 * 75), 770 - (ship[i].y1 * 75), 75, 75);
			//rect(ship[i].x1, ship[i].y1, ship[i].x2, ship[i].y2);
			//rect(20, 20, 200, 200);
		}
	}

    if (line1.currX >= line1.maxX && line2.currX >= line2.maxX) { //increments line length
        ifFired = false;
    }
    increment(line1);
    increment(line2);

    //Actual drawing of lines
    stroke(255, 0, 0);
    fill(255, 0, 0);
    line(25 + setInitialX(line1), 770 - (ifZero(line1.b) * 75), 25 + (line1.currX * 75), 770 - (line1.currY * 75)); //line 1
    stroke(0, 0, 255);
    fill(0, 0, 255);
    line(25 + setInitialX(line2), 770 - (ifZero(line2.b) * 75), 25 + (line2.currX * 75), 770 - (line2.currY * 75)); //line 2
	
	if (line1.currX >= intX && line2.currX >= intX) {
			visPoint = true;
	}

	if (visPoint == true) {
		stroke(255, 0, 0);
		fill(255, 0, 0);
		ellipse(25 + (intX * 75), 770 - (intY * 75), 10, 10); //This should be in a separate function eventually if you want the ellipses to stay
	}

}

function maxValue(l) {
    if (l.m > 0 && l.m * 10 + Number(l.b) >= 10) {
        l.maxY = 10;
        l.maxX = (Number(l.maxY) - Number(l.b)) / Number(l.m);
    } else if (l.m > 0 && l.m * 10 + Number(l.b) < 10) {
		l.maxX = 10;
		l.maxY = l.m * 10 + Number(l.b);
	} else if (l.m < 0 && l.m * 10 + Number(l.b) > 0) {
		l.maxX = 10;
		l.m * 10 + Number(l.b);
	} else if (l.m < 0 && l.m * 10 + Number(l.b) <= 0) {
		l.maxY = 0;
        l.maxX = (Number(l.maxY) - Number(l.b)) / Number(l.m);
	}
}

function fired() {
    line1.m = Math.round(document.getElementById('m1').value);
    line2.m = Math.round(document.getElementById('m2').value);
    line1.b = Math.round(document.getElementById('b1').value);
    line2.b = Math.round(document.getElementById('b2').value);
    intX = (line2.b - line1.b) / (line1.m - line2.m);
    intY = line1.m * intX + Number(line1.b); //This cast to number to fix the stupid problem where b1 was a character/string due to stupid js typesafe shit
    maxValue(line1);
    maxValue(line2);
    line1.currX = ifZero(-1 * line1.b) / line1.m;
    line1.currY = 0;
    line2.currX = ifZero(-1 * line2.b) / line2.m;
    line2.currY = 0;
    ifFired = true;
	visPoint = false;
	attemps++;
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
        return ((0 - l.b) / l.m) * 75;
    } else {
        return 0;
    }
}

function showShips() {
	if (visible) {
		visible = false;
	} else {
		visible = true;
	}
}

function spawnShips() {
	for (var i = 0; i < 4; i++) {
		//var s = Math.floor((Math.random() * 4);
		var s = 10;
		createShip(i, s);
	}
}

function createShip(n, s) {
	ship[n] = new BS;
	if (n == 0) {
		ship[n].x1 = Math.floor((Math.random() * 5) + 4);
		ship[n].y1 = Math.floor((Math.random() * 5) + 4);
		ship[n].x2 = ship[n].x1 + 1;
		ship[n].y2 = ship[n].y1 + 1;
	} 
	if (n == 1) {
		ship[n].x1 = Math.floor((Math.random() * 5) + 0);
		ship[n].y1 = Math.floor((Math.random() * 5) + 4);
		ship[n].x2 = ship[n].x1 + 1;
		ship[n].y2 = ship[n].y1 + 1;
	}
	if (n == 2) {
		ship[n].x1 = Math.floor((Math.random() * 5) + 0);
		ship[n].y1 = Math.floor((Math.random() * 5) + 1);
		ship[n].x2 = ship[n].x1 + 1;
		ship[n].y2 = ship[n].y1 + 1;
	}
	if (n == 3) {
		ship[n].x1 = Math.floor((Math.random() * 5) + 4);
		ship[n].y1 = Math.floor((Math.random() * 5) + 1);
		ship[n].x2 = ship[n].x1;
		ship[n].y2 = ship[n].y1;
	}
}