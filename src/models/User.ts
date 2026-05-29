// models/User.ts (FULL REPLACEMENT)
import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { RoleName, Permission } from './Role';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: RoleName;
  customPermissions: Permission[];      // Per-user permission overrides
  revokedPermissions: Permission[];     // Explicitly revoked permissions
  googleId?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  studentProfile?: Types.ObjectId;     // Ref to Student doc
  createdBy?: Types.ObjectId;          // Admin who created this account
  createdAt: Date;
  updatedAt: Date;
  // Methods
  comparePassword(candidate: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  isLocked(): boolean;
  getEffectivePermissions(): Promise<Permission[]>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, select: false },
  role: {
    type: String,
    enum: ['admin', 'student', 'pronouncer', 'judge'],
    default: 'student',
    index: true,
  },
  customPermissions: [{ type: String }],
  revokedPermissions: [{ type: String }],
  googleId: { type: String, sparse: true },
  avatar: String,
  isActive: { type: Boolean, default: true, index: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  studentProfile: { type: Schema.Types.ObjectId, ref: 'Student' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function() {
  if (!this.isModified('passwordHash') || !this.passwordHash) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// Compare password
UserSchema.methods.comparePassword = async function(candidate: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidate, this.passwordHash);
};

// Account lock check (after 5 failed logins → lock 30min)
UserSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

// Get effective permissions: role perms + custom - revoked
UserSchema.methods.getEffectivePermissions = async function(): Promise<Permission[]> {
  const { Role, DEFAULT_ROLE_PERMISSIONS } = await import('./Role');
  const roleDoc = await Role.findOne({ name: this.role });
  const basePerms = roleDoc?.permissions ?? DEFAULT_ROLE_PERMISSIONS[this.role as RoleName] ?? [];
  const merged = new Set([...basePerms, ...this.customPermissions]);
  this.revokedPermissions.forEach((p: Permission) => merged.delete(p));
  return Array.from(merged) as Permission[];
};

UserSchema.index({ email: 1, role: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
