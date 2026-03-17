// src/utils/sm2.ts

/**
 * Algoritmo SM-2 (SuperMemo 2) implementado como Anki
 * Quality: 0 (Otra vez), 1 (Difícil), 2 (Bien), 3 (Fácil)
 */
export function calculateSM2(quality: number, repetitions: number, easiness: number, interval: number) {
  let newEasiness = easiness + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
  if (newEasiness < 1.3) newEasiness = 1.3;

  let newInterval = 0;
  let newRepetitions = repetitions;

  if (quality < 2) { // 0 o 1 (Falló o muy difícil)
    newRepetitions = 0;
    newInterval = 1; // Revisar mañana (o en minutos dependiendo tu enfoque)
  } else {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easiness);
    }
    newRepetitions++;
  }

  // Calcular la próxima fecha de revisión
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easinessFactor: newEasiness,
    nextReviewDate
  };
}