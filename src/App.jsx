import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PRESET_PROGRAMS } from './data/programPresets';
import WorkoutLogger from './components/WorkoutLogger';
import HistoryAnalytics from './components/HistoryAnalytics';
import ProfileModal from './components/ProfileModal';
import ProgramManagerModal from './components/ProgramManagerModal';
import RestTimer from './components/RestTimer';
import DailyMacroTracker from './components/DailyMacroTracker';
import WeightChart from './components/WeightChart';
import AuthScreen from './components/AuthScreen';
import DrawerMenu from './components/DrawerMenu';
import AIAnalyticsView from './components/AIAnalyticsView';
import { useAuth } from './context/AuthContext';
import { loadUserData, saveUserData } from './services/userData';
import { Dumbbell, History, Scale, Utensils, ChevronLeft, ChevronRight, Calendar, Plus, Check, Layers, User, Menu, Flame, Droplets, Sparkles } from 'lucide-react';

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

const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseLocalDate = (dateStr) => new Date(`${dateStr}T00:00:00`);

const WEEKDAYS_TR = ['PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ'];

const getWeekdayForDate = (dateStr) => {
  const d = parseLocalDate(dateStr);
  return WEEKDAYS_TR[d.getDay()];
};

export default function App() {
  const { user, loading, logout } = useAuth();
  const getTodayStr = useCallback(() => toLocalDateStr(new Date()), []);

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const hydratedRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const userRef = useRef(null);
  const dailyDataMapRef = useRef(dailyDataMap);
  const logsHistoryRef = useRef(logsHistory);

  useEffect(() => {
    dailyDataMapRef.current = dailyDataMap;
  }, [dailyDataMap]);

  useEffect(() => {
    logsHistoryRef.current = logsHistory;
  }, [logsHistory]);

  const getDataSnapshot = () => ({
    profiles,
    activeProfileId,
    customPrograms,
    activeProgramId,
    dailyDataMap,
    logsHistory
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const flushPendingSave = () => {
    if (!userRef.current || !hydratedRef.current) return;
    clearTimeout(saveTimeoutRef.current);
    saveUserData(userRef.current.uid, getDataSnapshot()).catch((err) => {
      console.warn('Firestore veri kaydedilemedi:', err);
    });
  };

  const handleLogout = async () => {
    flushPendingSave();
    await logout();
  };

  useEffect(() => {
    hydratedRef.current = false;
    if (!user) {
      hydratedRef.current = true;
      return undefined;
    }
    if (!loadUserData) return undefined;

    let cancelled = false;
    loadUserData(user.uid)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          if (data.profiles) setProfiles(data.profiles);
          if (data.activeProfileId) setActiveProfileId(data.activeProfileId);
          if (data.customPrograms) setCustomPrograms(data.customPrograms);
          if (data.activeProgramId) setActiveProgramId(data.activeProgramId);
          if (data.dailyDataMap) setDailyDataMap(data.dailyDataMap);
          if (data.logsHistory) setLogsHistory(data.logsHistory);
        }
        hydratedRef.current = true;
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('Firestore veri yüklenemedi:', err);
        hydratedRef.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !hydratedRef.current) return undefined;
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveUserData(user.uid, getDataSnapshot()).catch((err) => {
        console.warn('Firestore veri kaydedilemedi:', err);
      });
    }, 800);
    return () => clearTimeout(saveTimeoutRef.current);
  });

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
      const d = parseLocalDate(prevDate);
      d.setDate(d.getDate() + days);
      return toLocalDateStr(d);
    });
  }, []);

  const formatDateDisplay = useCallback((dateStr) => {
    const today = getTodayStr();
    const d = parseLocalDate(dateStr);
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

  const handleUpdateDailyLog = useCallback(
    (updates) => {
      const currentMap = dailyDataMapRef.current;
      const dayRecord = currentMap[selectedDate] || {};
      const nextMap = {
        ...currentMap,
        [selectedDate]: {
          ...dayRecord,
          ...updates
        }
      };
      dailyDataMapRef.current = nextMap;
      setDailyDataMap(nextMap);

      const uid = userRef.current?.uid;
      if (uid) {
        saveUserData(uid, {
          profiles,
          activeProfileId,
          customPrograms,
          activeProgramId,
          dailyDataMap: nextMap,
          logsHistory: logsHistoryRef.current
        }).catch((err) => {
          console.warn('Firestore veri kaydedilemedi:', err);
        });
      }
      clearTimeout(saveTimeoutRef.current);
    },
    [selectedDate, profiles, activeProfileId, customPrograms, activeProgramId]
  );

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

  const weekdayMap = useMemo(() => {
    const map = {};
    (activeDays || []).forEach((day) => {
      const m = (day.dayName || '').match(/\(([^)]+)\)/);
      if (m) map[m[1].trim().toUpperCase()] = day.id;
    });
    return map;
  }, [activeDays]);

  const hasSchedule = Object.keys(weekdayMap).length > 0;

  const scheduledDayId = useMemo(() => weekdayMap[getWeekdayForDate(selectedDate)], [weekdayMap, selectedDate]);

  const selectedDay = useMemo(() => {
    const effectiveId = hasSchedule && scheduledDayId ? scheduledDayId : selectedDayId;
    return activeDays.find((d) => d.id === effectiveId) || activeDays[0];
  }, [activeDays, selectedDayId, hasSchedule, scheduledDayId]);

  const extraExercises = useMemo(() => {
    const map = currentDayData.extraExercises || {};
    return selectedDay ? map[selectedDay.id] || [] : [];
  }, [currentDayData, selectedDay]);

  const effectiveExercises = useMemo(() => {
    return [...(selectedDay?.exercises || []), ...extraExercises];
  }, [selectedDay, extraExercises]);

  const handleAddExtraExercise = useCallback((exercise) => {
    setDailyDataMap((prev) => {
      const dayRecord = prev[selectedDate] || {};
      const exMap = dayRecord.extraExercises || {};
      const dayId = selectedDay?.id || 'day1';
      const list = exMap[dayId] || [];
      return {
        ...prev,
        [selectedDate]: {
          ...dayRecord,
          extraExercises: {
            ...exMap,
            [dayId]: [...list, { id: `extra_${Date.now()}`, tag: 'Ek Hareket', ...exercise }]
          }
        }
      };
    });
  }, [selectedDate, selectedDay]);

  const handleRemoveExtraExercise = useCallback((exId) => {
    setDailyDataMap((prev) => {
      const dayRecord = prev[selectedDate] || {};
      const exMap = dayRecord.extraExercises || {};
      const dayId = selectedDay?.id || 'day1';
      const list = exMap[dayId] || [];
      return {
        ...prev,
        [selectedDate]: {
          ...dayRecord,
          extraExercises: {
            ...exMap,
            [dayId]: list.filter((e) => e.id !== exId)
          }
        }
      };
    });
  }, [selectedDate, selectedDay]);

  const handleFinishWorkout = useCallback(
    (day, notes) => {
      const workoutData = currentDayData.workoutData || {};
      let totalVolumeKg = 0;
      let completedSetsCount = 0;

      effectiveExercises.forEach((ex) => {
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
        workoutData,
        extraExercises
      };

      const nextLogs = [newLog, ...logsHistoryRef.current];
      const currentMap = dailyDataMapRef.current;
      const nextDailyMap = {
        ...currentMap,
        [selectedDate]: {
          ...(currentMap[selectedDate] || currentDayData),
          workoutCompleted: true,
          lastWorkoutAt: Date.now(),
          completedSetsCount,
          totalVolumeKg
        }
      };
      logsHistoryRef.current = nextLogs;
      dailyDataMapRef.current = nextDailyMap;

      setLogsHistory(nextLogs);
      setDailyDataMap(nextDailyMap);

      const uid = userRef.current?.uid;
      if (uid) {
        saveUserData(uid, {
          profiles,
          activeProfileId,
          customPrograms,
          activeProgramId,
          dailyDataMap: nextDailyMap,
          logsHistory: nextLogs
        }).catch((err) => {
          console.warn('Firestore veri kaydedilemedi:', err);
        });
      }
      clearTimeout(saveTimeoutRef.current);

      alert(`🎉 ${formatDateDisplay(selectedDate)} antrenmanı başarıyla kaydedildi!`);
    },
    [
      currentDayData,
      effectiveExercises,
      extraExercises,
      formatDateDisplay,
      selectedDate,
      activeProgram.name,
      profiles,
      activeProfileId,
      customPrograms,
      activeProgramId
    ]
  );

  const weightLogsForChart = useMemo(() => {
    return Object.keys(dailyDataMap)
      .filter((date) => dailyDataMap[date].weight)
      .map((date) => ({ date, weight: dailyDataMap[date].weight }));
  }, [dailyDataMap]);

  const dailySummary = useMemo(() => {
    const meals = currentDayData.meals || [];
    const mealCalories = meals.reduce((a, m) => a + (Number(m.calories) || 0), 0);
    const mealProtein = meals.reduce((a, m) => a + (Number(m.protein) || 0), 0);
    const calories = Math.max(currentDayData.calories || 0, mealCalories);
    const protein = Math.max(currentDayData.protein || 0, mealProtein);
    const water = currentDayData.water || 0;

    const workout = currentDayData.workoutData || {};
    let totalSets = 0;
    let completedSets = 0;
    let volumeKg = 0;
    effectiveExercises.forEach((ex) => {
      const sets = workout[ex.id] || [];
      sets.forEach((s) => {
        totalSets++;
        if (s.completed) {
          completedSets++;
          volumeKg += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });

    return {
      calories,
      protein,
      water,
      totalSets,
      completedSets,
      volumeKg,
      calPct: Math.min(100, Math.round((calories / (activeProfile.targetCalories || 2550)) * 100)),
      protPct: Math.min(100, Math.round((protein / (activeProfile.targetProtein || 130)) * 100)),
      waterPct: Math.min(100, Math.round((water / (activeProfile.targetWater || 3)) * 100))
    };
  }, [currentDayData, effectiveExercises, activeProfile.targetCalories, activeProfile.targetProtein, activeProfile.targetWater]);

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

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="app-container">
<header className="app-header">
        <div className="app-title">LeaTracker</div>
        <div className="header-row">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="hamburger-btn"
            aria-label="Menü"
          >
            <Menu size={20} />
          </button>
          <div className="header-right">
            <button
              className="header-chip"
              onClick={() => setIsProgramModalOpen(true)}
              title="Antrenman programı"
            >
              <Layers size={13} color="var(--primary)" />
              <span className="header-chip-text">{activeProgram.name.split('(')[0].trim()}</span>
            </button>
            <button
              className="header-chip"
              onClick={() => setIsProfileModalOpen(true)}
              title="Profil"
            >
              <User size={13} color="var(--primary)" />
              <span className="header-chip-text">{activeProfile.name}</span>
            </button>
            <button
              className={`header-chip ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
              title="AI Koç & Analiz"
              style={activeTab === 'ai' ? { borderColor: '#9333EA', background: 'rgba(147, 51, 234, 0.15)' } : {}}
            >
              <Sparkles size={13} color="#C084FC" />
              <span className="header-chip-text" style={{ color: activeTab === 'ai' ? '#C084FC' : undefined }}>AI Koç</span>
            </button>
          </div>
        </div>
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
          <button onClick={() => shiftDate(1)} className="date-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="card daily-summary">
        <div className="daily-summary-title">
          <Calendar size={12} /> Günün Hesaplaması
        </div>
        <div className="daily-summary-grid">
          <div className="summary-stat">
            <span className="summary-stat-label"><Flame size={11} /> Kalori</span>
            <span className="summary-stat-value">{dailySummary.calories.toLocaleString('tr-TR')} <em>/ {activeProfile.targetCalories} kcal</em></span>
            <div className="progress-track"><div className="progress-fill progress-kcal" style={{ width: `${dailySummary.calPct}%` }} /></div>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label"><Utensils size={11} /> Protein</span>
            <span className="summary-stat-value">{dailySummary.protein} <em>/ {activeProfile.targetProtein} g</em></span>
            <div className="progress-track"><div className="progress-fill progress-protein" style={{ width: `${dailySummary.protPct}%` }} /></div>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label"><Droplets size={11} /> Su</span>
            <span className="summary-stat-value">{dailySummary.water} <em>/ {activeProfile.targetWater} L</em></span>
            <div className="progress-track"><div className="progress-fill progress-water" style={{ width: `${dailySummary.waterPct}%` }} /></div>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label"><Dumbbell size={11} /> Hacim</span>
            <span className="summary-stat-value">{dailySummary.volumeKg.toLocaleString('tr-TR')} <em>kg</em></span>
            <div className="summary-stat-foot">{dailySummary.completedSets}/{dailySummary.totalSets} set</div>
          </div>
        </div>
      </div>

      {activeTab === 'workout' && (
        <>
          {hasSchedule ? (
            <div className="schedule-note">
              <Calendar size={13} color="var(--primary)" />
              <span>Takvime göre: {selectedDay.dayName}</span>
            </div>
          ) : (
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
          )}

          <WorkoutLogger
            selectedDay={selectedDay}
            workoutData={currentDayData.workoutData || {}}
            onUpdateWorkout={handleUpdateWorkout}
            onFinishWorkout={handleFinishWorkout}
            onOpenTimer={() => setIsTimerOpen(true)}
            previousLogs={logsHistory}
            extraExercises={extraExercises}
            workoutCompleted={currentDayData.workoutCompleted}
            onAddExtraExercise={handleAddExtraExercise}
            onRemoveExtraExercise={handleRemoveExtraExercise}
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
              <Scale size={16} color="#3B82F6" />
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

      {activeTab === 'ai' && (
        <AIAnalyticsView
          profile={activeProfile}
          logsHistory={logsHistory}
          dailyDataMap={dailyDataMap}
          selectedDate={selectedDate}
          currentDayData={currentDayData}
          activeProgram={activeProgram}
        />
      )}

      <RestTimer
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTimer={() => setIsTimerOpen(true)}
        profileName={activeProfile.name}
        onLogout={handleLogout}
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
        <button
          className={`bottom-nav-item ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Sparkles size={18} color={activeTab === 'ai' ? '#C084FC' : undefined} /> AI Koç
        </button>
      </nav>
    </div>
  );
}
