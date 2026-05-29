// app/(admin)/admin/sessions/[sessionId]/master-key/page.tsx
import { requirePermission } from '@/lib/rbac';
import { MasterKeyViewer } from '@/components/admin/MasterKeyViewer';

export default async function MasterKeyPage({ params }: { params: { sessionId: string } }) {
  await requirePermission('answer_key:read_all');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Master Answer Key</h1>
          <p className="text-white/40 mt-1 text-sm">
            Full word data, definitions, example sentences, and live student responses
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={`/api/admin/master-key/${params.sessionId}/export`}
            className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer select-none"
          >
            <span>⬇️</span> Export CSV
          </a>
          <a
            href={`/api/admin/master-key/${params.sessionId}/export?format=pdf`}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer select-none"
          >
            <span>📄</span> Export PDF
          </a>
        </div>
      </div>

      <MasterKeyViewer sessionId={params.sessionId} />
    </div>
  );
}
