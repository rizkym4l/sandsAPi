// src/seeds/data/lessons.seed.ts

// Helper: bikin lesson learning untuk sekelompok huruf
function createLearningLesson(levelIndex: number, letters: string[], order: number) {
  return {
    levelIndex, // nanti diganti levelId setelah level dibuat
    type: 'learning',
    title: `Mengenal Huruf ${letters.join(', ')}`,
    description: `Belajar bahasa isyarat untuk huruf ${letters.join(', ')}`,
    content: {
      letters,
      signImages: letters.map((letter) => ({
        letter,
        imageUrl: `/images/signs/${letter}.png`,
        description: `Bahasa isyarat huruf ${letter}`,
      })),
      questions: letters.map((letter) => ({
        questionType: 'image-to-text',
        questionText: `Huruf apa yang ditunjukkan pada gambar ini?`,
        imageUrl: `/images/signs/${letter}.png`,
        correctAnswer: letter,
        options: generateOptions(letter),
        points: 10,
      })),
      challengeWords: [],
    },
    rewards: { xpPoints: 20 },
    order,
    estimatedDuration: 10,
    isCompleted: false,
  };
}

// Helper: bikin lesson quiz untuk sekelompok huruf
function createQuizLesson(levelIndex: number, letters: string[], order: number) {
  return {
    levelIndex,
    type: 'quiz',
    title: `Quiz Huruf ${letters.join(', ')}`,
    description: `Uji kemampuan bahasa isyarat huruf ${letters.join(', ')}`,
    content: {
      letters,
      signImages: [],
      questions: letters.map((letter) => ({
        questionType: 'image-to-text',
        imageUrl: `/images/signs/${letter}.png`,
        correctAnswer: letter,
        options: generateOptions(letter),
        points: 10,
      })),
      challengeWords: [],
    },
    requirements: { minAccuracy: 70, timeLimit: 120 },
    rewards: { xpPoints: 30 },
    order,
    estimatedDuration: 15,
    isCompleted: false,
  };
}

// Helper: bikin lesson practice
function createPracticeLesson(levelIndex: number, letters: string[], order: number) {
  return {
    levelIndex,
    type: 'practice',
    title: `Latihan Huruf ${letters.join(', ')}`,
    description: `Latihan bahasa isyarat huruf ${letters.join(', ')}`,
    content: {
      letters,
      signImages: letters.map((letter) => ({
        letter,
        imageUrl: `/images/signs/${letter}.png`,
        description: `Bahasa isyarat huruf ${letter}`,
      })),
      questions: letters.map((letter) => ({
        questionType: 'multiple-choice',
        imageUrl: `/images/signs/${letter}.png`,
        correctAnswer: letter,
        options: generateOptions(letter),
        points: 10,
      })),
      challengeWords: [],
    },
    rewards: { xpPoints: 25 },
    order,
    estimatedDuration: 15,
    isCompleted: false,
  };
}

// Helper: bikin lesson camera-challenge
function createCameraChallenge(levelIndex: number, letters: string[], words: string[], order: number) {
  return {
    levelIndex,
    type: 'camera-challenge',
    title: `Tantangan Kamera Huruf ${letters.join(', ')}`,
    description: `Peragakan bahasa isyarat untuk kata-kata menggunakan kamera`,
    content: {
      letters,
      signImages: letters.map((letter) => ({
        letter,
        imageUrl: `/images/signs/${letter}.png`,
        description: `Bahasa isyarat huruf ${letter}`,
      })),
      questions: [],
      challengeWords: words,
    },
    requirements: { minAccuracy: 60, timeLimit: 180 },
    rewards: { xpPoints: 40 },
    order,
    estimatedDuration: 20,
    isCompleted: false,
  };
}

// Generate 4 pilihan (1 benar + 3 random)
function generateOptions(correctLetter: string): string[] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const options = [correctLetter];

  while (options.length < 4) {
    const random = alphabet[Math.floor(Math.random() * 26)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  // Acak urutan
  return options.sort(() => Math.random() - 0.5);
}

// Data lessons per level
export const lessonsSeed = [
  // Level 1: A-E
  createLearningLesson(0, ['A', 'B', 'C'], 1),
  createPracticeLesson(0, ['A', 'B', 'C'], 2),
  createLearningLesson(0, ['D', 'E'], 3),
  createPracticeLesson(0, ['D', 'E'], 4),
  createQuizLesson(0, ['A', 'B', 'C', 'D', 'E'], 5),
  createCameraChallenge(0, ['A', 'B', 'C', 'D', 'E'], ['ABA', 'DAD', 'BED'], 6),

  // Level 2: F-J
  createLearningLesson(1, ['F', 'G', 'H'], 1),
  createPracticeLesson(1, ['F', 'G', 'H'], 2),
  createLearningLesson(1, ['I', 'J'], 3),
  createPracticeLesson(1, ['I', 'J'], 4),
  createQuizLesson(1, ['F', 'G', 'H', 'I', 'J'], 5),
  createCameraChallenge(1, ['F', 'G', 'H', 'I', 'J'], ['FIG', 'HI', 'JIG'], 6),

  // Level 3: K-O
  createLearningLesson(2, ['K', 'L', 'M'], 1),
  createPracticeLesson(2, ['K', 'L', 'M'], 2),
  createLearningLesson(2, ['N', 'O'], 3),
  createPracticeLesson(2, ['N', 'O'], 4),
  createQuizLesson(2, ['K', 'L', 'M', 'N', 'O'], 5),
  createCameraChallenge(2, ['K', 'L', 'M', 'N', 'O'], ['LEMON', 'MONK', 'OKE'], 6),

  // Level 4: P-T
  createLearningLesson(3, ['P', 'Q', 'R'], 1),
  createPracticeLesson(3, ['P', 'Q', 'R'], 2),
  createLearningLesson(3, ['S', 'T'], 3),
  createPracticeLesson(3, ['S', 'T'], 4),
  createQuizLesson(3, ['P', 'Q', 'R', 'S', 'T'], 5),
  createCameraChallenge(3, ['P', 'Q', 'R', 'S', 'T'], ['STOP', 'REST', 'STEP'], 6),

  // Level 5: U-Z
  createLearningLesson(4, ['U', 'V', 'W'], 1),
  createPracticeLesson(4, ['U', 'V', 'W'], 2),
  createLearningLesson(4, ['X', 'Y', 'Z'], 3),
  createPracticeLesson(4, ['X', 'Y', 'Z'], 4),
  createQuizLesson(4, ['U', 'V', 'W', 'X', 'Y', 'Z'], 5),
  createCameraChallenge(4, ['U', 'V', 'W', 'X', 'Y', 'Z'], ['WAX', 'VEX', 'ZOO'], 6),
];
