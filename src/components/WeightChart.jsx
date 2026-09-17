import React from 'react';

export default function WeightChart({ weightLogs }) {
  if (!weightLogs || weightLogs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '16px', color: '#6E7683', fontSize: '0.82rem' }}>
        Henüz tartı verisi bulunmuyor. Üst kısımdaki "Bugünkü Kilonu Gir" bölümünden ilk kilo kaydını ekle!
      </div>
    );
  }

  // Sort chronologically
  const sortedLogs = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const weights = sortedLogs.map((l) => Number(l.weight));
  
  const minWeight = Math.min(...weights) - 0.5;
  const maxWeight = Math.max(...weights) + 0.5;
  const range = maxWeight - minWeight || 1;

  const firstWeight = weights[0];
  const latestWeight = weights[weights.length - 1];
  const diff = (latestWeight - firstWeight).toFixed(1);

  // Generate SVG Points
  const width = 300;
  const height = 120;
  const points = sortedLogs.map((item, index) => {
    const x = (index / (sortedLogs.length - 1 || 1)) * (width - 20) + 10;
    const y = height - ((Number(item.weight) - minWeight) / range) * (height - 30) - 15;
    return { x, y, weight: item.weight, date: item.date };
  });

  const pathD = points.length > 1
    ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
    : `M 10,${height / 2} L ${width - 10},${height / 2}`;

  return (
    <div>
      {/* Weight Summary Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
        <div className="stat-box" style={{ padding: '8px' }}>
          <div className="stat-box-val" style={{ fontSize: '1.1rem' }}>{latestWeight} kg</div>
          <div className="stat-box-lbl">Son Kilo</div>
        </div>

        <div className="stat-box" style={{ padding: '8px' }}>
          <div className="stat-box-val" style={{ fontSize: '1.1rem', color: diff < 0 ? '#10B981' : diff > 0 ? '#F59E0B' : '#3B82F6' }}>
            {diff > 0 ? `+${diff}` : diff} kg
          </div>
          <div className="stat-box-lbl">Toplam Değişim</div>
        </div>

        <div className="stat-box" style={{ padding: '8px' }}>
          <div className="stat-box-val" style={{ fontSize: '1.1rem', color: '#6366F1' }}>
            {(weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1)} kg
          </div>
          <div className="stat-box-lbl">Ortalama Kilo</div>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          
          {/* Main Line */}
          <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="5" fill="#0B0F19" stroke="#3B82F6" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 8} fill="#F4F6F8" fontSize="9" fontWeight="700" textAnchor="middle">
                {p.weight}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
        {sortedLogs.slice().reverse().map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.04)',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ color: '#A1A7B3' }}>{item.date}</span>
            <strong style={{ color: '#3B82F6' }}>{item.weight} kg</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
