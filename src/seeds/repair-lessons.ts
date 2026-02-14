// src/seeds/repair-lessons.ts
// Fixes corrupted lesson documents:
//   1. Resets isCompleted to false (was set globally by old bug)
//   2. Restores rewards.xpPoints based on lesson type (was set to 0 by old bug)

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

const XP_BY_TYPE: Record<string, number> = {
  learning: 20,
  practice: 25,
  quiz: 35,
  'camera-challenge': 40,
};

async function repair() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = app.get<Connection>(getConnectionToken());

  console.log('🔧 Repairing corrupted lesson documents...\n');

  try {
    const lessons = await connection.collection('lessons').find({}).toArray();
    let fixed = 0;

    for (const lesson of lessons) {
      const correctXP = XP_BY_TYPE[lesson.type] || 20;
      const needsFix =
        lesson.isCompleted === true ||
        !lesson.rewards?.xpPoints ||
        lesson.rewards?.xpPoints === 0;

      if (needsFix) {
        await connection.collection('lessons').updateOne(
          { _id: lesson._id },
          {
            $set: {
              isCompleted: false,
              'rewards.xpPoints': correctXP,
            },
          },
        );
        fixed++;
        console.log(
          `  Fixed: "${lesson.title}" → isCompleted=false, xpPoints=${correctXP}`,
        );
      }
    }

    console.log(`\n✅ Repaired ${fixed}/${lessons.length} lessons`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

repair();
