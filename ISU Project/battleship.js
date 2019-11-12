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
    cnv = createCanvas(800, 800);
    cnv.parent('sketch-holder');
    background(0);

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
    text(mouseX, 100, 100);
    text(line1.maxX, 100, 200);
    text(line2.maxX, 100, 300);
    text(20 + setInitialX(line1), 100, 400);
    //text(line2.currX, 150, 400);
    fill(255, 153, 51);

    stroke(255, 153, 51);
    strokeWeight(1);

    for (var i = 25; i < width; i += 75) {
        for (var j = 20; j < height; j += 75) {
            line(i, 20, i, height - 30);
            line(25, j, width - 25, j);
            text((j - 20) / 75, j - 5, height - 10);
        }
        text((height - 25 - i) / 75, 0, i + 5);
    }

    if (line1.currX >= line1.maxX && line2.currX >= line2.maxX) {
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

    ellipse(20 + (intX * 50), 520 - (intY * 50), 10, 10); //This should be in a separate function eventually if you want the ellipses to stay

}

function maxValue(l) {
    if (l.m > 0 && l.m * 10 + Number(l.b) <= 10) {
        l.maxY = 10;
        l.maxX = (Number(l.maxY) - Number(l.b)) / Number(l.m);
    } else if (l.m > 0 && l.m * 10 + Number(l.b) > 10) {
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