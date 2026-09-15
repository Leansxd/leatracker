import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell } from 'lucide-react';

export default function RestTimer({ isOpen, onClose }) {
  const [seconds, setSeconds] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(90);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // audio fallback
      }
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const setTimerPreset = (secs) => {
    setInitialTime(secs);
    setSeconds(secs);
    setIsActive(true);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialTime);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="rest-timer-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Bell size={18} color="#00E5FF" className={isActive ? "pulse" : ""} />
        <span className="timer-digits">{formatTime(seconds)}</span>
      </div>

      <div className="timer-controls">
        <button className="btn-timer-opt" onClick={() => setTimerPreset(60)}>60s</button>
        <button className="btn-timer-opt" onClick={() => setTimerPreset(90)}>90s</button>
        <button className="btn-timer-opt" onClick={() => setTimerPreset(120)}>120s</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button 
          onClick={toggleTimer} 
          style={{ background: 'transparent', border: 'none', color: '#00E5FF', cursor: 'pointer' }}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button 
          onClick={resetTimer} 
          style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
        >
          <RotateCcw size={18} />
        </button>
        <button 
          onClick={onClose} 
          style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', marginLeft: '6px' }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
