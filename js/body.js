
function mass_center(bodies) {
  this.r_x = 0;
  this.r_y = 0;
  this.plot_x = 0;
  this.plot_y = 0;
  this.mass = 0;

  this.set_CM = function() {
    temp_x = 0;
    temp_y = 0;
    temp_m = 0;
    for(var i = 0; i < bodies.length; i++) {
      temp_x += bodies[i].mass*bodies[i].r_x;
      temp_y += bodies[i].mass*bodies[i].r_y;
      temp_m += bodies[i].mass;
    }
    this.r_x = temp_x/temp_m;
    this.r_y = temp_y/temp_m;
    this.plot_x = graphics.set_rx(this.r_x);
    this.plot_y = graphics.set_ry(this.r_y);
    graphics.drawCM(this.plot_x, this.plot_y);
  }
}

class body {
  constructor(mass, r_x, r_y, v_x, v_y, ra,color, name) {
    this.mass = mass; // mass of the planet
    this.r_x0 = r_x;
    this.r_y0 = r_y;
    this.r_x = this.r_x0;
    this.r_y = this.r_y0;
    this.plot_x = graphics.set_rx(r_x);
    this.plot_y = graphics.set_ry(r_y);
    this.lastpos_x = [this.plot_x];
    this.lastpos_y = [this.plot_y];
    this.v_x = v_x;
    this.v_y = v_y;
    this.ra = ra;
    this.color = color;
    this.name = name;
  }
}
