import React, { useState } from 'react';
import { X, Plus, Utensils, Search } from 'lucide-react';
import { NUTRITION_PRESETS, MEAL_TYPES } from '../data/nutritionPresets';

export default function AddFoodModal({ onAddFood, onClose }) {
  const [selectedMeal, setSelectedMeal] = useState(MEAL_TYPES[0]);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [portion] = useState('1 porsiyon');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectPreset = (item) => {
    setFoodName(`${item.name} (${item.unit})`);
    setCalories(item.calories);
    setProtein(item.protein);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName || calories === '' || protein === '') return;

    onAddFood({
      id: Date.now(),
      meal: selectedMeal,
      name: foodName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      portion
    });
    onClose();
  };

  const filteredPresets = NUTRITION_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F4F6F8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={20} color="#3B82F6" /> Besin / Öğün Ekle
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#A1A7B3', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.78rem', color: '#A1A7B3', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            ÖĞÜN SEÇİMİ
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {MEAL_TYPES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMeal(m)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: `1px solid ${selectedMeal === m ? '#3B82F6' : 'var(--border-color)'}`,
                  background: selectedMeal === m ? 'rgba(59, 130, 246, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedMeal === m ? '#3B82F6' : '#A1A7B3',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.78rem', color: '#A1A7B3', fontWeight: 700, display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '6px', marginBottom: '6px' }}>
            <span>⚡ HIZLI SEÇİM (HAZIR BESİNLER)</span>
          </label>

          <div className="input-group-compact" style={{ marginBottom: '8px' }}>
            <Search size={14} color="#6E7683" />
            <input
              type="text"
              placeholder="Besin ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-compact"
              style={{ textAlign: 'left', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
            {filteredPresets.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item)}
                style={{
                  flex: '0 0 auto',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.7)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F4F6F8' }}>{item.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#3B82F6', marginTop: '2px' }}>
                  {item.calories} kcal • {item.protein}g protein
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#A1A7B3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Besin / Yemek Adı
            </label>
            <input
              type="text"
              placeholder="Örn: Tavuk Göğsü 150g"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="input-group-compact"
              style={{ width: '100%', padding: '10px', color: '#F4F6F8' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#A1A7B3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Kalori (kcal)
              </label>
              <input
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="input-group-compact"
                style={{ width: '100%', padding: '10px', color: '#F59E0B' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#A1A7B3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Protein (gram)
              </label>
              <input
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="input-group-compact"
                style={{ width: '100%', padding: '10px', color: '#10B981' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="finish-workout-btn" style={{ padding: '12px', marginTop: '6px' }}>
            <Plus size={18} /> Öğüne Ekle
          </button>
        </form>
      </div>
    </div>
  );
}
