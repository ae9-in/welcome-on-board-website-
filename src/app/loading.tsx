// This file is the Next.js 13+ route-level loading UI.
// It renders instantly while the page JS chunk is being streamed,
// making route transitions feel immediate.
export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(250,204,21,0.2)',
            borderTop: '3px solid #facc15',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Loading…
        </p>
      </div>
    </div>
  );
}
