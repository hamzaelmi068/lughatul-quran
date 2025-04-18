export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  easeFactor: number;
  interval: number;
}

export function calculateNextReview(quality: 0 | 1 | 2 | 3 | 4 | 5, previousInterval: number, previousEaseFactor: number): ReviewResult {
  // Implementation of SuperMemo 2 algorithm
  let easeFactor = previousEaseFactor;
  let interval = previousInterval;

  // Update ease factor based on quality of response
  easeFactor = Math.max(
    1.3,
    previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next interval
  if (quality < 3) {
    interval = 1; // Reset interval for poor responses
  } else if (interval === 0) {
    interval = 1;
  } else if (interval === 1) {
    interval = 6;
  } else {
    interval = Math.round(interval * easeFactor);
  }

  return {
    quality,
    easeFactor,
    interval,
  };
}