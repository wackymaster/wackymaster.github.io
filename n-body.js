let GRAVITATIONAL_CONSTANT = 6.67 * Math.pow(10, -11);
let NUM_PARTICLES = 20;
let TIME_STEP = .1;
let TARGET_FPS = 30;
let MAX_VELOCITY = 10;
let PARTICLE_SIZE = 10;
let PARTICLE_MAX_MASS = 1;


var canvas = document.getElementById("nBodyCanvas");
let SCREEN_X = canvas.clientWidth;
let SCREEN_Y = canvas.clientHeight;
canvas.width = SCREEN_X;
canvas.height = SCREEN_Y;



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
  subtractVectors(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2), Math.pow(this.y, 2));
  }
}

class Particle {
  constructor(mass, x, y) {
    this.mass = mass;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.force = new Vector(0, 0);
  }
}

class NBody {
  constructor(n) {
    this.particles = [];
    for (let i = 0; i < n; i++) {
      let randomParticle = new Particle(Math.random() * 2 * PARTICLE_MAX_MASS - PARTICLE_MAX_MASS,
        Math.random() * SCREEN_X, Math.random() * SCREEN_Y);
      this.particles.push(randomParticle);
    }
  }

  updateForces() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        let ri = this.particles[i].position;
        let rj = this.particles[j].position;
        // Calculate force between particles
        let radius = ri.subtractVectors(rj);
        let force_magnitude = -1 * GRAVITATIONAL_CONSTANT * Math.pow(radius.magnitude(), 3);
        let force = radius.multiplyScalar(force_magnitude);
        // Update
        this.particles[i].force = force;
        this.particles[j].force = force.multiplyScalar(-1);
      }
    }
  }

  moveParticles(timestep) {
    // Don't move mouse particle, so only go to num particles
    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      // Get force and update velocity and position
      let force = particle.force;
      let acceleration = force.multiplyScalar(particle.mass);
      let deltaV = acceleration.multiplyScalar(timestep);
      particle.velocity = particle.velocity.addVectors(deltaV);
      let deltaP = particle.velocity.multiplyScalar(timestep);
      particle.position = particle.position.addVectors(deltaP);

      // Wrap around side
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

      // Keep velocities under control
      if (particle.velocity.magnitude() > MAX_VELOCITY) {
        particle.velocity = particle.velocity.multiplyScalar(MAX_VELOCITY / particle.velocity.magnitude())
      }
    }
  }

  /**
   * Updates each particle's velocity and position based on its current force
   */
  step(timestep) {
    this.updateForces();
    this.moveParticles(timestep)
  }
}


class Drawer {
  constructor(n) {
    this.colors = [];
    for (let i = 0; i < n; i++) {
      var randomColor = '#' + ((1 << 24) * Math.random() | 0).toString();
      this.colors.push(randomColor);
    }
  }

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

  drawParticles(particles) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      // Turn transparency on
      ctx.globalAlpha = 0.75;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        let x = particle.position.x;
        let y = particle.position.y;
        let particleSize = 10 + Math.abs(particle.mass) * PARTICLE_SIZE

        // Particles who keep phasing in and out don't draw
        if (x < 5 || x > SCREEN_X - 5) continue;
        if (y < 5 || y > SCREEN_Y - 5) continue;
        // Set color and draw particle circle
        ctx.fillStyle = this.colors[i];
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.fill();

        // Draw arrow of direction
        let vx = particle.velocity.x;
        let vy = particle.velocity.y;
        let endx = x + vx;
        let endy = y + vy;
        this.drawArrow(ctx, x, y, endx, endy, particle.velocity.magnitude(), "black");
      }
    }
  }
}


let simulation = new NBody(NUM_PARTICLES);
let drawer = new Drawer(NUM_PARTICLES);


var intervalId = window.setInterval(function () {
  simulation.step(TIME_STEP);
  drawer.drawParticles(simulation.particles);

}, 1000 / TARGET_FPS);