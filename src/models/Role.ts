// models/Role.ts
import mongoose, { Schema, Document } from 'mongoose';

export type RoleName = 'admin' | 'student' | 'pronouncer' | 'judge';

export type Permission =
  | 'session:create' | 'session:read' | 'session:update' | 'session:delete'
  | 'session:publish' | 'session:monitor'
  | 'answer_key:read_all' | 'answer_key:read_own'
  | 'answer_key:export' | 'answer_key:override'
  | 'word_bank:read' | 'word_bank:write'
  | 'user:read' | 'user:write' | 'user:assign_role'
  | 'competition:register' | 'competition:take'
  | 'certificate:issue' | 'certificate:read_own'
  | 'results:read_all' | 'results:read_own' | 'results:export'
  | 'analytics:read';

export interface IRole extends Document {
  name: RoleName;
  displayName: string;
  permissions: Permission[];
  isSystem: boolean;       // System roles can't be deleted
  color: string;           // For UI badge
  description: string;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, enum: ['admin', 'student', 'pronouncer', 'judge'], unique: true },
  displayName: { type: String, required: true },
  permissions: [{ type: String }],
  isSystem: { type: Boolean, default: false },
  color: { type: String, default: '#6b7280' },
  description: String,
}, { timestamps: true });

export const Role = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

// Default role permission sets (used in seed)
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  admin: [
    'session:create', 'session:read', 'session:update', 'session:delete',
    'session:publish', 'session:monitor',
    'answer_key:read_all', 'answer_key:export', 'answer_key:override',
    'word_bank:read', 'word_bank:write',
    'user:read', 'user:write', 'user:assign_role',
    'certificate:issue',
    'results:read_all', 'results:export',
    'analytics:read',
  ],
  student: [
    'competition:register', 'competition:take',
    'answer_key:read_own',
    'certificate:read_own',
    'results:read_own',
  ],
  pronouncer: [
    'session:read', 'session:monitor',
    'word_bank:read',
    'answer_key:read_all',
    'results:read_all',
  ],
  judge: [
    'session:read', 'session:monitor',
    'answer_key:read_all', 'answer_key:export', 'answer_key:override',
    'results:read_all', 'results:export',
  ],
};
