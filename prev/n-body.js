let GRAVITATIONAL_CONSTANT = 6.67 * Math.pow(10, -11);
let NUM_PARTICLES = 50;
let TIME_STEP = 0.0015;
let TARGET_FPS = 120;
let MAX_VELOCITY = 2000;
// let PARTICLE_SIZE = 5;
let PARTICLE_MAX_MASS = 1.5; // Maximum starting size
let PARTICLE_MIN_MASS = 0.5; // Minimum starting size
let MOUSE_PARTICLE_MASS = 15;
let MAX_NUMBER_PREV_POSITIONS = 30;
let WRAP_AROUND = false;

var canvas = document.getElementById("nBodyCanvas");
let SCREEN_X = canvas.clientWidth;
let SCREEN_Y = canvas.clientHeight;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
// Multiplier for particle size (mass 1 gets this radius)
let PARTICLE_SIZE = 7.5 * (Math.min(SCREEN_X, SCREEN_Y) / 800);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  multiplyScalar(s) {
    return new Vector(s * this.x, s * this.y);
  }
  addVectors(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
  addVectorMut(v) {
    this.x += v.x;
    this.y += v.y;
  }
  subtractVectors(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  distance(v) {
    return this.subtractVectors(v).magnitude();
  }
}

class Particle {
  constructor(mass, x, y) {
    this.mass = mass;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.force = new Vector(0, 0);
    this.previousPos = [];
    this.color = "#" + (((1 << 24) * Math.random()) | 0).toString();
  }

  addPosition() {
    if (this.previousPos.length >= MAX_NUMBER_PREV_POSITIONS) {
      this.previousPos.shift();
    }
    this.previousPos.push(this.position);
  }

  getSize() {
    return Math.sqrt(Math.abs(this.mass)) * PARTICLE_SIZE;
  }
}

class NBody {
  constructor(n) {
    this.particles = [];
    this.camera = new Vector(0, 0);
    for (let i = 0; i < n; i++) {
      let randomParticle = new Particle(
        PARTICLE_MIN_MASS + Math.random() * (PARTICLE_MAX_MASS - PARTICLE_MIN_MASS),
        Math.random() * SCREEN_X,
        Math.random() * SCREEN_Y
      );
      this.particles.push(randomParticle);
    }
  }

  handleCollisions() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        let pi = this.particles[i];
        let pj = this.particles[j];
        let distance = pi.position.distance(pj.position);
        let collide_distance = 1.75 * Math.abs(pi.getSize() - pj.getSize());
        if (distance < collide_distance) {
          let larger_particle = pi.mass > pj.mass ? pi : pj;
          let smaller_particle = larger_particle != pi ? pi : pj;
          // Remove smaller particle
          this.particles.splice(this.particles.indexOf(smaller_particle), 1);
          // Update larger particle based on inelastic collision
          larger_particle.velocity = pi.velocity
            .multiplyScalar(pi.mass)
            .addVectors(pj.velocity.multiplyScalar(pj.mass))
            .multiplyScalar(1 / (pi.mass + pj.mass));
          larger_particle.mass += smaller_particle.mass;
        }
      }
    }
  }

  updateForces() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        let pi = this.particles[i];
        let pj = this.particles[j];
        let ri = pi.position;
        let rj = pj.position;
        // Calculate force between particles
        let radius = ri.subtractVectors(rj);
        let force_magnitude = -1 * pi.mass * pj.mass * GRAVITATIONAL_CONSTANT * Math.pow(radius.magnitude(), 3);
        let force = radius.multiplyScalar(force_magnitude);
        // Update
        pi.force = pi.force.addVectors(force);
        pj.force = pj.force.addVectors(force.multiplyScalar(-1));
      }
    }
  }

  setCamera(frame) {
    //if ((frame % TARGET_FPS) * 5 != 0) {
    //return;
    //}
    var totalMass = 0;
    var netPos = new Vector(0, 0);
    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      totalMass += particle.mass;
      netPos.addVectorMut(particle.position.multiplyScalar(particle.mass));
    }
    netPos = netPos.multiplyScalar(1 / totalMass);
    // Find with respect to the center of the screen
    netPos = netPos.subtractVectors(new Vector(SCREEN_X / 2, SCREEN_Y / 2));
    // Update camera
    let diff = netPos.subtractVectors(this.camera);
    this.camera = this.camera.addVectors(diff.multiplyScalar(0.05));
  }

  moveParticles(timestep) {
    // Don't move mouse particle, so only go to num particles
    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      // Get force and update velocity and position
      let force = particle.force;
      let acceleration = force.multiplyScalar(1 / particle.mass);
      let deltaV = acceleration.multiplyScalar(timestep / 2);
      particle.velocity = particle.velocity.addVectors(deltaV);
      let deltaP = particle.velocity.multiplyScalar(timestep);
      particle.position = particle.position.addVectors(deltaP);

      // Wrap around side
      if (WRAP_AROUND) {
        if (particle.position.x < 0) {
          particle.position.x += SCREEN_X;
        }
        if (particle.position.x > SCREEN_X) {
          particle.position.x -= SCREEN_X;
        }
        if (particle.position.y < 0) {
          particle.position.y += SCREEN_Y;
        }
        if (particle.position.y > SCREEN_Y) {
          particle.position.y -= SCREEN_Y;
        }
      }
      // Add to previous positions
      particle.addPosition();
      // Keep velocities under control
      if (particle.velocity.magnitude() > MAX_VELOCITY) {
        particle.velocity = particle.velocity.multiplyScalar(MAX_VELOCITY / particle.velocity.magnitude());
      }
    }
  }

  /**
   * Updates each particle's velocity and position based on its current force
   */
  step(timestep, frame) {
    this.updateForces();
    this.moveParticles(timestep);
    this.handleCollisions();
    this.setCamera(frame);
  }
}

