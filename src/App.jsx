import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PRESET_PROGRAMS } from './data/programPresets';
import WorkoutLogger from './components/WorkoutLogger';
import HistoryAnalytics from './components/HistoryAnalytics';
import ProfileModal from './components/ProfileModal';
import ProgramManagerModal from './components/ProgramManagerModal';
import RestTimer from './components/RestTimer';
import DailyMacroTracker from './components/DailyMacroTracker';
import WeightChart from './components/WeightChart';
import { Dumbbell, History, Settings, Scale, Utensils, ChevronLeft, ChevronRight, Calendar, Plus, Check, Layers, User } from 'lucide-react';

const STORAGE_KEY_PROFILES = 'letracker_profiles_v3';
const STORAGE_KEY_ACTIVE_PROFILE = 'letracker_active_profile_v3';
const STORAGE_KEY_CUSTOM_PROGRAMS = 'letracker_custom_programs_v3';
const STORAGE_KEY_ACTIVE_PROGRAM = 'letracker_active_program_v3';
const STORAGE_KEY_DAILY_DATA = 'letracker_daily_data_v2';
const STORAGE_KEY_LOGS = 'letracker_logs_v2';

const DEFAULT_PROFILES = [
  {
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
  }
];

export default function App() {
  const getTodayStr = useCallback(() => new Date().toISOString().split('T')[0], []);

  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
    return saved || 'profile_default';
  });

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];
  }, [profiles, activeProfileId]);

  const [customPrograms, setCustomPrograms] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_PROGRAMS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProgramId, setActiveProgramId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PROGRAM);
    return saved || 'preset_chest_back_arms';
  });

  const allPrograms = useMemo(() => {
    return [...PRESET_PROGRAMS, ...customPrograms];
  }, [customPrograms]);

  const activeProgram = useMemo(() => {
    return allPrograms.find((p) => p.id === activeProgramId) || PRESET_PROGRAMS[0];
  }, [allPrograms, activeProgramId]);

  const activeDays = useMemo(() => {
    return activeProgram.days || PRESET_PROGRAMS[0].days;
  }, [activeProgram]);

  const [dailyDataMap, setDailyDataMap] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DAILY_DATA);
    return saved ? JSON.parse(saved) : {};
  });

  const [logsHistory, setLogsHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('workout');
  const [selectedDayId, setSelectedDayId] = useState(() => {
    return activeDays[0]?.id || 'day1';
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState('');
  const [weightSavedFeedback, setWeightSavedFeedback] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE, activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PROGRAMS, JSON.stringify(customPrograms));
  }, [customPrograms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROGRAM, activeProgramId);
  }, [activeProgramId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DAILY_DATA, JSON.stringify(dailyDataMap));
  }, [dailyDataMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logsHistory));
  }, [logsHistory]);

  useEffect(() => {
    if (!activeDays.some((d) => d.id === selectedDayId)) {
      setSelectedDayId(activeDays[0]?.id || 'day1');
    }
  }, [activeDays, selectedDayId]);

  const currentDayData = useMemo(() => {
    return dailyDataMap[selectedDate] || {
      workoutData: {},
      weight: activeProfile.weight,
      water: 0,
      calories: 0,
      protein: 0,
      meals: [],
      tookCreatine: false,
      tookPreworkout: false,
      notes: ''
    };
  }, [dailyDataMap, selectedDate, activeProfile.weight]);

  const shiftDate = useCallback((days) => {
    setSelectedDate((prevDate) => {
      const d = new Date(prevDate);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const formatDateDisplay = useCallback((dateStr) => {
    const today = getTodayStr();
    const d = new Date(dateStr);
    const formatted = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'short' });
    if (dateStr === today) return `${formatted} (Bugün)`;
    return formatted;
  }, [getTodayStr]);

  const handleUpdateWorkout = useCallback((dayId, exId, newSets) => {
    setDailyDataMap((prev) => {
      const dayRecord = prev[selectedDate] || {};
      return {
        ...prev,
        [selectedDate]: {
          ...dayRecord,
          workoutData: {
            ...(dayRecord.workoutData || {}),
            [exId]: newSets
          }
        }
      };
    });
  }, [selectedDate]);

  const handleUpdateDailyLog = useCallback((updates) => {
    setDailyDataMap((prev) => {
      const dayRecord = prev[selectedDate] || {};
      return {
        ...prev,
        [selectedDate]: {
          ...dayRecord,
          ...updates
        }
      };
    });
  }, [selectedDate]);

  const handleSaveWeight = (e) => {
    e.preventDefault();
    const wNum = Number(inputWeight);
    if (!wNum || wNum <= 0) return;

    handleUpdateDailyLog({ weight: wNum });
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, weight: wNum } : p))
    );
    setInputWeight('');
    setWeightSavedFeedback(true);
    setTimeout(() => setWeightSavedFeedback(false), 2000);
  };

  const handleFinishWorkout = useCallback((day, notes) => {
    const workoutData = currentDayData.workoutData || {};
    let totalVolumeKg = 0;
    let completedSetsCount = 0;

    (day.exercises || []).forEach((ex) => {
      const sets = workoutData[ex.id] || [];
      sets.forEach((s) => {
        if (s.completed) {
          completedSetsCount++;
          totalVolumeKg += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });

    const newLog = {
      id: Date.now(),
      dateStr: formatDateDisplay(selectedDate),
      date: selectedDate,
      timestamp: Date.now(),
      programName: activeProgram.name,
      dayId: day.id,
      dayName: day.dayName,
      title: day.title,
      totalVolumeKg,
      completedSetsCount,
      notes,
      workoutData
    };

    setLogsHistory((prev) => [newLog, ...prev]);
    alert(`🎉 ${formatDateDisplay(selectedDate)} antrenmanı başarıyla kaydedildi!`);
  }, [currentDayData.workoutData, formatDateDisplay, selectedDate, activeProgram.name]);

  const selectedDay = useMemo(() => {
    return activeDays.find((d) => d.id === selectedDayId) || activeDays[0];
  }, [activeDays, selectedDayId]);

  const weightLogsForChart = useMemo(() => {
    return Object.keys(dailyDataMap)
      .filter((date) => dailyDataMap[date].weight)
      .map((date) => ({ date, weight: dailyDataMap[date].weight }));
  }, [dailyDataMap]);

  const handleSaveProfile = (savedProfile) => {
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === savedProfile.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProfile.id ? savedProfile : p));
      }
      return [...prev, savedProfile];
    });
  };

  const handleDeleteProfile = (profileId) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);
    if (activeProfileId === profileId) {
      setActiveProfileId(remaining[0].id);
    }
  };

  const handleSaveCustomProgram = (newProg) => {
    setCustomPrograms((prev) => {
      const filtered = prev.filter((p) => p.id !== newProg.id);
      return [newProg, ...filtered];
    });
  };

  const handleDeleteCustomProgram = (progId) => {
    setCustomPrograms((prev) => prev.filter((p) => p.id !== progId));
    if (activeProgramId === progId) {
      setActiveProgramId('preset_chest_back_arms');
    }
  };

  const handleApplyRecommendedProgram = (recProgramId) => {
    setActiveProgramId(recProgramId);
    alert('🎯 Profilinize en uygun antrenman programı seçildi ve hedefleriniz güncellendi!');
  };

  return (
    <div className="app-container">
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="brand">
            <Dumbbell size={18} color="#38BDF8" /> LETRACKER
          </div>
          <button
            onClick={() => setIsProgramModalOpen(true)}
            style={{
              background: 'linear-gradient(145deg, #18181B, #27272A)',
              border: '1px solid var(--border-subtle)',
              color: '#38BDF8',
              padding: '4px 10px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}
          >
            <Layers size={13} /> {activeProgram.name.split('(')[0].trim()}
          </button>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: '#FAFAFA',
            padding: '5px 10px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <User size={13} color="#38BDF8" /> {activeProfile.name}
        </button>
      </header>

      <div className="date-bar">
        <button onClick={() => shiftDate(-1)} className="date-btn">
          <ChevronLeft size={20} />
        </button>

        <div className="date-display">
          <Calendar size={15} color="#A1A1AA" />
          <span>{formatDateDisplay(selectedDate)}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {selectedDate !== getTodayStr() && (
            <button
              onClick={() => setSelectedDate(getTodayStr())}
              style={{ background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', color: '#FAFAFA', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Bugün
            </button>
          )}
          <button onClick={() => shiftDate(1)} className="date-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {activeTab === 'workout' && (
        <>
          <div className="day-selector-scroll">
            {activeDays.map((day) => (
              <div
                key={day.id}
                className={`day-pill ${selectedDayId === day.id ? 'active' : ''}`}
                onClick={() => setSelectedDayId(day.id)}
              >
                {day.dayName.split(' ')[0]} {day.dayName.split(' ')[1] || ''}
              </div>
            ))}
          </div>

          <WorkoutLogger
            selectedDay={selectedDay}
            workoutData={currentDayData.workoutData || {}}
            onUpdateWorkout={handleUpdateWorkout}
            onFinishWorkout={handleFinishWorkout}
            onOpenTimer={() => setIsTimerOpen(true)}
            previousLogs={logsHistory}
          />
        </>
      )}

      {activeTab === 'nutrition' && (
        <DailyMacroTracker
          dailyLog={currentDayData}
          onUpdateDailyLog={handleUpdateDailyLog}
          profile={activeProfile}
        />
      )}

      {activeTab === 'weight' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <form
            onSubmit={handleSaveWeight}
            className="card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={16} color="#38BDF8" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FAFAFA' }}>
                {selectedDate} Kilosu:
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="input-box" style={{ width: '80px' }}>
                <input
                  type="number"
                  step="0.1"
                  placeholder={currentDayData.weight || activeProfile.weight}
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: weightSavedFeedback ? '#10B981' : 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  color: '#FAFAFA',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {weightSavedFeedback ? <Check size={14} /> : <Plus size={14} />}
                {weightSavedFeedback ? 'Kaydedildi' : 'Kaydet'}
              </button>
            </div>
          </form>

          <div className="card">
            <h3 className="card-title">
              <span><Scale size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Kilo Gelişim Grafiği</span>
            </h3>
            <WeightChart weightLogs={weightLogsForChart} />
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <HistoryAnalytics
          logs={logsHistory}
          weightLogs={weightLogsForChart}
          onDeleteLog={(id) => setLogsHistory((prev) => prev.filter((l) => l.id !== id))}
          onExportData={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profiles, activeProfileId, customPrograms, activeProgramId, dailyDataMap, logsHistory }, null, 2));
            const anchor = document.createElement('a');
            anchor.setAttribute("href", dataStr);
            anchor.setAttribute("download", `fitness_yedek.json`);
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
          }}
          onImportData={(e) => {
            const reader = new FileReader();
            if (e.target.files[0]) {
              reader.readAsText(e.target.files[0], "UTF-8");
              reader.onload = (evt) => {
                try {
                  const p = JSON.parse(evt.target.result);
                  if (p.profiles) setProfiles(p.profiles);
                  if (p.activeProfileId) setActiveProfileId(p.activeProfileId);
                  if (p.customPrograms) setCustomPrograms(p.customPrograms);
                  if (p.activeProgramId) setActiveProgramId(p.activeProgramId);
                  if (p.dailyDataMap) setDailyDataMap(p.dailyDataMap);
                  if (p.logsHistory) setLogsHistory(p.logsHistory);
                  alert('✅ Veriler başarıyla yüklendi!');
                } catch (err) {
                  alert('❌ Geçersiz yedek dosyası!');
                }
              };
            }
          }}
        />
      )}

      <RestTimer
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {isProfileModalOpen && (
        <ProfileModal
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSelectProfile={setActiveProfileId}
          onSaveProfile={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
          onApplyRecommendedProgram={handleApplyRecommendedProgram}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isProgramModalOpen && (
        <ProgramManagerModal
          activeProgramId={activeProgramId}
          customPrograms={customPrograms}
          onSelectProgram={setActiveProgramId}
          onSaveCustomProgram={handleSaveCustomProgram}
          onDeleteCustomProgram={handleDeleteCustomProgram}
          onClose={() => setIsProgramModalOpen(false)}
        />
      )}

      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          <Dumbbell size={18} /> İdman
        </button>
        <button
          className={`bottom-nav-item ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <Utensils size={18} /> Beslenme
        </button>
        <button
          className={`bottom-nav-item ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('weight')}
        >
          <Scale size={18} /> Tartı
        </button>
        <button
          className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} /> Geçmiş
        </button>
      </nav>
    </div>
  );
}
