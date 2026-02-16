import { MATH } from '../constants';

export interface Question {
  text: string;
  options: number[];
  correctIndex: number; // 0-3
}

export class MathQuestionSystem {
  currentQuestion: Question | null = null;
  wrongAttempts = 0;
  lockoutTimer = 0;       // ms remaining on lockout
  totalQuestions = 0;
  totalCorrectFirstTry = 0;

  reset() {
    this.currentQuestion = null;
    this.wrongAttempts = 0;
    this.lockoutTimer = 0;
    this.totalQuestions = 0;
    this.totalCorrectFirstTry = 0;
  }

  generate(score: number) {
    this.currentQuestion = generateQuestion(score);
    this.wrongAttempts = 0;
    this.lockoutTimer = 0;
    this.totalQuestions++;
  }

  updateLockout(dtMs: number) {
    if (this.lockoutTimer > 0) {
      this.lockoutTimer -= dtMs;
      if (this.lockoutTimer < 0) this.lockoutTimer = 0;
    }
  }

  tryAnswer(index: number): 'correct' | 'wrong' | 'locked' {
    if (!this.currentQuestion) return 'locked';
    if (this.lockoutTimer > 0) return 'locked';

    if (index === this.currentQuestion.correctIndex) {
      if (this.wrongAttempts === 0) this.totalCorrectFirstTry++;
      this.currentQuestion = null;
      return 'correct';
    } else {
      this.wrongAttempts++;
      this.lockoutTimer = MATH.WRONG_ANSWER_LOCKOUT;
      return 'wrong';
    }
  }

  get isActive(): boolean {
    return this.currentQuestion !== null;
  }

  get accuracy(): number {
    if (this.totalQuestions === 0) return 100;
    return Math.round((this.totalCorrectFirstTry / this.totalQuestions) * 100);
  }
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(score: number): Question {
  let a: number, b: number, answer: number, text: string;

  if (score < 5) {
    // Tier 1: add/sub, operands 1-10
    a = randInt(1, 10);
    b = randInt(1, 10);
    if (Math.random() < 0.5) {
      answer = a + b;
      text = `${a} + ${b} = ?`;
    } else {
      if (a < b) [a, b] = [b, a]; // ensure positive result
      answer = a - b;
      text = `${a} - ${b} = ?`;
    }
  } else if (score < 10) {
    // Tier 2: add mult, operands 1-12
    const op = Math.random();
    a = randInt(1, 12);
    b = randInt(1, 12);
    if (op < 0.33) {
      answer = a + b;
      text = `${a} + ${b} = ?`;
    } else if (op < 0.66) {
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      text = `${a} - ${b} = ?`;
    } else {
      answer = a * b;
      text = `${a} × ${b} = ?`;
    }
  } else if (score < 20) {
    // Tier 3: larger operands
    const op = Math.random();
    if (op < 0.4) {
      a = randInt(5, 25);
      b = randInt(5, 25);
      if (Math.random() < 0.5) {
        answer = a + b;
        text = `${a} + ${b} = ?`;
      } else {
        if (a < b) [a, b] = [b, a];
        answer = a - b;
        text = `${a} - ${b} = ?`;
      }
    } else {
      a = randInt(2, 12);
      b = randInt(2, 12);
      answer = a * b;
      text = `${a} × ${b} = ?`;
    }
  } else {
    // Tier 4: two-step problems
    a = randInt(2, 9);
    b = randInt(2, 9);
    const c = randInt(1, 10);
    const op = Math.random();
    if (op < 0.5) {
      answer = a * b + c;
      text = `${a} × ${b} + ${c} = ?`;
    } else {
      answer = a * b - c;
      text = `${a} × ${b} - ${c} = ?`;
    }
  }

  const options = generateDistractors(answer);
  const correctIndex = options.indexOf(answer);

  return { text, options, correctIndex };
}

function generateDistractors(correct: number): number[] {
  const distractors = new Set<number>();
  distractors.add(correct);

  // Near-miss: +/-1
  distractors.add(correct + 1);
  distractors.add(correct - 1);

  // Offset: +/-2 to 5
  while (distractors.size < 6) {
    const offset = randInt(2, 5) * (Math.random() < 0.5 ? 1 : -1);
    distractors.add(correct + offset);
  }

  // Pick 3 distractors (not the correct answer)
  const pool = Array.from(distractors).filter(d => d !== correct);
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected = pool.slice(0, 3);
  selected.push(correct);

  // Shuffle final options
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}
