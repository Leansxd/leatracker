import React, { useState } from 'react';
import { Check, Plus, Trash2, Info, Timer, Sparkles, CheckCircle2, Flame, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WARMUP_ROUTINES } from '../data/nutritionPresets';

export default function WorkoutLogger({
  selectedDay,
  workoutData,
  onUpdateWorkout,
  onFinishWorkout,
  onOpenTimer,
  previousLogs
}) {
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [showTipsMap, setShowTipsMap] = useState({});
  const [isWarmupOpen, setIsWarmupOpen] = useState(false);
  const [warmupChecked, setWarmupChecked] = useState({});

  if (selectedDay.isRest) {
    return (
      <div className="card" style={{ padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Sparkles size={28} color="#FAFAFA" />
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FAFAFA' }}>{selectedDay.title}</h2>
        <p style={{ color: '#A1A1AA', fontSize: '0.85rem', marginTop: '8px', lineHeight: 1.5 }}>
          {selectedDay.tips}
        </p>
      </div>
    );
  }

  const toggleTip = (exId) => {
    setShowTipsMap((prev) => ({ ...prev, [exId]: !prev[exId] }));
  };

  const getExerciseSets = (ex) => {
    if (workoutData?.[ex.id] && workoutData[ex.id].length > 0) {
      return workoutData[ex.id];
    }
    const defaultCount = ex.defaultSets || 3;
    const initialWeight = ex.suggestedWeight && ex.suggestedWeight.includes('kg') ? parseInt(ex.suggestedWeight) || 10 : 10;
    const initialReps = parseInt(ex.targetReps?.split('-')[0]) || 10;
    return Array.from({ length: defaultCount }, () => ({
      weight: initialWeight,
      reps: initialReps,
      completed: false
    }));
  };

  const handleSetChange = (ex, setIndex, field, value) => {
    const exData = getExerciseSets(ex);

    const updatedSets = exData.map((s, idx) => {
      if (idx === setIndex) {
        return {
          ...s,
          [field]: field === 'completed' ? value : (value === '' ? '' : Number(value) || value)
        };
      }
      return s;
    });

    onUpdateWorkout(selectedDay.id, ex.id, updatedSets);
  };

  const addSet = (ex) => {
    const exData = getExerciseSets(ex);
    const lastSet = exData[exData.length - 1] || { weight: 10, reps: 10, completed: false };

    const newSets = [...exData, { weight: lastSet.weight, reps: lastSet.reps, completed: false }];
    onUpdateWorkout(selectedDay.id, ex.id, newSets);
  };

  const removeSet = (ex) => {
    const exData = getExerciseSets(ex);
    if (exData.length <= 1) return;
    const newSets = exData.slice(0, exData.length - 1);
    onUpdateWorkout(selectedDay.id, ex.id, newSets);
  };

  const toggleWarmupCheck = (idx) => {
    setWarmupChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFinish = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    onFinishWorkout(selectedDay, workoutNotes);
  };

  let totalSetsCount = 0;
  let completedSetsCount = 0;
  let totalVolumeKg = 0;

  selectedDay.exercises.forEach((ex) => {
    const sets = getExerciseSets(ex);
    sets.forEach((s) => {
      totalSetsCount++;
      if (s.completed) {
        completedSetsCount++;
        totalVolumeKg += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    });
  });

  const warmupItems = WARMUP_ROUTINES[selectedDay.id] || [
    { name: "Genel Omuz Isınması", sets: "2 Set x 15 Tekrar", weight: "2 kg" },
    { name: "Hafif Set Alıştırması", sets: "1 Set x 15 Tekrar", weight: "4 kg" }
  ];

  return (
    <div>
      {/* Day Title Header */}
      <div className="card" style={{ padding: '12px 14px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#A1A1AA', letterSpacing: '0.5px' }}>
              {selectedDay.dayName}
            </span>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#FAFAFA', marginTop: '2px' }}>
              {selectedDay.title}
            </h2>
          </div>
          <button
            onClick={onOpenTimer}
            className="btn-timer-opt"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'var(--bg-card-alt)', borderColor: 'var(--border-color)', color: '#FAFAFA' }}
          >
            <Timer size={14} /> Sayaç
          </button>
        </div>
      </div>

      {/* Isınma Kartı (Accordion) */}
      <div className="card" style={{ padding: '12px 14px', marginBottom: '10px' }}>
        <div
          onClick={() => setIsWarmupOpen(!isWarmupOpen)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} color="#10B981" />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FAFAFA' }}>
              Isınma & Mobilite (2-4 kg)
            </h3>
          </div>
          {isWarmupOpen ? <ChevronUp size={16} color="#71717A" /> : <ChevronDown size={16} color="#71717A" />}
        </div>

        {isWarmupOpen && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {warmupItems.map((item, idx) => {
              const isChecked = !!warmupChecked[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleWarmupCheck(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '6px 8px',
                    background: 'var(--bg-black)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isChecked ? <CheckSquare size={14} color="#10B981" /> : <Square size={14} color="#71717A" />}
                    <span style={{ fontSize: '0.78rem', color: isChecked ? '#10B981' : '#FAFAFA', fontWeight: 600 }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#71717A' }}>
                    {item.sets} ({item.weight})
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDay.exercises.map((ex, exIdx) => {
        const sets = getExerciseSets(ex);
        const isTipOpen = !!showTipsMap[ex.id];

        let lastWorkoutRecord = null;
        if (previousLogs && previousLogs.length > 0) {
          for (const log of previousLogs) {
            if (log.workoutData?.[ex.id]) {
              lastWorkoutRecord = log.workoutData[ex.id];
              break;
            }
          }
        }

        return (
          <div key={ex.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#A1A1AA', fontWeight: 800, fontSize: '0.82rem' }}>#{exIdx + 1}</span>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FAFAFA' }}>{ex.name}</h3>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '2px' }}>
                  Hedef: <strong style={{ color: '#FAFAFA' }}>{ex.defaultSets} × {ex.targetReps}</strong>
                </div>
              </div>

              <button
                onClick={() => toggleTip(ex.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isTipOpen ? '#FAFAFA' : '#71717A',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <Info size={16} />
              </button>
            </div>

            {isTipOpen && (
              <div style={{ background: 'var(--bg-black)', borderLeft: '2px solid #FAFAFA', padding: '8px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#A1A1AA', marginBottom: '8px' }}>
                {ex.tips}
              </div>
            )}

            {lastWorkoutRecord && (
              <div style={{ fontSize: '0.7rem', color: '#71717A', marginBottom: '8px' }}>
                Önceki: {lastWorkoutRecord.map(s => `${s.weight}kg × ${s.reps}`).join(' | ')}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 40px', gap: '8px', marginBottom: '4px', fontSize: '0.68rem', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', paddingLeft: '4px', paddingRight: '4px' }}>
              <div style={{ textAlign: 'center' }}>Set</div>
              <div style={{ textAlign: 'center' }}>Ağırlık</div>
              <div style={{ textAlign: 'center' }}>Tekrar</div>
              <div style={{ textAlign: 'center' }}>Durum</div>
            </div>

            {sets.map((set, setIdx) => (
              <div key={setIdx} className={`set-row ${set.completed ? 'done' : ''}`}>
                <div className="set-num">{setIdx + 1}</div>

                <div className="input-box">
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight}
                    onChange={(e) => handleSetChange(ex, setIdx, 'weight', e.target.value)}
                    className="input-field"
                  />
                  <span className="input-suffix">kg</span>
                </div>

                <div className="input-box">
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetChange(ex, setIdx, 'reps', e.target.value)}
                    className="input-field"
                  />
                  <span className="input-suffix">tekrar</span>
                </div>

                <button
                  onClick={() => {
                    const newStatus = !set.completed;
                    handleSetChange(ex, setIdx, 'completed', newStatus);
                    if (newStatus) onOpenTimer();
                  }}
                  className={`check-btn ${set.completed ? 'checked' : ''}`}
                >
                  <Check size={16} />
                </button>
              </div>
            ))}

            <div className="set-controls-row">
              <button onClick={() => addSet(ex)} className="add-set-btn">
                <Plus size={12} /> Set Ekle
              </button>
              {sets.length > 1 && (
                <button onClick={() => removeSet(ex)} className="remove-set-btn">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Completion Card */}
      <div className="card">
        <h3 className="card-title">Antrenman Özeti</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div className="stat-box">
            <div className="stat-box-val">{completedSetsCount} / {totalSetsCount}</div>
            <div className="stat-box-lbl">Tamamlanan Set</div>
          </div>
          <div className="stat-box">
            <div className="stat-box-val" style={{ color: '#10B981' }}>{totalVolumeKg} kg</div>
            <div className="stat-box-lbl">Toplam Hacim</div>
          </div>
        </div>

        <textarea
          placeholder="Not yaz..."
          value={workoutNotes}
          onChange={(e) => setWorkoutNotes(e.target.value)}
          rows={2}
          style={{
            width: '100%',
            background: 'var(--bg-black)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '8px',
            color: '#FAFAFA',
            fontSize: '0.8rem',
            resize: 'none',
            outline: 'none'
          }}
        />

        <button onClick={handleFinish} className="primary-btn">
          <CheckCircle2 size={18} /> ANTRENMANI KAYDET & TAMAMLA
        </button>
      </div>
    </div>
  );
}
