export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  easeFactor: number;
  interval: number;
  lapses: number;
}

export function calculateNextReview(
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  previousInterval: number,
  previousEaseFactor: number,
  previousLapses: number = 0
): ReviewResult {
  let easeFactor = previousEaseFactor;
  let interval = previousInterval;
  let lapses = previousLapses;

  // Clamp quality to valid range
  quality = Math.max(0, Math.min(5, quality));

  // 🔁 Update ease factor (SuperMemo 2 formula)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, Math.min(2.5, easeFactor)); // clamp between 1.3 and 2.5

  // 📆 Calculate next interval
  if (quality < 3) {
    interval = 1;
    lapses += 1;
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
    lapses,
  };
}
