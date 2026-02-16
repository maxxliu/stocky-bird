export class Gate {
  x = 0;
  gapCenterY = 0;
  gapSize = 160;
  priceResistance = 0;    // Top price label
  priceSupport = 0;       // Bottom price label
  passed = false;         // Player has crossed this gate
  questionAnswered = false; // Math question for this gate is answered
  active = false;         // Whether this gate is in use

  get gapTop() {
    return this.gapCenterY - this.gapSize / 2;
  }

  get gapBottom() {
    return this.gapCenterY + this.gapSize / 2;
  }

  init(x: number, gapCenterY: number, gapSize: number, priceBase: number) {
    this.x = x;
    this.gapCenterY = gapCenterY;
    this.gapSize = gapSize;
    this.priceResistance = priceBase + (gapSize / 2) * 0.1;
    this.priceSupport = priceBase - (gapSize / 2) * 0.1;
    this.passed = false;
    this.questionAnswered = false;
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
