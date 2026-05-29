import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAttempt extends Document {
  studentId: Types.ObjectId;
  sessionId: Types.ObjectId;
  group: 'group1' | 'group2' | 'group3';
  status: 'registered' | 'round1' | 'round2' | 'completed' | 'disqualified';
  startedAt?: Date;
  completedAt?: Date;
  round1: {
    answers: {
      wordId: Types.ObjectId;
      targetWord: string;
      submittedAnswer: string;
      isCorrect: boolean;
      timeTakenMs: number;
      lifeUsed: boolean;
    }[];
    score: number;
    livesRemaining: number;
    completedAt?: Date;
  };
  round2: {
    answers: {
      wordId: Types.ObjectId;
      clueType: 'situational' | 'synonym' | 'millennial';
      targetWord: string;
      submittedAnswer: string;
      isCorrect: boolean;
      timeTakenMs: number;
    }[];
    score: number;
    completedAt?: Date;
  };
  totalScore: number;
  rank?: number;
  percentile?: number;
  certificate?: Types.ObjectId;
  audienceReactions: {
    fire: number;
    clap: number;
    trophy: number;
  };
  ipAddress: string;
  deviceInfo: string;
}

const AttemptSchema = new Schema<IAttempt>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  group: { type: String, enum: ['group1', 'group2', 'group3'], required: true },
  status: {
    type: String,
    enum: ['registered', 'round1', 'round2', 'completed', 'disqualified'],
    default: 'registered'
  },
  startedAt: Date,
  completedAt: Date,
  round1: {
    answers: [{
      wordId: { type: Schema.Types.ObjectId, ref: 'WordBank' },
      targetWord: String,
      submittedAnswer: String,
      isCorrect: Boolean,
      timeTakenMs: Number,
      lifeUsed: { type: Boolean, default: false }
    }],
    score: { type: Number, default: 0 },
    livesRemaining: { type: Number, default: 2 },
    completedAt: Date
  },
  round2: {
    answers: [{
      wordId: { type: Schema.Types.ObjectId, ref: 'WordBank' },
      clueType: { type: String, enum: ['situational', 'synonym', 'millennial'] },
      targetWord: String,
      submittedAnswer: String,
      isCorrect: Boolean,
      timeTakenMs: Number,
    }],
    score: { type: Number, default: 0 },
    completedAt: Date
  },
  totalScore: { type: Number, default: 0 },
  rank: Number,
  percentile: Number,
  certificate: { type: Schema.Types.ObjectId, ref: 'Certificate' },
  audienceReactions: {
    fire: { type: Number, default: 0 },
    clap: { type: Number, default: 0 },
    trophy: { type: Number, default: 0 }
  },
  ipAddress: String,
  deviceInfo: String,
}, { timestamps: true });

AttemptSchema.index({ sessionId: 1, totalScore: -1 });
AttemptSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });
AttemptSchema.index({ sessionId: 1, group: 1, status: 1, totalScore: -1, completedAt: 1 });

export const Attempt = mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);
