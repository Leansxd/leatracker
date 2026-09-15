const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

export async function requestGroqChat(messages, temperature = 0.6, maxTokens = 500, model = PRIMARY_MODEL) {
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GROQ_API_KEY : '';
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('letracker_groq_api_key') : '';
  const processKey = typeof process !== 'undefined' && process.env ? process.env.VITE_GROQ_API_KEY : '';
  const apiKey = envKey || localKey || processKey;

  if (!apiKey) {
    throw new Error('Groq API anahtarı bulunamadı (.env dosyasına VITE_GROQ_API_KEY ekleyin).');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData?.error?.message || `Groq API Hatası: ${response.status} ${response.statusText}`;
    if (model !== FALLBACK_MODEL && (msg.includes('rate limit') || msg.includes('tokens per minute') || response.status === 429)) {
      return requestGroqChat(messages, temperature, 450, FALLBACK_MODEL);
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Yanıt alınamadı.';
}

export async function generateComprehensiveAiReport({ profile, logsHistory = [], dailyDataMap = {}, selectedDate }) {
  const todayData = dailyDataMap[selectedDate] || {};
  const lastWorkout = logsHistory[0] || null;
  const recentWorkoutsSummary = logsHistory.slice(0, 4).map(l => {
    const exCount = Object.keys(l.workoutData || {}).length || (l.exercises?.length || 0);
    return `${l.date} (${l.dayName || l.title}): ${l.totalVolumeKg || 0} kg hacim, ${l.completedSetsCount || 0} set, ${exCount} hareket`;
  });

  const todayCompleted = !!todayData.workoutCompleted || logsHistory.some(l => l.date === selectedDate);

  const systemPrompt = `Sen spor bilimcisi ve elit fitness koçusun.
Sporcunun verilerini analiz edip sadece ve sadece geçerli bir JSON nesnesi döndür.
Markdown veya ekstra açıklama yazma. Sadece JSON formatında çıktı ver:
{
  "score": 85,
  "statusTag": "Harika Gelişim",
  "summary": "Kas kütlesi için genel durum hakkında tek cümlelik net özet.",
  "training": "Ağırlık artışı, set performansı ve progressive overload hakkında somut, net tek cümlelik tavsiye.",
  "nutrition": "Kalori, protein ve su dengesi hakkında somut, net tek cümlelik tavsiye.",
  "actions": [
    "Bir sonraki antrenman için 1. somut aksiyon adımı",
    "Beslenme/toparlanma için 2. somut aksiyon adımı"
  ]
}`;

  const userContent = `Sporcu Profili:
- Boy: ${profile?.height || 175} cm | Kilo: ${profile?.weight || 70} kg | Yaş: ${profile?.age || 25}
- Hedef: ${profile?.goal || 'Kas Kazanımı (Hipertrofi)'}
- Hedefler: ${profile?.targetCalories || 2500} kcal, ${profile?.targetProtein || 140}g protein, ${profile?.targetWater || 3}L su

Bugünün Durumu (${selectedDate}):
- Tüketilen Kalori: ${todayData.calories || 0} / ${profile?.targetCalories || 2500} kcal
- Alınan Protein: ${todayData.protein || 0} / ${profile?.targetProtein || 140} g
- Tüketilen Su: ${todayData.water || 0} / ${profile?.targetWater || 3} L
- Bugün İdman Yapıldı mı: ${todayCompleted ? 'Evet (Tamamlandı)' : 'Henüz Yapılmadı / Dinlenme'}
- Kreatin: ${todayData.tookCreatine ? 'Alındı' : 'Alınmadı'}

Son Antrenman Kayıtları:
${recentWorkoutsSummary.length > 0 ? recentWorkoutsSummary.join('\n') : 'Henüz antrenman kaydı yok.'}
${lastWorkout ? `Son İdman Detayı: ${lastWorkout.dayName || lastWorkout.title}, Toplam Hacim: ${lastWorkout.totalVolumeKg} kg, Tamamlanan Set: ${lastWorkout.completedSetsCount}` : ''}

Bu verilere göre sporcunun JSON raporunu oluştur.`;

  return requestGroqChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ], 0.5, 450);
}

export async function askAiCoach({
  question,
  chatHistory = [],
  profile,
  currentDayData,
  logsHistory = [],
  activeProgram,
  selectedDate
}) {
  const lastWorkouts = logsHistory.slice(0, 5).map(l => {
    const details = [];
    if (l.workoutData) {
      Object.entries(l.workoutData).forEach(([exId, setList]) => {
        const done = setList.filter(s => s.completed);
        if (done.length > 0) {
          const maxW = Math.max(...done.map(s => Number(s.weight) || 0));
          details.push(`${exId} (${done.length} set, maks ${maxW}kg)`);
        }
      });
    }
    return `- ${l.date} (${l.dayName || l.title}): ${l.totalVolumeKg || 0}kg hacim, ${l.completedSetsCount || 0} set. Hareketler: ${details.join(', ') || 'kayıt yok'}`;
  });

  const programDays = (activeProgram?.days || []).map(d => `${d.dayName} - Odak: ${(d.focus || []).join(', ')}`);

  const systemPrompt = `Sen LeaTracker uygulamasının profesyonel yapay zeka fitness ve beslenme koçusun.
Sporcunun profili ve tam geçmişi elindedir:
- Boy: ${profile?.height || 175}cm | Kilo: ${profile?.weight || 70}kg | Hedef: ${profile?.goal || 'Kas kazanımı'}
- Hedefler: ${profile?.targetCalories || 2500} kcal, ${profile?.targetProtein || 140}g protein, ${profile?.targetWater || 3}L su

Bugünkü (${selectedDate}) Durum:
- Kalori: ${currentDayData?.calories || 0} / ${profile?.targetCalories || 2500} kcal
- Protein: ${currentDayData?.protein || 0} / ${profile?.targetProtein || 140} g
- Su: ${currentDayData?.water || 0} / ${profile?.targetWater || 3} L
- İdman Yapıldı mı: ${currentDayData?.workoutCompleted ? 'Evet, yapıldı' : 'Henüz yapılmadı'}

Aktif Program Günleri ve Hedef Kaslar:
${programDays.join('\n')}

Sporcunun Gerçekleştirdiği Son Antrenmanlar ve Hareketler:
${lastWorkouts.length > 0 ? lastWorkouts.join('\n') : 'Henüz tamamlanan antrenman kaydı yok.'}

Talimatlar:
1. Kullanıcının sorusuna doğrudan, kısa, samimi ve net yanıt ver.
2. Sporcu "eksiklerim neler?", "hangi hareketleri yaptım?", "durumum nasıl?" veya idmanla ilgili sorduğunda; yukarıdaki gerçek hareket kayıtlarına bakarak hangi hareketleri yaptığını, hangi kas gruplarının eksik kaldığını (örn. bacak, sırt, omuz vb.) ve ağırlık/hacim durumunu netçe belirt.
3. Beslenme veya kalori eksikse net rakamlarla uyar.
4. Gereksiz edebiyat yapma, kısa maddeler ve emojilerle açıkla. Türkçe cevap ver.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-6),
    { role: 'user', content: question }
  ];

  return requestGroqChat(messages, 0.6, 500);
}
