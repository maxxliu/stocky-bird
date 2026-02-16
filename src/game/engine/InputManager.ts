export class InputManager {
  flapPressed = false;
  answerPressed: number = 0; // 0 = none, 1-4 = answer key

  private _flapConsumed = false;
  private _answerConsumed = false;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundTouchStart: (e: TouchEvent) => void;

  // Touch answer regions (set by renderer)
  answerRegions: { x: number; y: number; w: number; h: number }[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);

    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    canvas.addEventListener('mousedown', this.boundMouseDown);
    canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (!this._flapConsumed) {
        this.flapPressed = true;
      }
    }
    if (e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      if (!this._answerConsumed) {
        this.answerPressed = parseInt(e.key);
      }
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      this._flapConsumed = false;
    }
    if (e.key >= '1' && e.key <= '4') {
      this._answerConsumed = false;
    }
  }

  private onMouseDown(e: MouseEvent) {
    e.preventDefault();
    // Check if click is on answer region
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const answer = this.hitTestAnswer(x, y);
    if (answer > 0) {
      this.answerPressed = answer;
    } else {
      this.flapPressed = true;
    }
  }

  private onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const answer = this.hitTestAnswer(x, y);
    if (answer > 0) {
      this.answerPressed = answer;
    } else {
      this.flapPressed = true;
    }
  }

  private hitTestAnswer(x: number, y: number): number {
    for (let i = 0; i < this.answerRegions.length; i++) {
      const r = this.answerRegions[i];
      if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
        return i + 1;
      }
    }
    return 0;
  }

  consumeFlap(): boolean {
    if (this.flapPressed) {
      this.flapPressed = false;
      this._flapConsumed = true;
      return true;
    }
    return false;
  }

  consumeAnswer(): number {
    if (this.answerPressed > 0) {
      const val = this.answerPressed;
      this.answerPressed = 0;
      this._answerConsumed = true;
      return val;
    }
    return 0;
  }

  destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas.removeEventListener('touchstart', this.boundTouchStart);
  }
}
