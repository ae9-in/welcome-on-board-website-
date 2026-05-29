import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISession extends Document {
  title: string;                         // "The Modern Bee — May 2024"
  competitionType: 'modern-bee';
  scheduledAt: Date;
  durationMinutes: number;
  targetGroups: ('group1' | 'group2' | 'group3')[];
  status: 'draft' | 'open' | 'live' | 'scoring' | 'completed' | 'archived';
  round1Config: {
    wordsPerGroup: number;              // e.g. 10 words per group
    timePerWordSeconds: number;         // e.g. 45
    livesAllowed: number;              // Default: 2
  };
  round2Config: {
    cluesPerGroup: number;             // e.g. 8 clues per group
    timePerClueSeconds: number;        // e.g. 60
    clueTypes: ('situational' | 'synonym' | 'millennial')[];
  };
  registeredStudents: Types.ObjectId[];
  wordAssignments: {
    studentId: Types.ObjectId;
    group: string;
    round1Words: Types.ObjectId[];     // WordBank refs
    round2Words: Types.ObjectId[];
  }[];
  maxParticipants: number;
  registrationDeadline: Date;
  entryFee: number;                    // In rupees (0 = free)
  prizePool: string;
  bannerImage?: string;
  createdBy: Types.ObjectId;
}

const SessionSchema = new Schema<ISession>({
  title: { type: String, required: true },
  competitionType: { type: String, default: 'modern-bee' },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 90 },
  targetGroups: [{ type: String, enum: ['group1', 'group2', 'group3'] }],
  status: {
    type: String,
    enum: ['draft', 'open', 'live', 'scoring', 'completed', 'archived'],
    default: 'draft'
  },
  round1Config: {
    wordsPerGroup: { type: Number, default: 10 },
    timePerWordSeconds: { type: Number, default: 45 },
    livesAllowed: { type: Number, default: 2 }
  },
  round2Config: {
    cluesPerGroup: { type: Number, default: 8 },
    timePerClueSeconds: { type: Number, default: 60 },
    clueTypes: [{ type: String, enum: ['situational', 'synonym', 'millennial'] }]
  },
  registeredStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  wordAssignments: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    group: String,
    round1Words: [{ type: Schema.Types.ObjectId, ref: 'WordBank' }],
    round2Words: [{ type: Schema.Types.ObjectId, ref: 'WordBank' }],
  }],
  maxParticipants: { type: Number, default: 500 },
  registrationDeadline: Date,
  entryFee: { type: Number, default: 0 },
  prizePool: String,
  bannerImage: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
