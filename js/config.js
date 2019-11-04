class config {
  constructor() {
    this.integrator = "yoshida";
    this.simulation = "solar system";
    this.trail = true;
  }
  changeSim(sim) {
    if (sim == "solar system") {
      G = 6.67428e-11;
      meterPerPixel = AU/2;
      this.changeStep(24*3600);
      this.simulation = sim;
    } else if (sim == "fig8") {
      G = 1;
      meterPerPixel = 1/200;
      this.changeStep(0.01);
      this.simulation = sim;
    } else if (sim == "coreo1") {
      G = 6.67428e-11;
      meterPerPixel = AU/2;
      this.changeStep(24*3600);
      this.simulation = sim;
    } else if (sim == "coreo2") {
      G = 1;
      meterPerPixel = 1/100;
      this.changeStep(0.01);
      this.simulation = sim;
    }
    else if (sim == "coreo3") {
      G = 1;
      meterPerPixel = 1/100;
      this.changeStep(0.01);
      this.simulation = sim;
    } else if (sim == "l5") {
      G = 6.67428e-11;
      meterPerPixel = 2*AU;
      this.changeStep(48*3600);
      this.simulation = sim;
    } else if (sim == "i_circles") {
      G = 1;
      meterPerPixel = 1/100;
      this.changeStep(0.01);
      this.simulation = sim;
    }
  }
  changeStep(newh) {
    h = newh
  }
}
