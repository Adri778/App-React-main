// VIEW · Card "fantasma" exibido enquanto os produtos carregam.
export default function CardSkeleton() {
  return (
    <div className="card skel-card" aria-hidden="true">
      <div className="sk" style={{ aspectRatio: '4 / 3' }} />
      <div style={{ padding: 14, display: 'grid', gap: 9 }}>
        <div className="sk" style={{ height: 12, width: '55%', borderRadius: 6 }} />
        <div className="sk" style={{ height: 14, width: '92%', borderRadius: 6 }} />
        <div className="sk" style={{ height: 24, width: '50%', borderRadius: 6 }} />
        <div className="sk" style={{ height: 38, borderRadius: 10 }} />
      </div>
    </div>
  );
}
