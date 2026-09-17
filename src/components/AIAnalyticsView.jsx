import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Plus } from 'lucide-react';
import { askAiCoach } from '../services/aiService';

const parseInlineMarkdown = (text) => {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*|\*\*.*$)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**')) {
      const clean = part.replace(/^\*\*/, '').replace(/\*\*$/, '');
      return (
        <strong key={idx} style={{ color: '#FAFAFA', fontWeight: 700 }}>
          {clean}
        </strong>
      );
    }
    return part;
  });
};

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

    const renderedParts = parseInlineMarkdown(cleanLine);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #9333EA, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
              flexShrink: 0
            }}>
              <Bot size={22} color="#FFFFFF" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F4F6F8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                AI Fitness & Beslenme Koçu
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#A1A1AA', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                İdman ve beslenmeni anında analiz eder
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleClearChat}
              style={{
                background: 'linear-gradient(135deg, #9333EA, #3B82F6)',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)'
              }}
              title="Sohbeti Sıfırla"
            >
              <Plus size={14} /> Yeni Sohbet
            </button>
          </div>
        </div>

        <div style={{
          minHeight: '260px',
          maxHeight: '480px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px',
          background: 'rgba(15, 23, 42, 0.4)',
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
                  maxWidth: '90%',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                    : 'rgba(24, 24, 27, 0.8)',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#C084FC' }}>
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
              background: 'rgba(24, 24, 27, 0.8)',
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
