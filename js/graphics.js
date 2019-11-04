
class graphics {
  constructor() { 
    this.meterPerPixel = AU/2;
    // Routine to plot the planets
    this.drawBody = function(bodies){
      for(i = 0; i < bodies.length; i++) {
        context.beginPath();
        context.arc(bodies[i].plot_x, bodies[i].plot_y, bodies[i].ra,0,Math.PI*2, false);
        context.fillStyle = bodies[i].color;
        context.fill();
      }
    };

    // Routine to plot trail
    this.drawOrbitalLines = function(bodies) {
      for (i = 0; i < bodies.length; i++) {
        for(j = 10; j < bodies[i].lastpos_x.length; j++) {
          context.beginPath();
          context.strokeStyle = bodies[i].color;
          context.moveTo(bodies[i].lastpos_x[j-1], bodies[i].lastpos_y[j-1]);
          context.lineTo(bodies[i].lastpos_x[j], bodies[i].lastpos_y[j]);
          context.stroke();
        }
      }
    }

    // Routine to plot CM
    this.drawCM = function(x, y) {
      context.beginPath();
      context.strokeStyle = 'DeepPink';
      context.moveTo(x, y);
      context.lineTo(x + 5, y);
      context.lineTo(x - 5, y);
      context.moveTo(x, y);
      context.lineTo(x, y+5);
      context.lineTo(x, y-5);
      context.stroke();
    }
    // Routine to set-up the UI information
    this.set_UI = function(body_count, cm_x, cm_y) {
      var body_counter = document.getElementById('body_counter');
      body_counter.innerHTML = body_count;
    
      var cm_posx = document.getElementById('cm_posx');
      var cm_posy = document.getElementById('cm_posy');
      cm_posx.innerHTML = cm_x;
      cm_posy.innerHTML = cm_y;
    }

    // Linear Transformation for plotting coordinates
    this.set_rx = function(x) {
      return x/meterPerPixel + 0.5*canvas.width;
    }
    
    this.set_ry = function(y) {
      return y/meterPerPixel + 0.5*canvas.height;
    }
  }
}

