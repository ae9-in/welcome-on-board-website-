import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICertificate extends Document {
  attemptId: Types.ObjectId;
  studentId: Types.ObjectId;
  sessionId: Types.ObjectId;
  certificateType: 'participation' | 'merit' | 'distinction' | 'gold' | 'champion';
  pdfUrl: string;                        // Cloudinary URL
  verificationCode: string;              // 12-char alphanumeric for QR verification
  issuedAt: Date;
  rank?: number;
  score: number;
}

const CertificateSchema = new Schema<ICertificate>({
  attemptId: { type: Schema.Types.ObjectId, ref: 'Attempt', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  certificateType: {
    type: String,
    enum: ['participation', 'merit', 'distinction', 'gold', 'champion'],
    required: true
  },
  pdfUrl: { type: String, required: true },
  verificationCode: { type: String, unique: true },
  issuedAt: { type: Date, default: Date.now },
  rank: Number,
  score: Number,
}, { timestamps: true });

export const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
