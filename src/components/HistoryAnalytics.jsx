import React from 'react';
import { History, TrendingUp, Download, Upload, Trash2, Scale } from 'lucide-react';
import WeightChart from './WeightChart';

export default function HistoryAnalytics({ logs, weightLogs, onDeleteLog, onExportData, onImportData }) {
  const totalWorkouts = logs.length;
  const totalVolumeAll = logs.reduce((acc, l) => acc + (l.totalVolumeKg || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* MODÜL 1: Vücut Ağırlığı (Tartı) Değişim Grafiği */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={20} color="#00E5FF" /> Vücut Ağırlığı (Tartı) Değişim Grafiği
        </h2>
        <WeightChart weightLogs={weightLogs} />
      </div>

      {/* Stats Summary Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="#00E676" /> Genel Antrenman İstatistikleri
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div className="stat-box">
            <div className="stat-box-val">{totalWorkouts}</div>
            <div className="stat-box-lbl">Tamamlanan Antrenman</div>
          </div>
          <div className="stat-box">
            <div className="stat-box-val" style={{ color: '#00E676' }}>
              {totalVolumeAll > 1000 ? `${(totalVolumeAll / 1000).toFixed(1)} ton` : `${totalVolumeAll} kg`}
            </div>
            <div className="stat-box-lbl">Toplam Kaldırılan Hacim</div>
          </div>
        </div>

        {/* Data Backup Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={onExportData}
            className="btn-timer-opt"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}
          >
            <Download size={14} /> Yedeği İndir (JSON)
          </button>
          <label
            className="btn-timer-opt"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', cursor: 'pointer' }}
          >
            <Upload size={14} /> Yedek Yükle
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* History List */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="#B388FF" /> Geçmiş Antrenman Kayıtları
        </h3>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: '0.85rem' }}>
            Henüz kaydedilmiş antrenman bulunmuyor.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                className="glass-panel glass-panel-interactive"
                style={{ padding: '14px', borderRadius: '12px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#00E5FF', fontWeight: 700 }}>
                      {log.dateStr} • {log.dayName}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', marginTop: '2px' }}>
                      {log.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '0.78rem', color: '#94A3B8' }}>
                  <div>🔥 Toplam Hacim: <strong style={{ color: '#00E676' }}>{log.totalVolumeKg} kg</strong></div>
                  <div>✅ Set Sayısı: <strong style={{ color: '#F1F5F9' }}>{log.completedSetsCount}</strong></div>
                </div>

                {log.notes && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#CBD5E1', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px' }}>
                    💬 {log.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
