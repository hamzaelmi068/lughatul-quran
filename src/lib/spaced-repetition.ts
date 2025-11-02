export interface ReviewResult {
  easeFactor: number;
  interval: number;
  nextReview: Date;
}

export function calculateNextReview(
  quality: 0 | 1 | 2 | 3,
  previousInterval: number,
  previousEaseFactor: number
): ReviewResult {
  let easeFactor = previousEaseFactor;
  let interval = previousInterval;

  // Update ease factor (SuperMemo 2)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
  );

  if (quality === 0) {
    interval = 1; // Reset
  } else if (interval === 0) {
    interval = 1;
  } else if (interval === 1) {
    interval = 6;
  } else {
    interval = Math.round(interval * easeFactor);
  }

  const nextReview = new Date(Date.now() + interval * 86400000);

  return {
    easeFactor,
    interval,
    nextReview,
  };
}

