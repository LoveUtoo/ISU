let cnv; //Canvas
let SW; //ScreenWidth
let SH; //ScreenHeight
let intX = 0; //coords of interception of lines
let intY = 0;
let ifFired = false; //if fired bool
let visible = false; //If ships are visible bool
let ship = [0, 1, 2, 3]; //Ship objects
let visPoint = false; //Bool if intersection point is visible
let attemps = 0;
let numShips = 0;
let shipFlag = [0, 1, 2, 3];

let test = "false"; //variable for testing purposes

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
        this.x1 = X1; //sets coords of ships
        this.y1 = Y1;
        this.x2 = X2;
        this.y2 = Y2;
        this.alive = true; //alive bool
    }
}

let line1 = new LINE();
let line2 = new LINE();


function setup() { //setting canvas and such
    SW = windowWidth / 2;
    SH = windowHeight / 2;
    cnv = createCanvas(800, 800);
    cnv.parent('sketch-holder');
    background(0);
    spawnShips();
}

function draw() { //drawing stuff
    background(0, 210, 210);
    fill(0, 139, 139);

    textSize(16);
    /*text(numShips, 100, 100); // testing features vvvvvv
    text(ship[2].y2, 100, 200);
    text(ship[2].x1, 100, 300);
    text(ship[2].x2, 100, 400);
    //text(line2.currX, 150, 400);*/
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

    if (visible) { //draws the ships
        for (var i = 0; i < 4; i++) {
            if (ship[i].alive == false) fill(255, 0, 0);
            if (ship[i].alive != false) fill(255, 255, 255);
            rect(25 + (ship[i].x1 * 75), 770 - (ship[i].y1 * 75), 75, 75);
            //text(i, 25 + (ship[i].x1 * 75), 770 - (ship[i].y1 * 75));
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

    if (line1.currX >= intX && line2.currX >= intX) {//checks if the lines have intersected
        stroke(255, 0, 255);
        fill(255, 0, 255);
        ellipse(25 + (intX * 75), 770 - (intY * 75), 10, 10); //Actually draws the point of interception
        for (var i = 0; i < 4; i++) {
            if (intX > ship[i].x1 && intX < ship[i].x2 && intY < ship[i].y1 && intY > ship[i].y2) ship[i].alive = false; //kills the ship if intercept in on hitbox
        }
    }

    for (var i = 0; i < 4; i++) { //this sets numShips
        if (ship[i].alive != false) shipFlag[i] = 1;
        if (ship[i].alive == false) shipFlag[i] = 0;
    }

    numShips = shipFlag[0] + shipFlag[1] + shipFlag[2] + shipFlag[3]; //summation of all the flags to get ships left
    document.getElementById("number-ships").innerHTML = numShips;
}

function maxValue(l) { //figures out max value for the lines
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

function fired() { //button that fires the lines and takes in user input
    line1.m = document.getElementById('m1').value;
    line2.m = document.getElementById('m2').value;
    line1.b = document.getElementById('b1').value;
    line2.b = document.getElementById('b2').value;
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

function increment(l) { //function that increments the lines, making them longer
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

function ifZero(n) { //function that error checks if certain values are zero or not
    if (n > 0) {
        return n;
    } else {
        return 0;
    }
}

function setInitialX(l) { //sets the initial x coord of the line
    if (l.b < 0) {
        return ((0 - l.b) / l.m) * 75;
    } else {
        return 0;
    }
}

function showShips() { //toggles ship visbility
    if (visible) {
        visible = false;
    } else {
        visible = true;
    }
}

function spawnShips() { //spawns the ships
    for (var i = 0; i < 4; i++) {
        var s = 10;
        createShip(i, s);
    }
}

function createShip(n, s) { //makes the ship locations pseudo random
    ship[n] = new BS;
    if (n == 0) {
        ship[n].x1 = Math.floor((Math.random() * 4) + 6);
        ship[n].y1 = Math.floor((Math.random() * 4) + 6);
        ship[n].x2 = ship[n].x1 + 1;
        ship[n].y2 = ship[n].y1 - 1;
    }
    if (n == 1) {
        ship[n].x1 = Math.floor((Math.random() * 5) + 0);
        ship[n].y1 = Math.floor((Math.random() * 4) + 6);
        ship[n].x2 = ship[n].x1 + 1;
        ship[n].y2 = ship[n].y1 - 1;
    }
    if (n == 2) {
        ship[n].x1 = Math.floor((Math.random() * 4) + 0);
        ship[n].y1 = Math.floor((Math.random() * 5) + 1);
        ship[n].x2 = ship[n].x1 + 1;
        ship[n].y2 = ship[n].y1 - 1;
    }
    if (n == 3) {
        ship[n].x1 = Math.floor((Math.random() * 5) + 5);
        ship[n].y1 = Math.floor((Math.random() * 5) + 1);
        ship[n].x2 = ship[n].x1 + 1;
        ship[n].y2 = ship[n].y1 - 1;
    }
}

function resetGame() { //reseting the game; resets all values
    line1.m = 0;
    line2.m = 0;
    line1.b = 0;
    line2.b = 0;
    line1.maxX = 0;
    line2.maxX = 0;
    line1.maxY = 0;
    line2.maxY = 0;
    line1.currX = 0;
    line2.currX = 0;
    line1.currY = 0;
    line2.currY = 0;

    intX = 0;
    intY = 0;

    spawnShips();

    attemps = 0;

}

function displayNumShips() { //displays number of ships left
    document.getElementById("numberShips").innerHTML = numShips;
}