////////////// N-Body problem simulator with Simpletic Velocity-Verlet Integrator
//////// Author: Gil Miranda
//////// Contact: gilsmneto@gmail.com; gil.neto@ufrj.br
////////////// Last Update: 02/11/2019
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var G = 6.67428e-11;
var AU = 149.6e7;
var meterPerPixel = AU/2;
h = 24*3600;
var i, j;

conf = new config();
graphics = new graphics();
physics = new physics();

/// Initial conditions for real solar system simulation
function simulate(sim){
  if (sim == "coreo1"){
    sim_1_ball1 = new body(1, 80e9, 0, -15e3, 15e3, 7, 'green');
    sim_1_ball2 = new body(1, -90e9, 0,15e3, -15e3, 7, 'gold');
    sim_1_ball3 = new body(5e29, 0, 0, 0, 0, 15, 'red');
    bodies = [sim_1_ball1, sim_1_ball2, sim_1_ball3];
  } else if (sim == "fig8"){
    sim_2_ball1 = new body(1, 0, 0, 0.93240737,0.86473146, 5, 'green');
    sim_2_ball2 = new body(1, -0.97000436, 0.24308753, -0.93240737/2, -0.86473146/2, 5, 'gold');
    sim_2_ball3 = new body(1, 0.97000436, -0.24308753, -0.93240737/2, -0.86473146/2, 5,'red');
    bodies = [sim_2_ball1, sim_2_ball2, sim_2_ball3];
  }
  else {
    sun = new body(1.98855e30,0,0,0,0,15,'yellow', 'Sun');
    earth = new body(5.9742e24, 147.1e9,0,0,-30.29e3,10,'blue', 'Earth');
    venus = new body(4.8685e24, 107.5e9, 0, 0, -35.26e3, 10, 'salmon', 'Venus');
    mercury = new body(0.3e24, 46e9, 0, 0, -58.98e3, 10, 'darkmagenta', 'Mercury');
    mars = new body(0.642e24, 206.6e9, 0, 0, -26.5e3, 10, 'red', 'Mars');
    jupiter = new body(1.898e27, 740.5e9, 0, 0, -13.72e3, 10, 'orange', 'Jupiter');
    saturn = new body(5.68e26, 1352.6e9, 0, 0, -10.18e3, 10, 'maroon', 'Saturn');
    uranus = new body(8.6e25, 2741.3e9, 0, 0, -7.11e3, 10, 'darkgreen', 'Uranus');
    neptune = new body(1.02e26, 4444.5e9, 0, 0, -5.5e3, 10, 'navy', 'Neptune');
    bodies = [sun, earth, venus, mercury, mars, jupiter, saturn, uranus, neptune];
  }
  to_simulate = bodies;
  cm = new mass_center(to_simulate);
}

pause = 0;

changer_solarsystem = document.getElementById("change_solarsystem");
changer_fig8 = document.getElementById("change_fig8");
changer_coreo1 = document.getElementById("change_coreo1");

changer_solarsystem.onclick = function() {
    conf.changeSim('solar system');
    physics.resetPhysics(bodies);
    simulate("solar system");
    animate();
}

changer_fig8.onclick = function() {
    conf.changeSim('fig8');
    physics.resetPhysics(bodies);
    simulate("fig8");
    animate();
}

changer_coreo1.onclick = function() {
    conf.changeSim('coreo1');
    physics.resetPhysics(bodies);
    simulate("coreo1");
    animate();
}
document.body.onkeyup = function(e){
  if(e.keyCode == 32){
      if (pause == 0) {
        pause = 1;
      }
      else {
        pause = 0;
        animate();
      }
  }
  if(e.keyCode == 13) {
    conf.changeSim('solar system');
    to_simulate = solar_system;
    cm = new mass_center(to_simulate);
    animate();
  }
  if (e.keyCode == 109 || e.keyCode == 173) {
    for (i = 0; i < to_simulate.length; i++){
      to_simulate[i].lastpos_y.splice(0, to_simulate[i].lastpos_y.length);
      to_simulate[i].lastpos_x.splice(0, to_simulate[i].lastpos_x.length);
    }
    meterPerPixel += .5*meterPerPixel;
    canvas.width += .5*window.innerWidth;
    canvas.height += .5*window.innerHeight;
  }
  if (e.keyCode == 107 || e.keyCode == 61) {
    for (i = 0; i < to_simulate.length; i++){
      to_simulate[i].lastpos_y.splice(0, to_simulate[i].lastpos_y.length);
      to_simulate[i].lastpos_x.splice(0, to_simulate[i].lastpos_x.length);
    }
    meterPerPixel -= .5*meterPerPixel;
    canvas.width -= .5*window.innerWidth;
    canvas.height -= .5*window.innerHeight;
  }
}

simulate("solar");
function animate() {
    if (pause == 0) {
      requestAnimationFrame(animate);
      context.clearRect(0,0,canvas.width,canvas.height);
      if (conf.integrator == "yoshida") {
        physics.yoshida(to_simulate, h);
      } else {
        physics.verlet(to_simulate, h);
      }
      cm.set_CM();
      graphics.set_UI(to_simulate.length, parseInt(cm.plot_x), parseInt(cm.plot_y));
      graphics.drawOrbitalLines(to_simulate);
    }
}
animate();
