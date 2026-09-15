import React, { useState } from 'react';
import { X, Check, Plus, Trash2, Dumbbell, Sparkles, ChevronDown, ChevronUp, Layers, BookOpen, AlertCircle } from 'lucide-react';
import { PRESET_PROGRAMS } from '../data/programPresets';

export default function ProgramManagerModal({
  activeProgramId,
  customPrograms,
  onSelectProgram,
  onSaveCustomProgram,
  onDeleteCustomProgram,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('presets');
  const [expandedProgramId, setExpandedProgramId] = useState(null);

  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customDays, setCustomDays] = useState([
    {
      id: 'custom_d1',
      dayName: '1. GÜN',
      title: 'İtiş Günü (Göğüs & Omuz)',
      isRest: false,
      focus: ['Göğüs', 'Omuz'],
      exercises: [
        {
          id: 'ce_1_1',
          name: 'Dumbbell Bench Press',
          tag: 'Göğüs',
          defaultSets: 3,
          targetReps: '8-10',
          suggestedWeight: '12 kg',
          tips: 'Kontrollü indirin ve göğsü sıkın.'
        }
      ]
    },
    {
      id: 'custom_d2',
      dayName: '2. GÜN',
      title: 'Çekiş Günü (Sırt & Biceps)',
      isRest: false,
      focus: ['Sırt', 'Biceps'],
      exercises: [
        {
          id: 'ce_2_1',
          name: 'Lat Pulldown',
          tag: 'Sırt',
          defaultSets: 3,
          targetReps: '8-10',
          suggestedWeight: 'Orta Ağırlık',
          tips: 'Dirsekleri aşağı çekerek kanatları sıkın.'
        }
      ]
    },
    {
      id: 'custom_d3',
      dayName: '3. GÜN',
      title: 'Dinlenme & Yenilenme',
      isRest: true,
      tips: 'Kas onarımı için dinlenme günü.'
    }
  ]);

  const allPrograms = [...PRESET_PROGRAMS, ...customPrograms];

  const toggleExpand = (id) => {
    setExpandedProgramId((prev) => (prev === id ? null : id));
  };

  const handleAddDay = () => {
    const nextIdx = customDays.length + 1;
    const newDay = {
      id: `custom_d${Date.now()}`,
      dayName: `${nextIdx}. GÜN`,
      title: `${nextIdx}. Gün Antrenmanı`,
      isRest: false,
      focus: ['Tüm Vücut'],
      exercises: [
        {
          id: `ce_${Date.now()}`,
          name: 'Yeni Egzersiz',
          tag: 'Genel',
          defaultSets: 3,
          targetReps: '10-12',
          suggestedWeight: '10 kg',
          tips: 'Formu koruyarak çalışın.'
        }
      ]
    };
    setCustomDays([...customDays, newDay]);
  };

  const handleRemoveDay = (dayIndex) => {
    if (customDays.length <= 1) return;
    setCustomDays(customDays.filter((_, idx) => idx !== dayIndex));
  };

  const handleDayChange = (dayIndex, field, value) => {
    setCustomDays((prev) => {
      const copy = [...prev];
      copy[dayIndex] = { ...copy[dayIndex], [field]: value };
      return copy;
    });
  };

  const handleAddExercise = (dayIndex) => {
    setCustomDays((prev) => {
      const copy = [...prev];
      const targetDay = { ...copy[dayIndex] };
      const currentEx = targetDay.exercises || [];
      targetDay.exercises = [
        ...currentEx,
        {
          id: `ce_${Date.now()}_${Math.random()}`,
          name: '',
          tag: 'Kas Grubu',
          defaultSets: 3,
          targetReps: '8-10',
          suggestedWeight: '10 kg',
          tips: ''
        }
      ];
      copy[dayIndex] = targetDay;
      return copy;
    });
  };

  const handleRemoveExercise = (dayIndex, exIndex) => {
    setCustomDays((prev) => {
      const copy = [...prev];
      const targetDay = { ...copy[dayIndex] };
      if ((targetDay.exercises || []).length <= 1) return prev;
      targetDay.exercises = targetDay.exercises.filter((_, idx) => idx !== exIndex);
      copy[dayIndex] = targetDay;
      return copy;
    });
  };

  const handleExerciseChange = (dayIndex, exIndex, field, value) => {
    setCustomDays((prev) => {
      const copy = [...prev];
      const targetDay = { ...copy[dayIndex] };
      const currentEx = [...(targetDay.exercises || [])];
      currentEx[exIndex] = {
        ...currentEx[exIndex],
        [field]: field === 'defaultSets' ? (Number(value) || 3) : value
      };
      targetDay.exercises = currentEx;
      copy[dayIndex] = targetDay;
      return copy;
    });
  };

  const handleSaveCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      alert('Lütfen program adı girin.');
      return;
    }

    const trainingDaysCount = customDays.filter((d) => !d.isRest).length;

    const newProgram = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: 'Özel Program',
      daysPerWeek: trainingDaysCount,
      description: customDesc.trim() || 'Kişiselleştirilmiş özel antrenman spliti.',
      isCustom: true,
      days: customDays
    };

    onSaveCustomProgram(newProgram);
    onSelectProgram(newProgram.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '520px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#38BDF8" /> Antrenman Programı Seç & Oluştur
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--surface-alt)', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              background: activeTab === 'presets' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'presets' ? '#38BDF8' : 'var(--text-sub)',
              boxShadow: activeTab === 'presets' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            Hazır Programlar ({PRESET_PROGRAMS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              background: activeTab === 'custom' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'custom' ? '#10B981' : 'var(--text-sub)',
              boxShadow: activeTab === 'custom' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            Manuel Özel Program Ekle
          </button>
        </div>

        {activeTab === 'presets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allPrograms.map((prog) => {
              const isActive = prog.id === activeProgramId;
              const isExpanded = prog.id === expandedProgramId;

              return (
                <div
                  key={prog.id}
                  style={{
                    background: isActive ? 'linear-gradient(145deg, #18181B, #1E293B)' : 'var(--surface)',
                    border: isActive ? '1px solid #38BDF8' : '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleExpand(prog.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {prog.name}
                        </h3>
                        {isActive && (
                          <span style={{ background: '#10B981', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                            AKTİF
                          </span>
                        )}
                        {prog.isCustom && (
                          <span style={{ background: 'var(--surface-alt)', color: '#38BDF8', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                            ÖZEL
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                        <span>{prog.category}</span>
                        <span>•</span>
                        <span>Haftada {prog.daysPerWeek} Gün</span>
                      </div>

                      <p style={{ fontSize: '0.75rem', color: '#A1A1AA', marginTop: '6px', lineHeight: 1.4 }}>
                        {prog.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
                      {prog.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`"${prog.name}" programını silmek istediğinize emin misiniz?`)) {
                              onDeleteCustomProgram(prog.id);
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '6px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProgram(prog.id);
                            onClose();
                          }}
                          style={{
                            background: '#38BDF8',
                            color: '#09090B',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Check size={14} /> Seç
                        </button>
                      ) : (
                        <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', padding: '6px' }}>
                          <Check size={18} />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(prog.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>
                        Günlük Antrenman Dağılımı:
                      </div>
                      {prog.days.map((day, idx) => (
                        <div
                          key={day.id || idx}
                          style={{
                            background: 'var(--surface-alt)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{day.dayName}: {day.title}</span>
                            <span style={{ color: day.isRest ? '#A1A1AA' : '#10B981', fontSize: '0.7rem', fontWeight: 700 }}>
                              {day.isRest ? 'Dinlenme' : `${day.exercises?.length || 0} Hareket`}
                            </span>
                          </div>
                          {!day.isRest && day.exercises && (
                            <div style={{ color: 'var(--text-sub)', fontSize: '0.7rem', marginTop: '4px' }}>
                              {day.exercises.map(e => e.name).join(' • ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'custom' && (
          <form onSubmit={handleSaveCustom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Program Adı *
              </label>
              <input
                type="text"
                placeholder="Örn: 4 Günlük Özel Hipertrofi"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', color: '#FAFAFA' }}
                required
              />

              <label style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginTop: '10px', marginBottom: '6px' }}>
                Program Açıklaması
              </label>
              <input
                type="text"
                placeholder="Örn: Omuz ve kol öncelikli hacim rutini"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', color: '#FAFAFA' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Program Günleri ({customDays.length} Gün)
              </span>
              <button
                type="button"
                onClick={handleAddDay}
                style={{
                  background: 'var(--surface-alt)',
                  color: '#10B981',
                  border: '1px solid var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} /> Yeni Gün Ekle
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {customDays.map((day, dIdx) => (
                <div
                  key={day.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#38BDF8', fontWeight: 800, fontSize: '0.8rem' }}>#{dIdx + 1}</span>
                      <input
                        type="text"
                        value={day.dayName}
                        onChange={(e) => handleDayChange(dIdx, 'dayName', e.target.value)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px dashed var(--border-subtle)',
                          color: '#FAFAFA',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          width: '100px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-sub)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={day.isRest}
                          onChange={(e) => handleDayChange(dIdx, 'isRest', e.target.checked)}
                        />
                        Dinlenme Günü
                      </label>

                      {customDays.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(dIdx)}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Gün Başlığı (Örn: Göğüs + Kol)"
                    value={day.title}
                    onChange={(e) => handleDayChange(dIdx, 'title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'var(--surface-alt)',
                      border: '1px solid var(--border-subtle)',
                      color: '#FAFAFA',
                      fontSize: '0.78rem',
                      marginBottom: '8px'
                    }}
                  />

                  {day.isRest ? (
                    <input
                      type="text"
                      placeholder="Dinlenme günü tavsiyesi..."
                      value={day.tips || ''}
                      onChange={(e) => handleDayChange(dIdx, 'tips', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: 'var(--surface-alt)',
                        border: '1px solid var(--border-subtle)',
                        color: '#A1A1AA',
                        fontSize: '0.75rem'
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      {(day.exercises || []).map((ex, eIdx) => (
                        <div
                          key={ex.id || eIdx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.8fr 1fr 1fr 28px',
                            gap: '6px',
                            alignItems: 'center',
                            background: 'var(--bg-dark)',
                            padding: '6px',
                            borderRadius: '6px'
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Hareket Adı"
                            value={ex.name}
                            onChange={(e) => handleExerciseChange(dIdx, eIdx, 'name', e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: '#FAFAFA', fontSize: '0.75rem' }}
                            required
                          />
                          <input
                            type="number"
                            placeholder="Set"
                            value={ex.defaultSets}
                            onChange={(e) => handleExerciseChange(dIdx, eIdx, 'defaultSets', e.target.value)}
                            style={{ background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', color: '#FAFAFA', fontSize: '0.75rem', padding: '2px 4px', borderRadius: '4px', textAlign: 'center' }}
                            min="1"
                            max="10"
                          />
                          <input
                            type="text"
                            placeholder="Tekrar"
                            value={ex.targetReps}
                            onChange={(e) => handleExerciseChange(dIdx, eIdx, 'targetReps', e.target.value)}
                            style={{ background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', color: '#FAFAFA', fontSize: '0.75rem', padding: '2px 4px', borderRadius: '4px', textAlign: 'center' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(dIdx, eIdx)}
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddExercise(dIdx)}
                        style={{
                          alignSelf: 'flex-start',
                          background: 'transparent',
                          color: '#38BDF8',
                          border: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '4px'
                        }}
                      >
                        <Plus size={12} /> Hareketi Ekle
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FAFAFA',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '10px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Sparkles size={16} /> PROGRAMI KAYDET & KULLAN
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
