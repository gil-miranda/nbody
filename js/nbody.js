////////////// N-Body problem simulator with Simpletic Velocity-Verlet and 4th order Yoshida Integrator
//////// Author: Gil Miranda
//////// Contact: gilsmneto@gmail.com; gil.neto@ufrj.br
////////////// Last Update: 04/11/2019
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
warning = $(".warning");

var G = 6.67428e-11;
var AU = 149.6e7;
var meterPerPixel = AU/2;
h = 24*3600;
var i, j;

conf = new config();
graphics = new graphics();
physics = new physics();

/// Initial conditions for each simulation
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
  } else if(sim == "coreo2") {
    sim_3_ball1 = new body(1, 0, 0, -2*0.080584, -2*0.588836, 5, 'green');
    sim_3_ball2 = new body(1, -1, -0.5, 0.080584, 0.588836, 5, 'gold');
    sim_3_ball3 = new body(1, 1, 0.5, 0.080584, 0.588836, 5,'red');
    bodies = [sim_3_ball1, sim_3_ball2, sim_3_ball3];
  } else if(sim == "coreo3") {
    p1x = 0.557809;
    p1y = 0.451774;
    sim_4_ball1 = new body(1, 0, 0, -2*p1x, -2*p1y, 5, 'green');
    sim_4_ball2 = new body(1, -1, 0, p1x, p1y, 5, 'gold');
    sim_4_ball3 = new body(1, 1, 0, p1x, p1y, 5,'red');
    bodies = [sim_4_ball1, sim_4_ball2, sim_4_ball3];
  } else if(sim == "l5") {
    sim_5_ball1 = new body(1.98855e30, 0, 0, 0, 0, 15, 'pink');
    sim_5_ball2 = new body(5.972e24, 5.01847e11, -5.57358e11, 13e3, 2.765e3, 5, 'magenta');
    sim_5_ball3 = new body(1.898e28, 7.78e11, 0, 0, 13.1e3, 5,'cyan');
    bodies = [sim_5_ball1, sim_5_ball2, sim_5_ball3];
  } else if(sim == "i_circles") {
    sim_6_ball1 = new body(1, 1, 0, 0, .55, 5, 'pink');
    sim_6_ball2 = new body(1, -0.5, 0.8660254037844386, -0.47631397208144133, -0.27499999999999986, 5, 'magenta');
    sim_6_ball3 = new body(1, -0.5, -0.8660254037844386, 0.47631397208144133, -0.27499999999999986, 5,'cyan');
    bodies = [sim_6_ball1, sim_6_ball2, sim_6_ball3];
  }
  else { // Solar System
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

sim_switcher = $('.sim_switcher');
sim_switcher.click(function(){
  var this_id = $(this).attr("title");
  sim_switcher.removeClass('active');
  $(this).toggleClass('active');
  conf.changeSim(this_id);
  physics.resetPhysics(bodies);
  simulate(this_id);
  animate();
});

pause_btn = $('.btn_pause');
trail_btn = $('.btn_trail');

pause_btn.click(function(){
  if($(this).text() == "Pause") {
    $(this).text("Resume");
  } else {
    $(this).text("Pause");
  }
  if (pause == 0) {
    pause = 1;
    warning.toggle();
    $(".w_pause").css("display","block");
  }
  else {
    pause = 0;
    warning.toggle();
    $(".w_pause").css("display","none");
    animate();
  }
});

trail_btn.click(function() {
  if($(this).text() == "Trail Off") {
    $(this).text("Trail On");
  } else {
    $(this).text("Trail Off");
  }
  conf.trail = (conf.trail == true) ? false : true;
});

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
    if(pause_btn.text() == "Pause") {
      pause_btn.text("Resume");
    } else {
      pause_btn.text("Pause");
    }
      if (pause == 0) {
        pause = 1;
        warning.toggle();
        $(".w_pause").css("display","block");
      }
      else {
        pause = 0;
        warning.toggle();
        $(".w_pause").css("display","none");
        animate();
      }
  }
  if(e.keyCode == 27) {
    conf.trail = (conf.trail == true) ? false : true;
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
      graphics.set_UI(to_simulate.length, parseInt(cm.plot_x - canvas.width*0.5), parseInt(cm.plot_y- canvas.height*0.5));
      graphics.drawOrbitalLines(to_simulate);
    }
}
animate();
