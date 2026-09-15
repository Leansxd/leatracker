import React, { useState } from 'react';
import { Droplets, Flame, Activity, CheckSquare, Square, Plus, Minus, Utensils, Trash2 } from 'lucide-react';
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
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      {/* Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {/* Kalori Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: '#A1A7B3', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={14} color="#F59E0B" /> Kalori
            </span>
            <strong style={{ color: '#F59E0B' }}>
              {calories} / {profile.targetCalories} kcal ({calPct}%)
            </strong>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${calPct}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Protein Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: '#A1A7B3', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={14} color="#10B981" /> Protein
            </span>
            <strong style={{ color: '#10B981' }}>
              {protein} / {profile.targetProtein} g ({protPct}%)
            </strong>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${protPct}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #3B82F6)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Water & Supplements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {/* Su Tracker */}
        <div className="metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Droplets size={12} color="#3B82F6" /> Su (L)
          </div>
          <div className="metric-value" style={{ color: '#3B82F6', margin: '4px 0', fontSize: '0.85rem' }}>
            {water} / {profile.targetWater} L
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
            <button onClick={() => handleWater(-0.5)} className="btn-timer-opt" style={{ padding: '1px 6px' }}><Minus size={10} /></button>
            <button onClick={() => handleWater(0.5)} className="btn-timer-opt" style={{ padding: '1px 6px' }}><Plus size={10} /></button>
          </div>
        </div>

        {/* Kreatin Toggle */}
        <button
          onClick={toggleCreatine}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            padding: '8px',
            borderRadius: '10px',
            border: `1px solid ${tookCreatine ? '#10B981' : 'var(--border-color)'}`,
            background: tookCreatine ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)',
            color: tookCreatine ? '#10B981' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {tookCreatine ? <CheckSquare size={16} style={{ marginBottom: '2px' }} /> : <Square size={16} style={{ marginBottom: '2px' }} />}
          Kreatin (5g)
        </button>

        {/* Pre-workout Toggle */}
        <button
          onClick={togglePreworkout}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            padding: '8px',
            borderRadius: '10px',
            border: `1px solid ${tookPreworkout ? '#6366F1' : 'var(--border-color)'}`,
            background: tookPreworkout ? 'rgba(179, 136, 255, 0.12)' : 'rgba(15, 23, 42, 0.5)',
            color: tookPreworkout ? '#6366F1' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {tookPreworkout ? <CheckSquare size={16} style={{ marginBottom: '2px' }} /> : <Square size={16} style={{ marginBottom: '2px' }} />}
          Pre-Workout
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F4F6F8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={18} color="#F59E0B" /> Günlük Beslenme & Takviye Takibi
        </h3>
        <button
          onClick={() => setIsAddFoodOpen(true)}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.15))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#3B82F6',
            padding: '6px 12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={14} /> Besin / Öğün Ekle
        </button>
      </div>

      {/* Logged Meals List */}
      {meals.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: '#A1A7B3', fontWeight: 700, marginBottom: '8px' }}>
            🥗 BUGÜN EKLENEN ÖĞÜNLER ({meals.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {meals.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', fontWeight: 700, marginRight: '6px' }}>
                    {item.meal}
                  </span>
                  <strong style={{ fontSize: '0.82rem', color: '#F4F6F8' }}>{item.name}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '0.75rem', textAlign: 'right' }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>{item.calories} kcal</span>
                    <span style={{ color: '#6E7683', margin: '0 4px' }}>•</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>{item.protein}g P</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFood(item.id)}
                    style={{ background: 'transparent', border: 'none', color: '#6E7683', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isAddFoodOpen && (
        <AddFoodModal
          onAddFood={handleAddFood}
          onClose={() => setIsAddFoodOpen(false)}
        />
      )}
    </div>
  );
}
