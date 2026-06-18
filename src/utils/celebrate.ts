import confetti from 'canvas-confetti';

/** A short, two-sided confetti burst — fired when a task reaches Done. */
export const celebrate = (): void => {
  const defaults = {
    spread: 60,
    ticks: 200,
    gravity: 0.9,
    colors: ['#3dd68c', '#aef9d0', '#2bb673', '#e7e9ee'],
  };

  confetti({ ...defaults, particleCount: 70, origin: { x: 0.2, y: 0.7 } });
  confetti({ ...defaults, particleCount: 70, origin: { x: 0.8, y: 0.7 } });
};
