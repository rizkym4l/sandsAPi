// src/seeds/data/levels.seed.ts
//
// XP Balancing:
// Setiap level punya 10 lessons = ~305 XP total dari lessons
// requiredXP level N+1 = total XP kumulatif setelah selesaikan level N
// Jadi user HARUS selesaikan semua lesson di level sebelumnya untuk unlock level berikutnya
//
export const levelsSeed = [
  {
    levelNumber: 1,
    title: 'Langkah Pertama!',
    description: 'Mulai petualangan bahasa isyarat! Kenali huruf A sampai E',
    requiredXP: 0,       // bebas masuk
    xpReward: 80,        // total setelah level 1: 305 + 80 = 385
    difficulty: 'beginner',
    order: 1,
    isActive: true,
  },
  {
    levelNumber: 2,
    title: 'Makin Seru!',
    description: 'Lanjutkan petualangan dengan huruf F sampai J',
    requiredXP: 305,     // harus selesaikan semua lesson level 1
    xpReward: 100,       // total setelah level 2: 385 + 305 + 100 = 790
    difficulty: 'beginner',
    order: 2,
    isActive: true,
  },
  {
    levelNumber: 3,
    title: 'Setengah Jalan!',
    description: 'Kamu sudah setengah jalan! Kuasai huruf K sampai O',
    requiredXP: 690,     // harus selesaikan semua lesson level 1-2
    xpReward: 120,       // total setelah level 3: 790 + 305 + 120 = 1215
    difficulty: 'beginner',
    order: 3,
    isActive: true,
  },
  {
    levelNumber: 4,
    title: 'Naik Level!',
    description: 'Tantangan makin seru dengan huruf P sampai T',
    requiredXP: 1095,    // harus selesaikan semua lesson level 1-3
    xpReward: 150,       // total setelah level 4: 1215 + 305 + 150 = 1670
    difficulty: 'intermediate',
    order: 4,
    isActive: true,
  },
  {
    levelNumber: 5,
    title: 'Hampir Selesai!',
    description: 'Huruf terakhir! Taklukkan U sampai Z',
    requiredXP: 1520,    // harus selesaikan semua lesson level 1-4
    xpReward: 180,       // total setelah level 5: 1670 + 305 + 180 = 2155
    difficulty: 'intermediate',
    order: 5,
    isActive: true,
  },
  {
    levelNumber: 6,
    title: 'Review: Pemula',
    description: 'Ulangi dan perkuat ingatan huruf A sampai J',
    requiredXP: 1975,    // harus selesaikan semua lesson level 1-5
    xpReward: 200,       // total setelah level 6: 2155 + 305 + 200 = 2660
    difficulty: 'intermediate',
    order: 6,
    isActive: true,
  },
  {
    levelNumber: 7,
    title: 'Review: Menengah',
    description: 'Asah lagi kemampuan huruf K sampai T',
    requiredXP: 2460,    // harus selesaikan semua lesson level 1-6
    xpReward: 250,       // total setelah level 7: 2660 + 305 + 250 = 3215
    difficulty: 'advanced',
    order: 7,
    isActive: true,
  },
  {
    levelNumber: 8,
    title: 'Master Isyarat!',
    description: 'Tantangan akhir! Buktikan kamu menguasai semua huruf A-Z',
    requiredXP: 2965,    // harus selesaikan semua lesson level 1-7
    xpReward: 300,       // total setelah level 8: 3215 + 305 + 300 = 3820
    difficulty: 'advanced',
    order: 8,
    isActive: true,
  },
];
