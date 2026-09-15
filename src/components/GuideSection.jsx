import React from 'react';
import { BookOpen, CheckCircle, Info, Flame, ShieldAlert, Award } from 'lucide-react';
import { INITIAL_GUIDE } from '../data/workoutProgram';

export default function GuideSection({ guideStatus, onToggleGuide }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen color="#3B82F6" size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F4F6F8' }}>
              1. Hafta Başlangıç & Gelişim Rehberi
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#A1A7B3' }}>
              PDF Protokolü Temel Kuralları & Püf Noktaları
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {INITIAL_GUIDE.map((item) => {
            const isDone = !!guideStatus[item.id];
            return (
              <div 
                key={item.id} 
                className="glass-panel guide-card"
                style={{ 
                  borderLeftColor: isDone ? '#10B981' : '#3B82F6',
                  background: isDone ? 'rgba(0, 230, 118, 0.05)' : 'rgba(22, 28, 45, 0.7)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="guide-card-title">
                    {item.id === 1 && <Flame size={16} color="#F59E0B" />}
                    {item.id === 2 && <Award size={16} color="#3B82F6" />}
                    {item.id === 3 && <Info size={16} color="#10B981" />}
                    {item.id === 4 && <ShieldAlert size={16} color="#6366F1" />}
                    <span>{item.title}</span>
                  </div>

                  <button
                    onClick={() => onToggleGuide(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isDone ? '#10B981' : '#6E7683'
                    }}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
                <p className="guide-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F4F6F8', marginBottom: '8px' }}>
          💡 8 → 10 → 12 Tekrar Kuralı Nedir?
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#A1A7B3', lineHeight: 1.5 }}>
          Seçtiğin ağırlıkla 3 seti de 8 tekrar zorlanmadan yapabiliyorsan sonraki antrenmanda 10 tekrara çık. 10 tekrarı tamamladığında 12 tekrara çık. 3 seti de 12 tekrar başarıyla yaptığında ağırlığı 1.25-2.5 kg artır ve tekrar 8 tekrar ile başla!
        </p>
      </div>
    </div>
  );
}
