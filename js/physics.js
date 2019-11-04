function physics() {
  this.acceleration_x = function(body_1x, body_1y, body_2, i, j) {
    if (i == j) {
      return 0;
    }
    else {
      return (body_2.r_x-body_1x) * G * body_2.mass / Math.sqrt((body_1x - body_2.r_x)**2 + (body_1y - body_2.r_y)**2)**3;
    }
  }

  this.acceleration_y = function(body_1x, body_1y, body_2, i, j) {
    if (i == j) {
      return 0;
    }
    else {
      return (body_2.r_y-body_1y) * G * body_2.mass / Math.sqrt((body_1x - body_2.r_x)**2 + (body_1y - body_2.r_y)**2)**3;
    }
  }


  this.verlet = function(bodies, step) {
    var pos_x = [];
    var pos_y = [];
    var vel_x = [];
    var vel_y = [];
    var acc_x = [];
    var acc_y = [];
    for (i = 0; i < bodies.length; i++) {
      var a_x = 0;
      var a_y = 0;
      for (j = 0; j < bodies.length; j++) {
        a_x += this.acceleration_x(bodies[i].r_x, bodies[i].r_y, bodies[j], i, j);
        a_y += this.acceleration_y(bodies[i].r_x, bodies[i].r_y, bodies[j], i, j);
      }

      var new_x = bodies[i].r_x + bodies[i].v_x * step + 0.5 * a_x * step**2;
      var new_y = bodies[i].r_y + bodies[i].v_y * step + 0.5 * a_y * step**2;

      // pos_x.push(this.bodies[i].r_x + this.step*this.bodies[i].v_x + this.step*this.step*a_x/2);
      pos_x.push(new_x);
      pos_y.push(new_y);
      acc_x.push(a_x);
      acc_y.push(a_y);
    }
    for (i = 0; i < bodies.length; i++) {
      var ax_new = 0;
      var ay_new = 0;
      for (var j = 0; j < bodies.length; j++) {
        ax_new += this.acceleration_x(pos_x[i], pos_y[i], bodies[j], i, j);
        ay_new += this.acceleration_y(pos_x[i], pos_y[i], bodies[j], i, j);
      }
      new_vx = bodies[i].v_x + 0.5*(acc_x[i] + ax_new)*step;
      new_vy = bodies[i].v_y + 0.5*(acc_y[i] + ay_new)*step;
      vel_x.push(new_vx);
      vel_y.push(new_vy);
    }
    for (i = 0; i < bodies.length; i++) {
      // x coordinate
      bodies[i].r_x = pos_x[i];
      bodies[i].lastpos_x = bodies[i].plot_x;
      bodies[i].plot_x = graphics.set_rx(bodies[i].r_x);

      // y coordinate
      bodies[i].r_y = pos_y[i];
      bodies[i].lastpos_y = bodies[i].plot_y;
      bodies[i].plot_y = graphics.set_ry(bodies[i].r_y);

      // velocities
      bodies[i].v_x = vel_x[i];
      bodies[i].v_y = vel_y[i];
      // console.log(.bodies[i].r_x + ' - ' + this.bodies[i].r_y + ' \n ' + this.bodies[i].plot_x + ' - ' + this.bodies[i].plot_y);
     }
     graphics.drawBody(bodies);
     graphics.drawOrbitalLines(bodies);
  } // End verlet

  // Yoshida Leapfrog

  this.yoshida = function(bodies, step) {
    var pos_x = [];
    var pos_y = [];
    var vel_x = [];
    var vel_y = [];

    w = 1.2599210498948732; // 2**(1./3.)
    f = 0.7400789501051268; // 2 - w

    lf1 = (0.5 * step / f);
    lf2 = step / f;
    lf3 = (1-w) * step * 0.5 / f;
    lf4 = -step * w / f;
    for ( i = 0; i < bodies.length; i++) {
        p1_x = bodies[i].r_x + lf1 * bodies[i].v_x;
        p1_y = bodies[i].r_y + lf1 * bodies[i].v_y;
        // alert(p1_x);
        ax_new1 = 0;
        ay_new1 = 0;
        for (j = 0; j < bodies.length; j++){
          ax_new1 += this.acceleration_x(p1_x, p1_y, bodies[j], i, j);
          ay_new1 += this.acceleration_y(p1_x, p1_y, bodies[j], i, j);
        }
        v2_x = bodies[i].v_x + lf2 * ax_new1;
        v2_y = bodies[i].v_y + lf2 * ay_new1;

        p3_x = p1_x + lf3 * v2_x;
        p3_y = p1_y + lf3 * v2_y;

        ax_new2 = 0;
        ay_new2 = 0;
        for (j = 0; j < bodies.length; j++){
          ax_new2 += this.acceleration_x(p3_x, p3_y, bodies[j], i, j);
          ay_new2 += this.acceleration_y(p3_x, p3_y, bodies[j], i, j);
        }

        v4_x = v2_x + lf4 * ax_new2;
        v4_y = v2_y + lf4 * ay_new2;

        p5_x = p3_x  + lf3 * v4_x;
        p5_y = p3_y + lf3 * v4_y;

        ax_new3 = 0;
        ay_new3 = 0;
        for (j = 0; j < bodies.length; j++){
          ax_new3 += this.acceleration_x(p5_x, p5_y, bodies[j], i, j);
          ay_new3 += this.acceleration_y(p5_x, p5_y, bodies[j], i, j);
        }

        v6_x = v4_x + lf2 * ax_new3;
        v6_y = v4_y + lf2 * ay_new3;

        p7_x = p5_x + lf1 * v6_x;
        p7_y = p5_y + lf1 * v6_y;

        pos_x.push(p7_x);
        pos_y.push(p7_y);
        vel_x.push(v6_x);
        vel_y.push(v6_y);
    }
    for (i = 0; i < bodies.length; i++) {
      // x coordinate
      bodies[i].r_x = pos_x[i];
      bodies[i].lastpos_x.push(bodies[i].plot_x);
      bodies[i].plot_x = graphics.set_rx(bodies[i].r_x);
      bodies[i].plot_y = graphics.set_ry(bodies[i].r_y);
      //console.log(bodies[i].name +' - '+ bodies[i].r_x/bodies[i].r_x0 );
      // y coordinate
      bodies[i].r_y = pos_y[i];
      if (conf.trail == true) {
        bodies[i].lastpos_y.push(bodies[i].plot_y);

        if(conf.simulation == "solar system") {
          if (bodies[i].r_x/bodies[i].r_x0 > .99 && bodies[i].r_y/bodies[i].r_y0 > .99) {
            bodies[i].lastpos_y = [bodies[i].plot_x]//.splice(0, bodies[i].lastpos_x.length);
            bodies[i].lastpos_x = [bodies[i].plot_y]//.splice(0, bodies[i].lastpos_y.length);
          } else if (bodies[i].lastpos_x.length > 700){
            bodies[i].lastpos_x.splice(0, 20);
            bodies[i].lastpos_y.splice(0, 20);
          }
        }
        
        if (bodies[i].lastpos_x.length > 600){
          bodies[i].lastpos_x.splice(0, 20);
          bodies[i].lastpos_y.splice(0, 20);
        }

      } else {
        bodies[i].lastpos_x = [bodies[i].plot_x];
        bodies[i].lastpos_y = [bodies[i].plot_y];
      }

      // velocities
      bodies[i].v_x = vel_x[i];
      bodies[i].v_y = vel_y[i];
      //console.log(bodies[i].r_x + ' - ' + bodies[i].r_y + ' \n ' + bodies[i].plot_x + ' - ' + bodies[i].plot_y);
     }
      graphics.drawBody(bodies);
      graphics.drawOrbitalLines(bodies);
  }

  this.resetPhysics = function(bodies) {
    var pos_x = [];
    var pos_y = [];
    var vel_x = [];
    var vel_y = [];
    var acc_x = [];
    var acc_y = [];
    for(i = 0; i < to_simulate.length; i++){
        bodies[i] = null;
    }
    bodies = null;
    to_simulate = null;
  }
}
