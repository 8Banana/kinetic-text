/* jshint esnext: true, browser: true */

let font = "assets/AvenirNextLTPro-Demi.otf";
let points;
let creatures = [];

const MOUSE_MIN_DISTANCE = 50;

class Creature {
  constructor(target) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(target.x, target.y);
    this.r = 5;

    this.maxVelocity = 5;

    this.vel = createVector();
    this.acc = createVector();
  }

  seek_target() {
    this.acc.add(p5.Vector.sub(this.target, this.pos));
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxVelocity); // terminal velocity
    this.vel.mult(0.9); // friction
    this.acc.mult(0);
    this.pos.add(this.vel);
  }

  draw() {
    let d = this.pos.dist(createVector(mouseX, mouseY));
    let hue = lerpColor(color(0, 255, 0), color(255, 0, 0), MOUSE_MIN_DISTANCE / d);
    fill(hue);
    stroke(hue);

    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

function preload() {
  font = loadFont(font);
}

function setup() {
  createCanvas(512, 256 + 128);
  textSize(192);
  points = font.textToPoints("p5.js", 10, height / 2);

  for (let target of points) creatures.push(new Creature(target));
}

function draw() {
  background(0);

  let mouse = createVector(mouseX, mouseY);
  creatures.forEach(c => {
    if (c.pos.dist(mouse) < MOUSE_MIN_DISTANCE) {
      let d = p5.Vector.sub(c.pos, mouse);
      c.acc.add(d);
      c.acc.setMag(10);
    } else {
      c.seek_target();
    }
    c.update();
    c.draw();
  });
}
