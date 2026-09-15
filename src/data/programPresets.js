import { WORKOUT_DAYS as CHEST_BACK_ARMS_DAYS } from './workoutProgram';

export const PRESET_PROGRAMS = [
  {
    id: 'preset_chest_back_arms',
    name: 'Göğüs, Sırt ve Kol Odaklı (4 Gün)',
    category: 'Hipertrofi / Estetik',
    daysPerWeek: 4,
    description: 'Üst göğüs, sırt genişliği ve kollara odaklanan yüksek hacimli hipertrofi spliti.',
    days: CHEST_BACK_ARMS_DAYS
  },
  {
    id: 'preset_full_body',
    name: 'Klasik Full Body (3 Gün)',
    category: 'Genel Kuvvet & Kütle',
    daysPerWeek: 3,
    description: 'Haftada 3 gün tüm vücut kaslarını dengeli ve verimli bir şekilde uyaran temel protokol.',
    days: [
      {
        id: 'fb_d1',
        dayName: '1. GÜN (PAZARTESİ)',
        title: 'Full Body A - Temel İtiş & Çekiş',
        isRest: false,
        focus: ['Göğüs', 'Bacak', 'Sırt', 'Omuz', 'Biceps'],
        exercises: [
          { id: 'fb_d1_e1', name: 'Barbell / Dumbbell Bench Press', tag: 'Göğüs', defaultSets: 3, targetReps: '8-10', suggestedWeight: '12-16 kg', tips: 'Kürek kemiklerini sabitleyin, dirsekleri hafif içeri alarak kontrollü itin.' },
          { id: 'fb_d1_e2', name: 'Goblet Squat / Leg Press', tag: 'Bacak', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Dizleri ayak parmak yönünde tutun, kalçayı geriye indirip topuklardan kalkın.' },
          { id: 'fb_d1_e3', name: 'Lat Pulldown (Geniş Tutuş)', tag: 'Sırt', defaultSets: 3, targetReps: '8-10', suggestedWeight: 'Orta Ağırlık', tips: 'Barı üst göğse çekip kanatları sıkıştırın.' },
          { id: 'fb_d1_e4', name: 'Dumbbell Overhead Press', tag: 'Omuz', defaultSets: 3, targetReps: '8-10', suggestedWeight: '8-10 kg', tips: 'Dirsekleri öne alarak omuz başlarından yukarı basın.' },
          { id: 'fb_d1_e5', name: 'Dumbbell Biceps Curl', tag: 'Biceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: '6-8 kg', tips: 'Dirsekleri gövdeye sabitleyip kontrollü kaldırın.' }
        ]
      },
      { id: 'fb_d2', dayName: '2. GÜN (SALI)', title: 'Dinlenme & Yenilenme', isRest: true, tips: 'Aktif dinlenme, esneme ve protein alımına özen gösterin.' },
      {
        id: 'fb_d3',
        dayName: '3. GÜN (ÇARŞAMBA)',
        title: 'Full Body B - Çekiş & Bacak Arka',
        isRest: false,
        focus: ['Sırt', 'Arka Bacak', 'Üst Göğüs', 'Yan Omuz', 'Triceps'],
        exercises: [
          { id: 'fb_d3_e1', name: 'Incline Dumbbell Press', tag: 'Üst Göğüs', defaultSets: 3, targetReps: '8-10', suggestedWeight: '10-14 kg', tips: '30 derece açılı sehpada üst göğsü tam gererek basın.' },
          { id: 'fb_d3_e2', name: 'Dumbbell Romanian Deadlift', tag: 'Hamstring / Kalça', defaultSets: 3, targetReps: '8-10', suggestedWeight: '10-14 kg', tips: 'Kalçayı geriye iterek hamstringleri tam gerin.' },
          { id: 'fb_d3_e3', name: 'Seated Cable Row', tag: 'Sırt', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Karnınıza doğru çekip kürek kemiklerini birleştirin.' },
          { id: 'fb_d3_e4', name: 'Dumbbell Lateral Raise', tag: 'Yan Omuz', defaultSets: 3, targetReps: '12-15', suggestedWeight: '4-6 kg', tips: 'Dirsekleri hafif bükülü yana açın.' },
          { id: 'fb_d3_e5', name: 'Rope Triceps Pushdown', tag: 'Triceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Halatı aşağı bastırıp uçlarını iki yana açın.' }
        ]
      },
      { id: 'fb_d4', dayName: '4. GÜN (PERŞEMBE)', title: 'Dinlenme & Yenilenme', isRest: true, tips: 'Toparlanma ve su tüketimine odaklanın.' },
      {
        id: 'fb_d5',
        dayName: '5. GÜN (CUMA)',
        title: 'Full Body C - Hacim & İzolasyon',
        isRest: false,
        focus: ['Göğüs', 'Bacak', 'Sırt', 'Kol Süperseti'],
        exercises: [
          { id: 'fb_d5_e1', name: 'Chest Press Machine', tag: 'Göğüs', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Makinede sabit çizgide güvenli ve ağır basın.' },
          { id: 'fb_d5_e2', name: 'Leg Extension', tag: 'Ön Bacak', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Kontrollü', tips: 'Tepe noktada bacağı 1 saniye kilitleyip indirin.' },
          { id: 'fb_d5_e3', name: 'Chest Supported Dumbbell Row', tag: 'Sırt', defaultSets: 3, targetReps: '8-10', suggestedWeight: '10-12 kg', tips: 'Sehpaya yaslanıp beli zorlamadan sırtı çekin.' },
          { id: 'fb_d5_e4', name: 'Hammer Curl', tag: 'Ön Kol / Biceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: '6-8 kg', tips: 'Çekiç tutuşla kaldırın.' },
          { id: 'fb_d5_e5', name: 'Overhead Dumbbell Extension', tag: 'Triceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: '8-10 kg', tips: 'Triceps uzun başını esnetin ve yukarı basın.' }
        ]
      },
      { id: 'fb_d6', dayName: '6. GÜN (CUMARTESİ)', title: 'Hafta Sonu Dinlenme', isRest: true, tips: 'Hafif kardiyo ve yürüyüş.' },
      { id: 'fb_d7', dayName: '7. GÜN (PAZAR)', title: 'Hafta Sonu Dinlenme', isRest: true, tips: 'Gelecek haftaya hazırlık ve tam dinlenme.' }
    ]
  },
  {
    id: 'preset_upper_lower',
    name: 'Upper / Lower (4 Gün)',
    category: 'Güç & Hipertrofi',
    daysPerWeek: 4,
    description: 'Üst ve alt vücudu haftada ikişer kez uyararak maksimum kas gelişimi sağlayan klasik split.',
    days: [
      {
        id: 'ul_d1',
        dayName: '1. GÜN (PAZARTESİ)',
        title: 'Upper A - Üst Vücut Güç',
        isRest: false,
        focus: ['Göğüs', 'Sırt', 'Omuz', 'Kol'],
        exercises: [
          { id: 'ul_d1_e1', name: 'Flat Dumbbell / Barbell Press', tag: 'Göğüs', defaultSets: 4, targetReps: '6-8', suggestedWeight: 'Ağır', tips: 'Maksimum güç ile kontrollü basın.' },
          { id: 'ul_d1_e2', name: 'Bent-Over Dumbbell / Barbell Row', tag: 'Sırt', defaultSets: 4, targetReps: '6-8', suggestedWeight: 'Ağır', tips: 'Sırtı düz tutarak karnınıza çekin.' },
          { id: 'ul_d1_e3', name: 'Incline Dumbbell Press', tag: 'Üst Göğüs', defaultSets: 3, targetReps: '8-10', suggestedWeight: 'Orta-Ağır', tips: 'Üst göğüs liflerini gerin.' },
          { id: 'ul_d1_e4', name: 'Lat Pulldown', tag: 'Kanat', defaultSets: 3, targetReps: '8-10', suggestedWeight: 'Orta Ağırlık', tips: 'Geniş tutuşla çekin.' },
          { id: 'ul_d1_e5', name: 'Dumbbell Lateral Raise', tag: 'Yan Omuz', defaultSets: 3, targetReps: '12-15', suggestedWeight: '4-6 kg', tips: 'Omuz hizasına kaldırın.' }
        ]
      },
      {
        id: 'ul_d2',
        dayName: '2. GÜN (SALI)',
        title: 'Lower A - Alt Vücut Güç',
        isRest: false,
        focus: ['Ön Bacak', 'Hamstring', 'Kalf', 'Karın'],
        exercises: [
          { id: 'ul_d2_e1', name: 'Leg Press / Hack Squat', tag: 'Ön Bacak', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Ağır', tips: 'Dizleri 90 derece büküp güçlü itin.' },
          { id: 'ul_d2_e2', name: 'Romanian Deadlift', tag: 'Hamstring', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Orta-Ağır', tips: 'Kalçayı geriye iterek hamstringleri esnetin.' },
          { id: 'ul_d2_e3', name: 'Leg Extension', tag: 'Ön Bacak İzolasyon', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Orta', tips: 'Tepe noktada kası sıkın.' },
          { id: 'ul_d2_e4', name: 'Lying Leg Curl', tag: 'Hamstring İzolasyon', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta', tips: 'Topukları kalçaya çekin.' },
          { id: 'ul_d2_e5', name: 'Standing Calf Raise', tag: 'Kalf', defaultSets: 4, targetReps: '15', suggestedWeight: 'Vücut / Ağırlık', tips: 'Parmak ucunda tepeye yükselin.' }
        ]
      },
      { id: 'ul_d3', dayName: '3. GÜN (ÇARŞAMBA)', title: 'Dinlenme & Yenilenme', isRest: true, tips: 'Aktif toparlanma günü.' },
      {
        id: 'ul_d4',
        dayName: '4. GÜN (PERŞEMBE)',
        title: 'Upper B - Üst Vücut Hipertrofi',
        isRest: false,
        focus: ['Üst Göğüs', 'Sırt Kalınlığı', 'Omuz', 'Biceps & Triceps'],
        exercises: [
          { id: 'ul_d4_e1', name: 'Incline Chest Press Machine', tag: 'Üst Göğüs', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Sabit hatta göğsü sıkın.' },
          { id: 'ul_d4_e2', name: 'Seated Cable Row', tag: 'Sırt', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Göğsü dik tutarak çekin.' },
          { id: 'ul_d4_e3', name: 'Pec Deck Fly', tag: 'Göğüs İzolasyon', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Hafif-Orta', tips: 'Kolları kapatıp göğsü sıkıştırın.' },
          { id: 'ul_d4_e4', name: 'Incline Dumbbell Curl', tag: 'Biceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: '6-8 kg', tips: 'Biceps uzun başını esnetin.' },
          { id: 'ul_d4_e5', name: 'Skullcrusher / Rope Pushdown', tag: 'Triceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Dirsekleri sabitleyin.' }
        ]
      },
      {
        id: 'ul_d5',
        dayName: '5. GÜN (CUMA)',
        title: 'Lower B - Alt Vücut Hipertrofi',
        isRest: false,
        focus: ['Bacak Hacmi', 'Kalça', 'Kalf', 'Karın'],
        exercises: [
          { id: 'ul_d5_e1', name: 'Goblet Squat / Front Squat', tag: 'Bacak', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Düzgün derinlikle squat yapın.' },
          { id: 'ul_d5_e2', name: 'Walking Lunge (Dambıl ile)', tag: 'Bacak / Kalça', defaultSets: 3, targetReps: '12 adım', suggestedWeight: 'Dambıl', tips: 'Adımları geniş atarak kalçayı hedefleyin.' },
          { id: 'ul_d5_e3', name: 'Seated Leg Curl', tag: 'Hamstring', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Kontrollü', tips: 'Arka bacağı kontrollü kasın.' },
          { id: 'ul_d5_e4', name: 'Calf Raise', tag: 'Kalf', defaultSets: 4, targetReps: '15-20', suggestedWeight: 'Orta', tips: 'Baldırlarda tam yanma hissedin.' },
          { id: 'ul_d5_e5', name: 'Cable Crunch / Plank', tag: 'Karın', defaultSets: 3, targetReps: '15', suggestedWeight: 'Vücut / Kablo', tips: 'Karnı sıkarak içeri çekin.' }
        ]
      },
      { id: 'ul_d6', dayName: '6. GÜN (CUMARTESİ)', title: 'Hafta Sonu Dinlenme', isRest: true, tips: 'Beslenme ve uykuya odaklanın.' },
      { id: 'ul_d7', dayName: '7. GÜN (PAZAR)', title: 'Hafta Sonu Dinlenme', isRest: true, tips: 'Yeni haftaya hazırlık.' }
    ]
  },
  {
    id: 'preset_push_pull_legs',
    name: 'Push / Pull / Legs (5 Gün)',
    category: 'İleri Seviye Hacim',
    daysPerWeek: 5,
    description: 'İtiş, çekiş ve bacak günlerini bölen, omuz ve kolları yoğunlaştıran popüler split.',
    days: [
      {
        id: 'ppl_d1',
        dayName: '1. GÜN (PAZARTESİ)',
        title: 'Push - Göğüs, Ön Omuz, Triceps',
        isRest: false,
        focus: ['Göğüs Pres', 'Üst Göğüs', 'Omuz Pres', 'Triceps'],
        exercises: [
          { id: 'ppl_d1_e1', name: 'Incline Dumbbell Press', tag: 'Üst Göğüs', defaultSets: 4, targetReps: '8-10', suggestedWeight: '12-16 kg', tips: '30 derecede üst göğse odaklanın.' },
          { id: 'ppl_d1_e2', name: 'Chest Press Machine', tag: 'Göğüs', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Maksimum göğüs aktivasyonu sağlayın.' },
          { id: 'ppl_d1_e3', name: 'Cable Fly', tag: 'Göğüs İzolasyon', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Hafif-Orta', tips: 'Tepe noktada göğsü sıkın.' },
          { id: 'ppl_d1_e4', name: 'Dumbbell Lateral Raise', tag: 'Yan Omuz', defaultSets: 4, targetReps: '12-15', suggestedWeight: '4-8 kg', tips: 'Yan omuz genişliği için kaldırın.' },
          { id: 'ppl_d1_e5', name: 'Rope Triceps Pushdown', tag: 'Triceps', defaultSets: 4, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Alt noktada halatı açın.' }
        ]
      },
      {
        id: 'ppl_d2',
        dayName: '2. GÜN (SALI)',
        title: 'Pull - Sırt, Arka Omuz, Biceps',
        isRest: false,
        focus: ['Kanat', 'Sırt Kalınlığı', 'Arka Omuz', 'Biceps'],
        exercises: [
          { id: 'ppl_d2_e1', name: 'Lat Pulldown', tag: 'Kanat', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Orta-Ağır', tips: 'Dirsekleri aşağı çekip sıkın.' },
          { id: 'ppl_d2_e2', name: 'Seated Cable Row', tag: 'Sırt Kalınlığı', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Kürek kemiklerini birleştirin.' },
          { id: 'ppl_d2_e3', name: 'Single-Arm Dumbbell Row', tag: 'Sırt', defaultSets: 3, targetReps: '8-10', suggestedWeight: '10-14 kg', tips: 'Kalçaya doğru çekin.' },
          { id: 'ppl_d2_e4', name: 'Face Pull / Rear Delt Fly', tag: 'Arka Omuz', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Hafif-Orta', tips: 'Arka omuzları geriye çekin.' },
          { id: 'ppl_d2_e5', name: 'Incline Dumbbell Curl', tag: 'Biceps', defaultSets: 4, targetReps: '10-12', suggestedWeight: '6-10 kg', tips: 'Biceps uzun başını esnetin.' }
        ]
      },
      {
        id: 'ppl_d3',
        dayName: '3. GÜN (ÇARŞAMBA)',
        title: 'Legs - Bacak & Kalf',
        isRest: false,
        focus: ['Ön Bacak', 'Hamstring', 'Kalf', 'Karın'],
        exercises: [
          { id: 'ppl_d3_e1', name: 'Leg Press / Hack Squat', tag: 'Ön Bacak', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Ağır', tips: 'Dizleri kontrollü büküp güçlü itin.' },
          { id: 'ppl_d3_e2', name: 'Romanian Deadlift', tag: 'Hamstring', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Orta-Ağır', tips: 'Hamstringleri esnetin.' },
          { id: 'ppl_d3_e3', name: 'Leg Extension', tag: 'Ön Bacak', defaultSets: 3, targetReps: '12-15', suggestedWeight: 'Orta', tips: 'Tepe noktada kası kilitleyin.' },
          { id: 'ppl_d3_e4', name: 'Lying Leg Curl', tag: 'Hamstring', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta', tips: 'Topukları kalçaya çekin.' },
          { id: 'ppl_d3_e5', name: 'Calf Raise', tag: 'Kalf', defaultSets: 4, targetReps: '15', suggestedWeight: 'Ağırlık', tips: 'Parmak ucunda tepeye çıkın.' }
        ]
      },
      {
        id: 'ppl_d4',
        dayName: '4. GÜN (PERŞEMBE)',
        title: 'Upper Body Focus - Göğüs, Sırt & Omuz',
        isRest: false,
        focus: ['Üst Göğüs', 'Sırt Row', 'Yan Omuz', 'Kollar'],
        exercises: [
          { id: 'ppl_d4_e1', name: 'Incline Chest Press Machine', tag: 'Üst Göğüs', defaultSets: 3, targetReps: '8-10', suggestedWeight: 'Orta-Ağır', tips: 'Kontrollü basın.' },
          { id: 'ppl_d4_e2', name: 'Chest Supported Row', tag: 'Sırt', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Orta Ağırlık', tips: 'Sırtı izole edin.' },
          { id: 'ppl_d4_e3', name: 'Flat Dumbbell Press', tag: 'Göğüs', defaultSets: 3, targetReps: '8-10', suggestedWeight: '12-16 kg', tips: 'Düz sehpada basın.' },
          { id: 'ppl_d4_e4', name: 'Dumbbell Lateral Raise', tag: 'Yan Omuz', defaultSets: 4, targetReps: '12-15', suggestedWeight: '4-8 kg', tips: 'Yan omuza odaklanın.' },
          { id: 'ppl_d4_e5', name: 'Hammer Curl', tag: 'Ön Kol / Biceps', defaultSets: 3, targetReps: '10-12', suggestedWeight: '6-10 kg', tips: 'Çekiç tutuşla kaldırın.' }
        ]
      },
      {
        id: 'ppl_d5',
        dayName: '5. GÜN (CUMA)',
        title: 'Arm & Shoulder Specialization (Kol & Omuz)',
        isRest: false,
        focus: ['Biceps', 'Triceps', 'Omuz', 'Karın'],
        exercises: [
          { id: 'ppl_d5_e1', name: 'EZ-Bar Biceps Curl', tag: 'Biceps', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Orta Ağırlık', tips: 'Dirsekleri sabitleyin.' },
          { id: 'ppl_d5_e2', name: 'Skullcrusher', tag: 'Triceps', defaultSets: 4, targetReps: '8-10', suggestedWeight: 'Orta Ağırlık', tips: 'Alına indirip yukarı kilitleyin.' },
          { id: 'ppl_d5_e3', name: 'Preacher Curl', tag: 'Biceps İzolasyon', defaultSets: 3, targetReps: '10-12', suggestedWeight: 'Hafif-Orta', tips: 'Tepe noktada sıkın.' },
          { id: 'ppl_d5_e4', name: 'Overhead Triceps Extension', tag: 'Triceps Uzun Baş', defaultSets: 3, targetReps: '10-12', suggestedWeight: '8-12 kg', tips: 'Uzun başı esnetin.' },
          { id: 'ppl_d5_e5', name: 'Cable Crunch', tag: 'Karın', defaultSets: 3, targetReps: '15', suggestedWeight: 'Orta', tips: 'Karın kaslarını sıkın.' }
        ]
      },
      { id: 'ppl_d6', dayName: '6. GÜN (CUMARTESİ)', title: 'Dinlenme & Yenilenme', isRest: true, tips: 'Hafta sonu toparlanması.' },
      { id: 'ppl_d7', dayName: '7. GÜN (PAZAR)', title: 'Dinlenme & Yenilenme', isRest: true, tips: 'Yeni haftaya hazırlık.' }
    ]
  }
];

export function calculateProfileRecommendations(profile) {
  const weight = Number(profile.weight) || 70;
  const height = Number(profile.height) || 175;
  const age = Number(profile.age) || 25;
  const gender = profile.gender || 'male';
  const goal = profile.goal || 'hypertrophy';
  const daysCount = Number(profile.daysPerWeek) || 4;

  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  let activityMultiplier = 1.45;
  if (daysCount >= 5) activityMultiplier = 1.55;
  else if (daysCount === 3) activityMultiplier = 1.375;

  const tdee = Math.round(bmr * activityMultiplier);

  let targetCalories = tdee;
  let proteinMultiplier = 2.0;

  if (goal === 'hypertrophy' || goal === 'bulk') {
    targetCalories = tdee + 300;
    proteinMultiplier = 2.0;
  } else if (goal === 'cut' || goal === 'fat_loss') {
    targetCalories = tdee - 450;
    proteinMultiplier = 2.2;
  } else if (goal === 'strength') {
    targetCalories = tdee + 150;
    proteinMultiplier = 2.1;
  } else {
    targetCalories = tdee;
    proteinMultiplier = 1.8;
  }

  const targetProtein = Math.round(weight * proteinMultiplier);
  const targetWater = Number((weight * 0.04).toFixed(1));

  let recommendedProgramId = 'preset_chest_back_arms';
  if (daysCount === 3) recommendedProgramId = 'preset_full_body';
  else if (daysCount === 4) {
    recommendedProgramId = goal === 'strength' ? 'preset_upper_lower' : 'preset_chest_back_arms';
  } else if (daysCount >= 5) recommendedProgramId = 'preset_push_pull_legs';

  return {
    targetCalories,
    targetProtein,
    targetWater: Math.max(targetWater, 2.5),
    recommendedProgramId
  };
}
