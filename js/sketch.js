/* jshint esnext: true, browser: true */

let font = "assets/AvenirNextLTPro-Demi.otf";
let freePoints;
let creatures = [];

const MOUSE_MIN_DISTANCE = 100;

class Creature {
  constructor(target) {
    this.pos = createVector(random(width), random(height));
    this.target = null;
    this.r = 5;
    this.maxVelocity = 5;

    this.vel = createVector();
    this.acc = createVector();
  }

  setTarget(target) {
    if (target !== null)
    this.target = createVector(target.x, target.y);
  }

  popTarget() {
    let target = this.target;
    this.target = null;
    return target;
  }

  seekTarget() {
    if (this.pos.dist(createVector(mouseX, mouseY)) >= MOUSE_MIN_DISTANCE) {
      if (this.target === null) {
        let bestIndex = null;
        let bestDistance = Infinity;

        for (let i = 0; i < freePoints.length; ++i) {
          let fp = freePoints[i];
          if (fp === null) continue;
          let d = this.pos.dist(createVector(fp.x, fp.y));
          if (d < bestDistance) {
            bestIndex = i;
            bestDistance = d;
          }
        }

        this.setTarget(freePoints.splice(bestIndex, 1)[0]);
      }

      this.acc.add(p5.Vector.sub(this.target, this.pos));
    }
  }

  repelMouse() {
    let mouse = createVector(mouseX, mouseY);
    if (this.pos.dist(mouse) < MOUSE_MIN_DISTANCE) {
      let d = p5.Vector.sub(this.pos, mouse);
      d.setMag(this.maxVelocity);
      this.acc.add(d);
      freePoints.push(this.popTarget());
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxVelocity); // terminal velocity
    this.acc.mult(0);
    this.pos.add(this.vel);
    this.vel.mult(0.5); // friction
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
  const text = "8banana";

  //createCanvas(64 + 256 + 512, 256 + 64);
  createCanvas(text.length * 125, 32 + 256);
  textSize(192);
  angleMode(DEGREES);
  freePoints = font.textToPoints(text, 10, 200);

  while (freePoints.length > 0) {
    let creature = new Creature();
    creature.setTarget(freePoints.pop());
    creatures.push(creature);
  }
}

function draw() {
  background(0);

  let mouse = createVector(mouseX, mouseY);
  creatures.forEach(c => {
    c.repelMouse();
    c.seekTarget();
    c.update();
    c.draw();
  });
}
