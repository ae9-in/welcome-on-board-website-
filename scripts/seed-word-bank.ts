import fs from 'fs';
import path from 'path';

// 1. Manually parse .env.local BEFORE importing any DB modules to prevent hoisting execution issues
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn('Failed to load .env.local manually', e);
}

// Load the canonical 200-word bank from wordBank.ts (all 13 classes, LKG to Class11)
let SEED_WORDS: any[] = [];
try {
  // We use require() style import to avoid ESM issues in seed script
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const wordBankPath = path.resolve(process.cwd(), 'src/app/(platform)/competitions/modern-bee/wordBank.ts');
  const wordBankContent = fs.readFileSync(wordBankPath, 'utf8');
  // Simple regex extraction: match each key and its array
  const wordBankMatch = wordBankContent.match(/export const CLASS_WORD_BANK[\s\S]*?=\s*(\{[\s\S]*?\}\s*;)/m);
  if (wordBankMatch) {
    // Use eval-like parsing via Function constructor for safely extracting the object
    const raw = wordBankMatch[1].replace(/;$/, '');
    // Parse by extracting key: [array] pairs
    const classRegex = /([A-Za-z0-9]+):\s*\[([^\]]+)\]/g;
    let match;
    while ((match = classRegex.exec(raw)) !== null) {
      const classKey = match[1];
      const wordsRaw = match[2];
      const words: string[] = wordsRaw.match(/['"]([^'"]+)['"]/g)?.map((w: string) => w.replace(/['"`]/g, '')) || [];
      words.forEach((word: string, idx: number) => {
        SEED_WORDS.push({
          targetWord: word.toUpperCase(),
          group: classKey, // e.g. 'LKG', 'Class1', 'Class11'
          definition: `A ${word.length}-letter word used in academic spelling practice.`,
          exampleSentence1: `The student correctly spelled the word "${word.toLowerCase()}" during the contest.`,
          exampleSentence2: `Mastering "${word.toLowerCase()}" helps build a strong vocabulary foundation.`,
          situationalPrompt: `This word starts with '${word[0].toUpperCase()}' and ends with '${word[word.length-1].toUpperCase()}' and has ${word.length} letters.`,
          formalSynonym: `Spell the word: ${word.toUpperCase()}`,
          millennialCrossRef: `Context spelling for ${word.toUpperCase()}`,
          pronunciation: word.toLowerCase(),
          partOfSpeech: 'noun',
          difficultyScore: Math.min(10, Math.max(1, Math.ceil((idx + 1) / 20))),
          category: ['gaming', 'social', 'streaming', 'messaging', 'subcultural'][idx % 5],
          stressPattern: '',
          ttsOverrideText: '',
          audioUrlHighQuality: '',
          partnerWords: [],
        });
      });
    }
    console.log(`📚 Loaded ${SEED_WORDS.length} words from wordBank.ts (${[...new Set(SEED_WORDS.map(w => w.group))].length} classes)`);
  }
} catch (err) {
  console.error('Failed to load wordBank.ts for seeding', err);
}

async function seed() {
  console.log('🌱 Starting full database seeding...');
  
  // Dynamic imports to prevent ESM hoisting execution issue
  const { default: mongoose } = await import('mongoose');
  const { connectDB } = await import('../src/lib/mongodb.js');
  const { WordBank } = await import('../src/models/WordBank.js');
  const { User } = await import('../src/models/User.js');
  const { Student } = await import('../src/models/Student.js');
  const { Session } = await import('../src/models/Session.js');
  const { Attempt } = await import('../src/models/Attempt.js');
  const { Certificate } = await import('../src/models/Certificate.js');
  const { Role, DEFAULT_ROLE_PERMISSIONS } = await import('../src/models/Role.js');

  await connectDB();

  // 1. Clean existing records
  await WordBank.deleteMany({});
  await User.deleteMany({});
  await Student.deleteMany({});
  await Session.deleteMany({});
  await Attempt.deleteMany({});
  await Certificate.deleteMany({});
  await Role.deleteMany({});

  console.log('🗑️ Cleaned existing collections.');

  // 2. Insert Word Bank
  const words = await WordBank.insertMany(
    SEED_WORDS.map(w => ({ ...w, isActive: true, usageCount: 0, createdBy: 'system' }))
  );
  console.log(`✅ Seeded ${words.length} words in WordBank.`);

  // 2b. Seed Roles
  const rolesToSeed = [
    { name: 'admin', displayName: 'System Administrator', permissions: DEFAULT_ROLE_PERMISSIONS.admin, isSystem: true, color: '#ef4444', description: 'Full administrative access' },
    { name: 'student', displayName: 'Student Challenger', permissions: DEFAULT_ROLE_PERMISSIONS.student, isSystem: true, color: '#3b82f6', description: 'Register and compete in matches' },
    { name: 'pronouncer', displayName: 'Competition Pronouncer', permissions: DEFAULT_ROLE_PERMISSIONS.pronouncer, isSystem: true, color: '#eab308', description: 'Deliver phonetics and stream clues' },
    { name: 'judge', displayName: 'Championship Judge', permissions: DEFAULT_ROLE_PERMISSIONS.judge, isSystem: true, color: '#a855f7', description: 'Evaluate attempts and adjust logs' },
  ];
  await Role.insertMany(rolesToSeed);
  console.log('✅ Seeded user roles.');

  // 3. Create Default Admin User
  const adminId = new mongoose.Types.ObjectId('6655c0a2e8549f2b882379c1');
  const adminUser = await User.create({
    _id: adminId,
    name: 'System Admin',
    email: 'admin@modernbee.com',
    passwordHash: 'admin123',
    role: 'admin',
  });
  console.log('👤 Seeded Admin User: admin@modernbee.com / admin123');

  // 4. Create Default Student User
  const studentUserId = new mongoose.Types.ObjectId('6655c0a2e8549f2b882379c2');
  const studentUser = await User.create({
    _id: studentUserId,
    name: 'Jishnu',
    email: 'jishnu@modernbee.com',
    passwordHash: 'jishnu123',
    role: 'student',
  });
  console.log('👤 Seeded Student User: jishnu@modernbee.com / jishnu123');

  // 5. Create Default Student Profile
  const studentProfileId = new mongoose.Types.ObjectId('6655c0a2e8549f2b882379c3');
  const studentProfile = await Student.create({
    _id: studentProfileId,
    userId: studentUserId,
    fullName: 'Jishnu',
    grade: 5, // Grades 4-7 maps to group2
    group: 'group2',
    schoolName: 'Greenwood International',
    city: 'Los Angeles',
    parentEmail: 'parent@modernbee.com',
    parentPhone: '1234567890',
    dateOfBirth: new Date('2015-05-15'),
    totalPoints: 0,
    badges: [],
  });
  console.log(`🎓 Seeded Student Profile for ${studentProfile.fullName} in grade group: ${studentProfile.group}`);

  // 6. Create Default active tournament session
  const sessionId = new mongoose.Types.ObjectId('6655c1e0e8549f2b882379d4');
  const session = await Session.create({
    _id: sessionId,
    title: 'The Modern Bee — May 2026',
    competitionType: 'modern-bee',
    scheduledAt: new Date(),
    durationMinutes: 90,
    targetGroups: ['group1', 'group2', 'group3'],
    status: 'open',
    round1Config: {
      wordsPerGroup: 10,  // 10 words per round from the 200-word bank
      timePerWordSeconds: 45,
      livesAllowed: 2,
    },
    round2Config: {
      cluesPerGroup: 10, // 10 clues per round (next 10 from the 200-word bank)
      timePerClueSeconds: 60,
      clueTypes: ['situational', 'synonym', 'millennial'],
    },
    registeredStudents: [],
    wordAssignments: [],
    maxParticipants: 500,
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days in future
    entryFee: 0,
    prizePool: 'Medals and Certificates',
    createdBy: adminId,
  });
  console.log(`🏆 Seeded active Modern Bee Session with ID: ${session._id}`);

  console.log('✅ Full database seeding completed successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Database seeding failed:', err);
  process.exit(1);
});
