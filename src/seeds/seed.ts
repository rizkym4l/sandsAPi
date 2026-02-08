// src/seeds/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { levelsSeed } from './data/levels.seed';
import { lessonsSeed } from './data/lessons.seed';
import { achievementsSeed } from './data/achievements.seed';
import { userssedd } from './data/users.seed';
async function seed() {
  // 1. Buat app context (tanpa HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);

  // 2. Ambil koneksi MongoDB
  const connection = app.get<Connection>(getConnectionToken());

  console.log('🌱 Mulai seeding database...\n');

  try {
    // 3. Hapus data lama
    console.log('🗑️  Menghapus data lama...');
    await connection.collection('levels').deleteMany({});
    await connection.collection('lessons').deleteMany({});
    await connection.collection('achievements').deleteMany({});
    console.log('✅ Data lama dihapus\n');

    // 4. Insert levels
    console.log('📦 Memasukkan data levels...');
    const levelsResult = await connection.collection('levels').insertMany(levelsSeed);
    const levelIds = Object.values(levelsResult.insertedIds);
    console.log(`✅ ${levelIds.length} levels berhasil dimasukkan\n`);

    // 5. Insert lessons (ganti levelIndex → levelId)
    console.log('📦 Memasukkan data lessons...');
    const lessonsWithLevelId = lessonsSeed.map((lesson) => {
      const { levelIndex, ...rest } = lesson;
      return {
        ...rest,
        levelId: levelIds[levelIndex], // ganti index → ObjectId
      };
    });
    const lessonsResult = await connection.collection('lessons').insertMany(lessonsWithLevelId);
    console.log(`✅ ${Object.keys(lessonsResult.insertedIds).length} lessons berhasil dimasukkan\n`);

    // 6. Update levels dengan lesson IDs
    console.log('🔗 Menghubungkan lessons ke levels...');
    for (let i = 0; i < levelIds.length; i++) {
      const lessonIds = Object.entries(lessonsResult.insertedIds) //mengambil idnya lesson tapi gatau insertedIds ini fungsi dari package kayaknya dengan bentuk example 0: "adas2" nmah kita obejct entries suapaya jadi 0 , "adas2"
        .filter(([index]) => lessonsWithLevelId[Number(index)].levelId === levelIds[i])//ambil data /filter data jika lessons.levelId sama dengan
        .map(([, id]) => id);

      await connection.collection('levels').updateOne(
        { _id: levelIds[i] },
        { $set: { lessons: lessonIds } },
      );
      console.log(`  Level ${i + 1}: ${lessonIds.length} lessons ditautkan`);
    }

    // 7. Insert achievements
    console.log('\n📦 Memasukkan data achievements...');
    const achievementsResult = await connection.collection('achievements').insertMany(achievementsSeed);
    const achievementIds = Object.values(achievementsResult.insertedIds);
    console.log(`✅ ${achievementIds.length} achievements berhasil dimasukkan\n`);

    // 8. Insert dummy UserAchievement (ambil user pertama yang ada)
    console.log('📦 Memasukkan dummy UserAchievement...');
    await connection.collection('userachievements').deleteMany({});
    const firstUser = await connection.collection('users').findOne({});
    if (firstUser) {
      await connection.collection('userachievements').insertMany([
        {
          userId: firstUser._id,
          achievementId: achievementIds[0], // 3 Day Streak
          progress: 2,
          isCompleted: false,
          unlockedAt: null,
        },
        {
          userId: firstUser._id,
          achievementId: achievementIds[3], // First Steps (100 XP)
          progress: 50,
          isCompleted: false,
          unlockedAt: null,
        },
        {
          userId: firstUser._id,
          achievementId: achievementIds[6], // First Lesson
          progress: 100,
          isCompleted: true,
          unlockedAt: new Date(),
        },
      ]);
      console.log(`✅ 3 dummy UserAchievements untuk user ${firstUser.email} berhasil dimasukkan\n`);
    } else {
      console.log('⚠️  Tidak ada user, skip UserAchievement seed\n');
    }

    console.log('\n🎉 Seeding selesai!\n');
    console.log('📊 Ringkasan:');
    console.log(`  - ${levelIds.length} Levels`);
    console.log(`  - ${Object.keys(lessonsResult.insertedIds).length} Lessons`);
    console.log(`  - ${Object.keys(achievementsResult.insertedIds).length} Achievements`);
    console.log(`  - Setiap level punya 5 lessons (learning → practice → quiz)`);

  } catch (error) {
    console.error('❌ Error saat seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