class Drawer {
  drawArrow(context, fromx, fromy, tox, toy, arrowSize, style) {
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.strokeStyle = style;
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - arrowSize * Math.cos(angle - Math.PI / 6), toy - arrowSize * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - arrowSize * Math.cos(angle + Math.PI / 6), toy - arrowSize * Math.sin(angle + Math.PI / 6));
    context.stroke();
  }

  drawPath(context, particle, particleSize, fillStyle, camera) {
    for (let i = 0; i < particle.previousPos.length - 1; i++) {
      let position = particle.previousPos[i].subtractVectors(camera);
      let position2 = particle.previousPos[i + 1].subtractVectors(camera);
      // Don't draw inside the particle itself
      if (position.distance(particle.position.subtractVectors(camera)) < particleSize) continue;
      // Don't draw across the screen
      if (Math.abs(position.x - position2.x) > SCREEN_X / 3) continue;
      if (Math.abs(position.y - position2.y) > SCREEN_Y / 3) continue;
      context.globalAlpha = i / particle.previousPos.length;
      context.strokeStyle = fillStyle;
      context.fillStyle = fillStyle;
      context.beginPath();
      context.moveTo(position.x, position.y);
      context.lineTo(position2.x, position2.y);
      context.stroke();
      context.fill();
    }
  }

  drawParticles(particles, camera) {
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        // Particle attributes
        let particle = particles[i];
        let x = particle.position.x - camera.x;
        let y = particle.position.y - camera.y;
        let particleSize = particle.getSize();
        // Set color and draw particle circle
        ctx.fillStyle = particle.color;
        ctx.strokeStyle = "black";
        // Particles who keep phasing in and out don't draw
        if (WRAP_AROUND) {
          if (x < 5 || x > SCREEN_X - 5) continue;
          if (y < 5 || y > SCREEN_Y - 5) continue;
        }
        // Draw circle

        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, 2 * Math.PI, true);
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.globalAlpha = 0.55;
        ctx.fill();

        // Draw arrow of direction
        // let vx = particle.velocity.x;
        // let vy = particle.velocity.y;
        // let theta = Math.atan2(vy, vx);
        // let endx = x + Math.cos(theta);
        // let endy = y + Math.sin(theta);
        // this.drawArrow(ctx, x, y, endx, endy, 5, "black");

        // Draw trail
        this.drawPath(ctx, particle, particleSize, particle.color, camera);
      }
    }
  }
}

let simulation = new NBody(NUM_PARTICLES);
let drawer = new Drawer(NUM_PARTICLES);
// let mouseParticle = new Particle(MOUSE_PARTICLE_MASS, 0, 0);
// function moveMouse(e) {
//   mouseParticle.position.x = e.clientX;
//   mouseParticle.position.y = e.clientY;
// }
// simulation.particles.push(mouseParticle);
// document.addEventListener("mousemove", moveMouse);
var frame = 0;
var intervalId = window.setInterval(function () {
  simulation.step(TIME_STEP, frame);
  drawer.drawParticles(simulation.particles, simulation.camera);
  frame += 1;
}, 1000 / TARGET_FPS);

function resize() {
  var canvas = document.getElementById("nBodyCanvas");
  SCREEN_X = canvas.clientWidth;
  SCREEN_Y = canvas.clientHeight;
  canvas.width = SCREEN_X;
  canvas.height = SCREEN_Y;
}

window.onresize = resize;
