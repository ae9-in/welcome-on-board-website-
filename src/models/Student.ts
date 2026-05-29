import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  userId: Types.ObjectId;
  fullName: string;
  grade: number;                         // 1–11
  group: 'group1' | 'group2' | 'group3'; // Computed from grade
  schoolName: string;
  city: string;
  parentEmail: string;
  parentPhone: string;
  dateOfBirth: Date;
  profilePhoto?: string;                 // Cloudinary URL
  registrationNumber: string;           // Auto-generated: MB-2024-XXXXX
  totalPoints: number;
  globalRank?: number;
  badges: string[];
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  grade: { type: Number, required: true, min: 1, max: 11 },
  group: {
    type: String,
    enum: ['group1', 'group2', 'group3'],
    required: true
  },
  schoolName: { type: String, required: true },
  city: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  profilePhoto: String,
  registrationNumber: { type: String, unique: true },
  totalPoints: { type: Number, default: 0 },
  globalRank: Number,
  badges: [{ type: String }],
}, { timestamps: true });

// Pre-save: auto-assign group from grade
StudentSchema.pre('save', function(next: any) {
  if (this.grade >= 1 && this.grade <= 3) this.group = 'group1';
  else if (this.grade >= 4 && this.grade <= 7) this.group = 'group2';
  else this.group = 'group3';

  if (!this.registrationNumber) {
    const random = Math.floor(10000 + Math.random() * 90000);
    this.registrationNumber = `MB-${new Date().getFullYear()}-${random}`;
  }
  if (typeof next === 'function') next();
});

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
