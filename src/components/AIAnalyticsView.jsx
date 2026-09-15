import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Key, Sparkles, Bot } from 'lucide-react';
import { askAiCoach } from '../services/aiService';

const renderFormattedMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} style={{ height: '6px' }} />;
    }

    let isHeader = false;
    let headerLevel = 0;
    let cleanLine = trimmed;

    if (cleanLine.startsWith('### ')) {
      isHeader = true;
      headerLevel = 3;
      cleanLine = cleanLine.slice(4);
    } else if (cleanLine.startsWith('## ')) {
      isHeader = true;
      headerLevel = 2;
      cleanLine = cleanLine.slice(3);
    } else if (cleanLine.startsWith('# ')) {
      isHeader = true;
      headerLevel = 1;
      cleanLine = cleanLine.slice(2);
    }

    const isBullet = !isHeader && (cleanLine.startsWith('* ') || cleanLine.startsWith('- ') || cleanLine.startsWith('• '));
    if (isBullet) {
      cleanLine = cleanLine.replace(/^[*•-]\s+/, '');
    }

    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} style={{ color: '#F4F6F8', fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isHeader) {
      return (
        <div
          key={idx}
          style={{
            fontSize: headerLevel === 1 ? '0.98rem' : '0.9rem',
            fontWeight: 800,
            color: '#C084FC',
            marginTop: idx === 0 ? '0' : '10px',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {renderedParts}
        </div>
      );
    }

    if (isBullet) {
      return (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '4px',
            paddingLeft: '2px'
          }}
        >
          <span style={{ color: '#3B82F6', fontSize: '1rem', lineHeight: '1.3' }}>•</span>
          <span style={{ color: '#D4D4D8', fontSize: '0.84rem', lineHeight: 1.5 }}>
            {renderedParts}
          </span>
        </div>
      );
    }

    return (
      <div key={idx} style={{ color: '#D4D4D8', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '4px' }}>
        {renderedParts}
      </div>
    );
  });
};

export default function AIAnalyticsView({
  profile,
  logsHistory = [],
  dailyDataMap = {},
  selectedDate,
  currentDayData,
  activeProgram
}) {
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('letracker_ai_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputQuestion, setInputQuestion] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('letracker_groq_api_key') || '');
  const [keySaved, setKeySaved] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loadingChat]);

  const handleSendMessage = async (customPrompt) => {
    const q = (customPrompt || inputQuestion).trim();
    if (!q || loadingChat) return;

    const userMsg = { role: 'user', content: q };
    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setInputQuestion('');
    setLoadingChat(true);

    try {
      const answer = await askAiCoach({
        question: q,
        chatHistory: updatedHistory,
        profile,
        currentDayData,
        logsHistory,
        activeProgram,
        selectedDate
      });
      const finalHistory = [...updatedHistory, { role: 'assistant', content: answer }];
      setChatMessages(finalHistory);
      localStorage.setItem('letracker_ai_chat_history', JSON.stringify(finalHistory));
    } catch (err) {
      const errHistory = [...updatedHistory, { role: 'assistant', content: `Hata: ${err.message}` }];
      setChatMessages(errHistory);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([]);
    localStorage.removeItem('letracker_ai_chat_history');
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (customKey.trim()) {
      localStorage.setItem('letracker_groq_api_key', customKey.trim());
    } else {
      localStorage.removeItem('letracker_groq_api_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const quickQuestions = [
    "Bugünkü durumumu ve eksiklerimi analiz et",
    "Son yaptığım hareketler ve ağırlıklarım nasıl?",
    "Hangi kas gruplarım eksik kaldı, ne çalışmalıyım?",
    "Bugünkü kalori ve protein açığım ne kadar?",
    "Kaldırdığım ağırlıkları artırmak için bu hafta ne yapmalıyım?"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="glass-panel" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #9333EA, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
            }}>
              <Bot size={22} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F4F6F8', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                AI Fitness & Beslenme Koçu
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
                İdman hareketlerini, eksik kas gruplarını ve günlük beslenmeni analiz eder
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 8px',
                color: '#A1A1AA',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="API Ayarı"
            >
              <Key size={13} /> {showKeyConfig ? 'Kapat' : 'API'}
            </button>

            {chatMessages.length > 0 && (
              <button
                onClick={handleClearChat}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '6px 8px',
                  color: '#F87171',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Sohbeti Temizle"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {showKeyConfig && (
          <form onSubmit={handleSaveKey} style={{ marginBottom: '14px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: '#D4D4D8', marginBottom: '6px' }}>
              Groq API Anahtarı (.env dışında manuel girmek istersen):
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="gsk_..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#FAFAFA',
                  fontSize: '0.75rem'
                }}
              />
              <button
                type="submit"
                style={{
                  background: keySaved ? '#10B981' : '#3B82F6',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {keySaved ? 'Kaydedildi' : 'Kaydet'}
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={loadingChat}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '6px 12px',
                color: '#E4E4E7',
                fontSize: '0.75rem',
                cursor: loadingChat ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: loadingChat ? 0.6 : 1,
                transition: 'all 0.15s ease'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <div style={{
          minHeight: '260px',
          maxHeight: '480px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          marginBottom: '12px'
        }}>
          {chatMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#71717A', fontSize: '0.85rem' }}>
              <Sparkles size={28} style={{ marginBottom: '8px', color: '#3B82F6', opacity: 0.6 }} />
              <div style={{ color: '#D4D4D8', fontWeight: 600 }}>AI Koçuna Hoş Geldin!</div>
              <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                Hangi hareketleri yaptığını, eksik kas gruplarını veya beslenme açıklarını öğrenmek için yukarıdaki butonlara basabilir veya aşağıya sorunu yazabilirsin.
              </div>
            </div>
          ) : (
            chatMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  boxShadow: m.role === 'user' ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#60A5FA' }}>
                    <Bot size={13} /> AI Koç
                  </div>
                )}
                {renderFormattedMarkdown(m.content)}
              </div>
            ))
          )}
          {loadingChat && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px 14px 14px 2px',
              padding: '10px 14px',
              color: '#93C5FD',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Bot size={14} className="spin" /> Verilerin inceleniyor ve yanıt hazırlanıyor...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="AI Koçuna hareketlerini, eksiklerini veya beslenmeni sor..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={loadingChat}
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FAFAFA',
              fontSize: '0.84rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loadingChat || !inputQuestion.trim()}
            style={{
              background: 'linear-gradient(135deg, #9333EA, #3B82F6)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              color: '#FFFFFF',
              cursor: loadingChat || !inputQuestion.trim() ? 'not-allowed' : 'pointer',
              opacity: loadingChat || !inputQuestion.trim() ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(147, 51, 234, 0.25)'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
