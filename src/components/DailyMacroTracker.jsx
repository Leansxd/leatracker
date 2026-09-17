import React, { useState } from 'react';
import { Droplets, Flame, Activity, CheckSquare, Square, Plus, Minus, Trash2 } from 'lucide-react';
import AddFoodModal from './AddFoodModal';

export default function DailyMacroTracker({ dailyLog, onUpdateDailyLog, profile }) {
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);

  const water = dailyLog?.water || 0;
  const meals = dailyLog?.meals || [];
  const tookCreatine = !!dailyLog?.tookCreatine;
  const tookPreworkout = !!dailyLog?.tookPreworkout;

  // Calculate total macros from logged meals
  const totalCaloriesFromMeals = meals.reduce((acc, item) => acc + (Number(item.calories) || 0), 0);
  const totalProteinFromMeals = meals.reduce((acc, item) => acc + (Number(item.protein) || 0), 0);

  // If user entered manual calories/protein, fallback to max of manual or meal sum
  const calories = Math.max(dailyLog?.calories || 0, totalCaloriesFromMeals);
  const protein = Math.max(dailyLog?.protein || 0, totalProteinFromMeals);

  const calPct = Math.min(100, Math.round((calories / (profile.targetCalories || 2550)) * 100));
  const protPct = Math.min(100, Math.round((protein / (profile.targetProtein || 130)) * 100));

  const handleWater = (delta) => {
    const newVal = Math.max(0, parseFloat((water + delta).toFixed(1)));
    onUpdateDailyLog({ water: newVal });
  };

  const handleAddFood = (foodItem) => {
    const updatedMeals = [...meals, foodItem];
    const newCalSum = updatedMeals.reduce((a, b) => a + Number(b.calories), 0);
    const newProtSum = updatedMeals.reduce((a, b) => a + Number(b.protein), 0);

    onUpdateDailyLog({
      meals: updatedMeals,
      calories: newCalSum,
      protein: newProtSum
    });
  };

  const handleRemoveFood = (foodId) => {
    const updatedMeals = meals.filter((m) => m.id !== foodId);
    const newCalSum = updatedMeals.reduce((a, b) => a + Number(b.calories), 0);
    const newProtSum = updatedMeals.reduce((a, b) => a + Number(b.protein), 0);

    onUpdateDailyLog({
      meals: updatedMeals,
      calories: newCalSum,
      protein: newProtSum
    });
  };

  const toggleCreatine = () => onUpdateDailyLog({ tookCreatine: !tookCreatine });
  const togglePreworkout = () => onUpdateDailyLog({ tookPreworkout: !tookPreworkout });

  return (
    <div className="glass-panel" style={{ padding: '16px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={18} color="#F59E0B" /> Beslenme & Takviye Takibi
        </h3>
        <button
          onClick={() => setIsAddFoodOpen(true)}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#60A5FA',
            padding: '7px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '0.76rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={14} /> Besin / Öğün Ekle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div style={{
          background: 'var(--surface-alt)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '3px', textTransform: 'uppercase' }}>
            <Droplets size={12} color="#3B82F6" /> Su (L)
          </div>
          <div style={{ color: '#60A5FA', margin: '4px 0', fontSize: '0.88rem', fontWeight: 800 }}>
            {water} / {profile.targetWater} L
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
            <button onClick={() => handleWater(-0.5)} className="btn-timer-opt" style={{ padding: '2px 8px', borderRadius: '6px' }}><Minus size={10} /></button>
            <button onClick={() => handleWater(0.5)} className="btn-timer-opt" style={{ padding: '2px 8px', borderRadius: '6px' }}><Plus size={10} /></button>
          </div>
        </div>

        <button
          onClick={toggleCreatine}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 8px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${tookCreatine ? '#10B981' : 'var(--border-subtle)'}`,
            background: tookCreatine ? 'rgba(16, 185, 129, 0.18)' : 'var(--surface-alt)',
            color: tookCreatine ? '#34D399' : 'var(--text-sub)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {tookCreatine ? <CheckSquare size={16} style={{ marginBottom: '4px' }} /> : <Square size={16} style={{ marginBottom: '4px' }} />}
          Kreatin (5g)
        </button>

        <button
          onClick={togglePreworkout}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 8px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${tookPreworkout ? '#6366F1' : 'var(--border-subtle)'}`,
            background: tookPreworkout ? 'rgba(99, 102, 241, 0.18)' : 'var(--surface-alt)',
            color: tookPreworkout ? '#A5B4FC' : 'var(--text-sub)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {tookPreworkout ? <CheckSquare size={16} style={{ marginBottom: '4px' }} /> : <Square size={16} style={{ marginBottom: '4px' }} />}
          Pre-Workout
        </button>
      </div>

      {meals.length > 0 && (
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Öğünler ({meals.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {meals.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '0.66rem', padding: '3px 8px', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.18)', color: '#60A5FA', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {item.meal}
                  </span>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.76rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>{item.calories} kcal</span>
                    <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>•</span>
                    <span style={{ color: '#34D399', fontWeight: 700 }}>{item.protein}g P</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFood(item.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAddFoodOpen && (
        <AddFoodModal
          onAddFood={handleAddFood}
          onClose={() => setIsAddFoodOpen(false)}
        />
      )}
    </div>
  );
}
