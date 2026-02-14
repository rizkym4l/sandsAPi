// src/seeds/data/lessons.seed.ts

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function createLearningLesson(
  levelIndex: number, letters: string[], order: number,
  title?: string, desc?: string,
) {
  return {
    levelIndex,
    type: 'learning',
    title: title || `Mengenal Huruf ${letters.join(', ')}`,
    description: desc || `Belajar bahasa isyarat untuk huruf ${letters.join(', ')}`,
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

function createPracticeLesson(
  levelIndex: number, letters: string[], order: number,
  title?: string, desc?: string,
) {
  return {
    levelIndex,
    type: 'practice',
    title: title || `Latihan Huruf ${letters.join(', ')}`,
    description: desc || `Latihan bahasa isyarat huruf ${letters.join(', ')}`,
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
    estimatedDuration: 12,
    isCompleted: false,
  };
}

function createQuizLesson(
  levelIndex: number, letters: string[], order: number,
  title?: string, desc?: string,
) {
  return {
    levelIndex,
    type: 'quiz',
    title: title || `Quiz Huruf ${letters.join(', ')}`,
    description: desc || `Uji kemampuan bahasa isyarat huruf ${letters.join(', ')}`,
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
    rewards: { xpPoints: 35 },
    order,
    estimatedDuration: 15,
    isCompleted: false,
  };
}

function createCameraChallenge(
  levelIndex: number, letters: string[], words: string[], order: number,
  title?: string, desc?: string,
) {
  return {
    levelIndex,
    type: 'camera-challenge',
    title: title || `Tantangan Kamera: ${words.join(', ')}`,
    description: desc || `Peragakan kata ${words.join(', ')} dengan bahasa isyarat di depan kamera!`,
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
    estimatedDuration: 15,
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

  return options.sort(() => Math.random() - 0.5);
}

// ============================================================
// LEVEL LESSON GENERATOR
// Pattern per level (10 lessons):
//  1. Learning batch 1
//  2. Practice batch 1
//  3. Camera Challenge batch 1 (kata pendek)
//  4. Learning batch 2
//  5. Practice batch 2
//  6. Camera Challenge batch 2 (kata pendek)
//  7. Quiz gabungan
//  8. Practice review (semua huruf)
//  9. Quiz akhir
// 10. Camera Challenge seru (kata-kata keren)
// ============================================================

function createLevelLessons(
  levelIndex: number,
  batch1: string[],
  batch2: string[],
  cameraWords1: string[],
  cameraWords2: string[],
  funWords: string[],
) {
  const allLetters = [...batch1, ...batch2];
  return [
    createLearningLesson(levelIndex, batch1, 1),
    createPracticeLesson(levelIndex, batch1, 2),
    createCameraChallenge(levelIndex, batch1, cameraWords1, 3),
    createLearningLesson(levelIndex, batch2, 4),
    createPracticeLesson(levelIndex, batch2, 5),
    createCameraChallenge(levelIndex, batch2, cameraWords2, 6),
    createQuizLesson(levelIndex, allLetters, 7),
    createPracticeLesson(levelIndex, allLetters, 8,
      `Review Semua: ${allLetters.join(', ')}`,
      `Latihan campuran semua huruf level ini!`,
    ),
    createQuizLesson(levelIndex, allLetters, 9,
      `Quiz Akhir: ${allLetters.join(', ')}`,
      `Ujian akhir sebelum naik level! Semangat!`,
    ),
    createCameraChallenge(levelIndex, allLetters, funWords, 10,
      `Tantangan Seru: ${funWords.join(', ')}`,
      `Tantangan terakhir! Eja kata-kata keren ini pakai bahasa isyarat!`,
    ),
  ];
}

// Untuk level review (huruf sudah pernah dipelajari)
function createReviewLessons(
  levelIndex: number,
  batch1: string[],
  batch2: string[],
  cameraWords1: string[],
  cameraWords2: string[],
  funWords: string[],
) {
  const allLetters = [...batch1, ...batch2];
  return [
    createLearningLesson(levelIndex, batch1, 1,
      `Review Huruf ${batch1.join(', ')}`,
      `Ingat lagi huruf ${batch1.join(', ')}! Masih hafal kan?`,
    ),
    createPracticeLesson(levelIndex, batch1, 2,
      `Latihan Review: ${batch1.join(', ')}`,
      `Asah lagi kemampuan huruf ${batch1.join(', ')}`,
    ),
    createCameraChallenge(levelIndex, batch1, cameraWords1, 3),
    createLearningLesson(levelIndex, batch2, 4,
      `Review Huruf ${batch2.join(', ')}`,
      `Lanjut review huruf ${batch2.join(', ')}!`,
    ),
    createPracticeLesson(levelIndex, batch2, 5,
      `Latihan Review: ${batch2.join(', ')}`,
      `Asah lagi kemampuan huruf ${batch2.join(', ')}`,
    ),
    createCameraChallenge(levelIndex, batch2, cameraWords2, 6),
    createQuizLesson(levelIndex, allLetters, 7,
      `Quiz Review: ${allLetters.join(', ')}`,
      `Test apakah kamu masih ingat semua huruf ini!`,
    ),
    createPracticeLesson(levelIndex, allLetters, 8,
      `Latihan Intensif`,
      `Latihan intensif semua huruf yang sudah dipelajari!`,
    ),
    createQuizLesson(levelIndex, allLetters, 9,
      `Quiz Akhir Review`,
      `Buktikan kamu masih menguasai huruf-huruf ini!`,
    ),
    createCameraChallenge(levelIndex, allLetters, funWords, 10,
      `Tantangan Seru: ${funWords.join(', ')}`,
      `Eja kata-kata seru dengan bahasa isyarat!`,
    ),
  ];
}

// ============================================================
// DATA LESSONS (8 Level x 10 Lesson = 80 Lessons)
// ============================================================

export const lessonsSeed = [
  // ──────────────────────────────────────────────
  // Level 1: Langkah Pertama! (A-E)
  // ──────────────────────────────────────────────
  ...createLevelLessons(
    0,
    ['A', 'B', 'C'],                    // batch 1
    ['D', 'E'],                          // batch 2
    ['CAB', 'BAC'],                      // kamera batch 1 (huruf A,B,C)
    ['BED', 'DAD', 'ADD'],               // kamera batch 2 (huruf D,E)
    ['BEAD', 'DEAD', 'ACE', 'DECADE'],   // kata seru (semua A-E)
  ),

  // ──────────────────────────────────────────────
  // Level 2: Makin Seru! (F-J)
  // ──────────────────────────────────────────────
  ...createLevelLessons(
    1,
    ['F', 'G', 'H'],
    ['I', 'J'],
    ['FIG', 'BAG', 'HAD'],               // kamera (F,G,H)
    ['JAB', 'JIG', 'BID'],               // kamera (I,J)
    ['CAFE', 'BADGE', 'BEACH', 'CHIEF'], // kata seru (kumulatif A-J)
  ),

  // ──────────────────────────────────────────────
  // Level 3: Setengah Jalan! (K-O)
  // ──────────────────────────────────────────────
  ...createLevelLessons(
    2,
    ['K', 'L', 'M'],
    ['N', 'O'],
    ['MILK', 'LIME', 'ELM'],                     // kamera (K,L,M)
    ['BONE', 'MOON', 'NOON'],                    // kamera (N,O)
    ['LEMON', 'MELON', 'DOMINO', 'FLAMINGO'],    // kata seru (kumulatif A-O)
  ),

  // ──────────────────────────────────────────────
  // Level 4: Naik Level! (P-T)
  // ──────────────────────────────────────────────
  ...createLevelLessons(
    3,
    ['P', 'Q', 'R'],
    ['S', 'T'],
    ['GRIP', 'DROP', 'PARK'],                       // kamera (P,Q,R)
    ['FIRST', 'STORM', 'TOAST'],                    // kamera (S,T)
    ['MONSTER', 'PIRATE', 'CAPTAIN', 'DRAGON'],     // kata seru (kumulatif A-T)
  ),

  // ──────────────────────────────────────────────
  // Level 5: Hampir Selesai! (U-Z)
  // ──────────────────────────────────────────────
  ...createLevelLessons(
    4,
    ['U', 'V', 'W'],
    ['X', 'Y', 'Z'],
    ['WAVE', 'VOW', 'FIVE'],                            // kamera (U,V,W)
    ['BOX', 'LAZY', 'YAK'],                             // kamera (X,Y,Z)
    ['GALAXY', 'WIZARD', 'OXYGEN', 'ADVENTURE'],        // kata seru (semua huruf!)
  ),

  // ──────────────────────────────────────────────
  // Level 6: Review Pemula (A-J)
  // ──────────────────────────────────────────────
  ...createReviewLessons(
    5,
    ['A', 'B', 'C', 'D', 'E'],
    ['F', 'G', 'H', 'I', 'J'],
    ['ACE', 'DEAD', 'BEAD'],                // review kamera A-E
    ['CHIEF', 'BADGE', 'FIG'],              // review kamera F-J
    ['BEACH', 'JEDI', 'CAFE', 'DICE'],      // kata seru (A-J)
  ),

  // ──────────────────────────────────────────────
  // Level 7: Review Menengah (K-T)
  // ──────────────────────────────────────────────
  ...createReviewLessons(
    6,
    ['K', 'L', 'M', 'N', 'O'],
    ['P', 'Q', 'R', 'S', 'T'],
    ['MELON', 'LEMON', 'MONK'],                         // review kamera K-O
    ['SPORT', 'STORM', 'PRINT'],                        // review kamera P-T
    ['PRINCESS', 'KINGDOM', 'SPARKLING', 'DRAGON'],     // kata seru (A-T)
  ),

  // ──────────────────────────────────────────────
  // Level 8: Master Isyarat! (A-Z)
  // ──────────────────────────────────────────────
  ...createReviewLessons(
    7,
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
    ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    ['MAGIC', 'BLACKMAIL', 'CLIMB'],                        // kamera A-M
    ['WIZARD', 'OXYGEN', 'PYTHON'],                         // kamera N-Z
    ['GALAXY', 'ADVENTURE', 'CHAMPION', 'PHOENIX'],         // kata seru SEMUA huruf!
  ),
];
