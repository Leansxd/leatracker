import React, { useState, useRef } from 'react';
import { X, Check, Plus, Trash2, Dumbbell, Sparkles, ChevronDown, ChevronUp, ChevronRight, Layers, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import { PRESET_PROGRAMS } from '../data/programPresets';
import { toast } from './Toaster';

export default function ProgramManagerModal({
  activeProgramId,
  programs,
  onSelectProgram,
  onSaveCustomProgram,
  onDeleteCustomProgram,
  onDeletePresetProgram,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('presets');
  const [expandedProgramId, setExpandedProgramId] = useState(null);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dragStartRef = useRef(0);
  const dragYRef = useRef(0);

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragStartRef.current = e.clientY;
    dragYRef.current = 0;
    setIsDragging(true);
    setIsClosing(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dy = Math.max(0, e.clientY - dragStartRef.current);
    dragYRef.current = dy;
    setDragY(dy);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragYRef.current > 110) {
      animateClose();
    } else {
      setDragY(0);
    }
  };

  const animateClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setDragY(window.innerHeight);
    setTimeout(onClose, 290);
  };

  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingDayIdx, setEditingDayIdx] = useState(null);
  const [dayDeleteConfirm, setDayDeleteConfirm] = useState(false);
  const deleteConfirmTimerRef = useRef(null);

  const askDelete = (id) => {
    setDeleteConfirmId(id);
    clearTimeout(deleteConfirmTimerRef.current);
    deleteConfirmTimerRef.current = setTimeout(() => {
      setDeleteConfirmId(null);
    }, 4000);
  };

  const cancelDelete = () => {
    clearTimeout(deleteConfirmTimerRef.current);
    setDeleteConfirmId(null);
  };
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

  const allPrograms = programs || [...PRESET_PROGRAMS];

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
      toast('Lütfen program adı girin.', 'error');
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
    <div className="sheet-overlay" onClick={animateClose}>
      <div
        className="sheet-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : isClosing ? 'transform 0.26s ease-in' : 'transform 0.3s ease'
        }}
      >
        <div
          className="sheet-grabber"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="sheet-grabber-handle" />
        </div>
        <div className="sheet-content" style={{ maxHeight: 'calc(90vh - 36px)', overflowY: 'auto' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#3B82F6" /> Antrenman Programı Seç & Oluştur
          </h2>
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
              color: activeTab === 'presets' ? '#3B82F6' : 'var(--text-sub)',
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
                    border: isActive ? '1px solid #3B82F6' : '1px solid var(--border)',
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
                          <span style={{ background: 'var(--surface-alt)', color: '#3B82F6', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
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
                      {deleteConfirmId === prog.id ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            borderRadius: '8px',
                            padding: '4px 6px'
                          }}
                        >
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#F87171', whiteSpace: 'nowrap' }}>
                            Emin misin?
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              cancelDelete();
                              if (prog.isCustom) {
                                onDeleteCustomProgram(prog.id);
                              } else {
                                onDeletePresetProgram(prog.id);
                              }
                            }}
                            style={{
                              background: '#EF4444',
                              color: '#fff',
                              border: 'none',
                              height: '26px',
                              padding: '0 10px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Sil
                          </button>
                          <button
                            type="button"
                            onClick={cancelDelete}
                            style={{
                              background: 'var(--surface-alt)',
                              color: 'var(--text-main)',
                              border: 'none',
                              height: '26px',
                              padding: '0 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Vazgeç
                          </button>
                        </div>
                      ) : (
                        <>
                          {prog.isCustom ? (
                            <button
                              type="button"
                              onClick={() => askDelete(prog.id)}
                              title={`"${prog.name}" programını sil`}
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
                          ) : (
                            <button
                              type="button"
                              onClick={() => askDelete(prog.id)}
                              title={`"${prog.name}" hazır programını kaldır`}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#6E7683',
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
                                background: '#3B82F6',
                                color: '#fff',
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
                        </>
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
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase' }}>
                        Günlük Antrenman Dağılımı:
                      </div>
                      {prog.days.map((day, idx) => {
                        const numMatch = (day.dayName || '').match(/^(\d+)/);
                        const dayNum = numMatch ? numMatch[1] : idx + 1;
                        const weekdayMatch = (day.dayName || '').match(/\(([^)]+)\)/);
                        const weekday = weekdayMatch ? weekdayMatch[1] : '';
                        const isRest = !!day.isRest;
                        return (
                          <div key={day.id || idx} className={`prog-day${isRest ? ' rest' : ''}`}>
                            <div className="prog-day-head">
                              <div className="prog-day-num">{dayNum}</div>
                              <div className="prog-day-body">
                                {weekday && (
                                  <div className="prog-day-name">{weekday}</div>
                                )}
                                <div className="prog-day-title">{day.title}</div>
                              </div>
                              <div className="prog-day-badge">
                                {isRest ? 'Dinlenme' : `${day.exercises?.length || 0} Hareket`}
                              </div>
                            </div>
                            {!isRest && (day.focus?.length > 0 || day.exercises?.length > 0) && (
                              <div className="prog-day-tags">
                                {(day.focus || []).slice(0, 5).map((f) => (
                                  <span key={f} className="prog-day-tag">{f}</span>
                                ))}
                              </div>
                            )}
                            {isRest && day.tips && (
                              <div className="prog-day-tips">{day.tips}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'custom' && (<>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {customDays.map((day, dIdx) => {
                const isRest = !!day.isRest;
                return (
                  <button
                    key={day.id}
                    type="button"
                    className={`custom-day-preview${isRest ? ' rest' : ''}`}
                    onClick={() => setEditingDayIdx(dIdx)}
                  >
                    <div className="prog-day-num">{dIdx + 1}</div>
                    <div className="prog-day-body">
                      <div className="prog-day-name">{day.dayName || `GÜN ${dIdx + 1}`}</div>
                      <div className="prog-day-title">{day.title || 'Başlık girin'}</div>
                    </div>
                    <span className="prog-day-badge">
                      {isRest ? 'Dinlenme' : `${(day.exercises || []).length} Hareket`}
                    </span>
                    <span className="custom-day-preview-chevron">
                      <ChevronRight size={16} />
                    </span>
                  </button>
                );
              })}
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

          {editingDayIdx !== null && customDays[editingDayIdx] && (
            (() => {
              const day = customDays[editingDayIdx];
              const dIdx = editingDayIdx;
              const isRest = !!day.isRest;
              return (
                <div
                  className="prog-editor-overlay"
                  onClick={() => {
                    setEditingDayIdx(null);
                    setDayDeleteConfirm(false);
                  }}
                >
                  <div className="prog-editor-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="prog-editor-grabber">
                      <div className="prog-editor-grabber-handle" />
                    </div>
                    <div className="prog-editor-header">
                      <button
                        type="button"
                        className="prog-editor-header-btn"
                        onClick={() => {
                          setEditingDayIdx(null);
                          setDayDeleteConfirm(false);
                        }}
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <div className="prog-editor-header-title">GÜN {dIdx + 1} DÜZENLE</div>
                      <button
                        type="button"
                        className="prog-editor-header-btn"
                        onClick={() => {
                          setEditingDayIdx(null);
                          setDayDeleteConfirm(false);
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="prog-editor-body">
                      <div>
                        <div className="prog-editor-section-label">Gün Adı</div>
                        <input
                          className="prog-editor-main-input"
                          type="text"
                          value={day.dayName}
                          onChange={(e) => handleDayChange(dIdx, 'dayName', e.target.value)}
                          placeholder="1. GÜN"
                        />
                      </div>
                      <div>
                        <div className="prog-editor-section-label">Başlık</div>
                        <input
                          className="prog-editor-main-input"
                          type="text"
                          value={day.title}
                          onChange={(e) => handleDayChange(dIdx, 'title', e.target.value)}
                          placeholder="Örn: Göğüs + Kol"
                        />
                      </div>

                      <label className="prog-editor-toggle">
                        <input
                          type="checkbox"
                          checked={isRest}
                          onChange={(e) => handleDayChange(dIdx, 'isRest', e.target.checked)}
                        />
                        <span className="prog-editor-switch" />
                        <span className="prog-editor-toggle-text">
                          {isRest ? 'Dinlenme Günü (aktif)' : 'Dinlenme Günü olarak işaretle'}
                        </span>
                      </label>

                      {isRest ? (
                        <div>
                          <div className="prog-editor-section-label">Dinlenme Tavsiyesi</div>
                          <input
                            className="prog-editor-main-input"
                            type="text"
                            value={day.tips || ''}
                            onChange={(e) => handleDayChange(dIdx, 'tips', e.target.value)}
                            placeholder="Örn: Kas onarımı için dinlenme günü."
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div className="prog-editor-section-label">Hareketler</div>
                          {(day.exercises || []).map((ex, eIdx) => (
                            <div key={ex.id || eIdx} className="prog-ex-row">
                              <div className="prog-ex-idx">{eIdx + 1}</div>
                              <input
                                className="prog-ex-name"
                                type="text"
                                placeholder="Hareket Adı"
                                value={ex.name}
                                onChange={(e) => handleExerciseChange(dIdx, eIdx, 'name', e.target.value)}
                                required
                              />
                              <div className="prog-ex-meta">
                                <span className="prog-ex-meta-label">SET</span>
                                <input
                                  className="prog-ex-input"
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={ex.defaultSets}
                                  onChange={(e) => handleExerciseChange(dIdx, eIdx, 'defaultSets', e.target.value)}
                                />
                              </div>
                              <div className="prog-ex-meta">
                                <span className="prog-ex-meta-label">TEKRAR</span>
                                <input
                                  className="prog-ex-input"
                                  type="text"
                                  placeholder="8-10"
                                  value={ex.targetReps}
                                  onChange={(e) => handleExerciseChange(dIdx, eIdx, 'targetReps', e.target.value)}
                                />
                              </div>
                              <button
                                type="button"
                                className="prog-ex-del"
                                onClick={() => handleRemoveExercise(dIdx, eIdx)}
                                title="Hareketi kaldır"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          {(day.exercises || []).length === 0 && (
                            <div className="prog-editor-empty">Henüz hareket eklenmedi.</div>
                          )}
                          <button type="button" className="prog-ex-add" onClick={() => handleAddExercise(dIdx)}>
                            <Plus size={12} /> Hareketi Ekle
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="prog-editor-footer">
                      {dayDeleteConfirm ? (
                        <div className="prog-editor-delete-confirm">
                          <span>Bu günü silmek istediğinize emin misiniz?</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              style={{ background: '#EF4444', color: '#fff' }}
                              onClick={() => {
                                handleRemoveDay(dIdx);
                                setDayDeleteConfirm(false);
                                setEditingDayIdx(null);
                              }}
                            >
                              Sil
                            </button>
                            <button
                              type="button"
                              style={{ background: 'var(--surface-alt)', color: 'var(--text-main)' }}
                              onClick={() => setDayDeleteConfirm(false)}
                            >
                              Vazgeç
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="prog-editor-delete"
                          onClick={() => setDayDeleteConfirm(true)}
                          disabled={customDays.length <= 1}
                        >
                          <Trash2 size={14} /> Günü Sil
                        </button>
                      )}
                      <button
                        type="button"
                        className="prog-editor-save"
                        onClick={() => {
                          setEditingDayIdx(null);
                          setDayDeleteConfirm(false);
                        }}
                      >
                        <Check size={16} /> GÜNÜ KAYDET
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </>)}
        </div>
      </div>
    </div>
  );
}
