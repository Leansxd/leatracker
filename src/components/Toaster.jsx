import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const TOAST_EVENT = 'letracker-toast';

export function toast(message, type = 'success') {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { id: Date.now() + Math.random(), message, type }
    })
  );
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export default function Toaster() {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const t = e.detail;
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 3200);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="toast-container">
      {items.map((t) => {
        const Icon = ICONS[t.type] || Info;
        const color = t.type === 'error' ? '#EF4444' : t.type === 'info' ? '#3B82F6' : '#10B981';
        return (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <Icon size={16} color={color} />
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="toast-close">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}