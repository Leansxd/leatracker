import React, { useState } from 'react';
import { X, Save, User, Scale, Flame, Activity, Droplets, Sparkles, Plus, Trash2, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { calculateProfileRecommendations } from '../data/programPresets';

export default function ProfileModal({
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  onApplyRecommendedProgram,
  onClose
}) {
  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
    id: 'profile_default',
    name: 'Ana Profil',
    weight: 67,
    height: 173,
    age: 24,
    gender: 'male',
    goal: 'hypertrophy',
    daysPerWeek: 4,
    targetCalories: 2550,
    targetProtein: 130,
    targetWater: 3.0
  };

  const [formData, setFormData] = useState({ ...currentProfile });
  const [recommendation, setRecommendation] = useState(null);

  const handleSelectProfileTab = (prof) => {
    onSelectProfile(prof.id);
    setFormData({ ...prof });
    setRecommendation(null);
  };

  const handleAddNewProfile = () => {
    const newId = `prof_${Date.now()}`;
    const newProf = {
      id: newId,
      name: `Profil ${profiles.length + 1}`,
      weight: 70,
      height: 175,
      age: 25,
      gender: 'male',
      goal: 'hypertrophy',
      daysPerWeek: 4,
      targetCalories: 2600,
      targetProtein: 140,
      targetWater: 3.0
    };
    onSaveProfile(newProf);
    onSelectProfile(newId);
    setFormData({ ...newProf });
    setRecommendation(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : (name === 'name' || name === 'gender' || name === 'goal' ? value : Number(value) || value)
    }));
  };

  const handleCalculateSmart = () => {
    const rec = calculateProfileRecommendations(formData);
    setRecommendation(rec);
    setFormData((prev) => ({
      ...prev,
      targetCalories: rec.targetCalories,
      targetProtein: rec.targetProtein,
      targetWater: rec.targetWater
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    if (recommendation && recommendation.recommendedProgramId) {
      onApplyRecommendedProgram(recommendation.recommendedProgramId);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '490px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#38BDF8" /> Çoklu Profil & Akıllı Hedefler
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
          {profiles.map((p) => {
            const isSelected = p.id === formData.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelectProfileTab(p)}
                style={{
                  background: isSelected ? 'var(--surface-alt)' : 'var(--surface)',
                  border: isSelected ? '1px solid #38BDF8' : '1px solid var(--border)',
                  color: isSelected ? '#38BDF8' : 'var(--text-sub)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{p.name}</span>
                {profiles.length > 1 && isSelected && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`"${p.name}" profilini silmek istediğinize emin misiniz?`)) {
                        onDeleteProfile(p.id);
                      }
                    }}
                    style={{ color: '#EF4444', marginLeft: '4px', cursor: 'pointer' }}
                  >
                    ×
                  </span>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddNewProfile}
            style={{
              background: 'transparent',
              border: '1px dashed var(--border-subtle)',
              color: '#10B981',
              padding: '6px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={14} /> Yeni Profil
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Profil Adı
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="input-field"
              style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Scale size={13} color="#38BDF8" /> Kilo (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Activity size={13} color="#38BDF8" /> Boy (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Yaş
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || 25}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Cinsiyet
              </label>
              <select
                name="gender"
                value={formData.gender || 'male'}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
              >
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Ana Fitness Hedefi
              </label>
              <select
                name="goal"
                value={formData.goal || 'hypertrophy'}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
              >
                <option value="hypertrophy">Hacim & Hipertrofi (Bulk)</option>
                <option value="cut">Yağ Yakımı & Parçalama (Cut)</option>
                <option value="strength">Güç & Kuvvet (Power)</option>
                <option value="maintenance">Kilo & Form Koruma</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Haftalık Gün
              </label>
              <select
                name="daysPerWeek"
                value={formData.daysPerWeek || 4}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#FAFAFA' }}
              >
                <option value="3">3 Gün (Full Body)</option>
                <option value="4">4 Gün (Split / Üst-Alt)</option>
                <option value="5">5 Gün (PPL)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculateSmart}
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid #38BDF8',
              color: '#38BDF8',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> Profile Göre Hedef ve Programı Otomatik Hesapla
          </button>

          {recommendation && (
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '10px', fontSize: '0.75rem' }}>
              <div style={{ color: '#38BDF8', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Önerilen Hedefler & Program
              </div>
              <div style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>
                Kalori: <strong>{recommendation.targetCalories} kcal</strong> | Protein: <strong>{recommendation.targetProtein} g</strong> | Su: <strong>{recommendation.targetWater} L</strong>
              </div>
              <div style={{ color: '#10B981', fontWeight: 700, marginTop: '4px' }}>
                Kaydettiğinizde profilinize en uygun antrenman programı da otomatik aktif edilecektir.
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '4px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                Kalori (kcal)
              </label>
              <input
                type="number"
                name="targetCalories"
                value={formData.targetCalories}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '6px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: '#FAFAFA' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                Protein (g)
              </label>
              <input
                type="number"
                name="targetProtein"
                value={formData.targetProtein}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '6px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: '#FAFAFA' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-sub)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                Su (Litre)
              </label>
              <input
                type="number"
                step="0.1"
                name="targetWater"
                value={formData.targetWater}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', padding: '6px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: '#FAFAFA' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-btn"
            style={{ marginTop: '8px', padding: '12px', fontSize: '0.85rem' }}
          >
            <Save size={16} /> Profili ve Hedefleri Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
