export const INITIAL_PROFILE = {
  height: 173,
  weight: 67,
  week: 1,
  equipment: "Dambıl, Kablo & Makine",
  targetCalories: 2550,
  targetProtein: 130,
  targetWater: 3.0
};

export const INITIAL_GUIDE = [
  {
    id: 1,
    title: "İtiş & Çekiş Denge Prensibi",
    desc: "Göğüs, sırt ve kol odaklı bu programda itiş ve çekiş kasları eşit hacimde uyarılır. Ağırlıkları kontrollü indirip patlayıcı kaldırın."
  },
  {
    id: 2,
    title: "Üst Göğüs ve Sırt Önceliği",
    desc: "Haftanın iki günü üst göğüs ve sırt uyarılır. Doğru açıyı korumak için sehpa açısını 30 derecede tutun ve kürek kemiklerini sabitleyin."
  },
  {
    id: 3,
    title: "Kol Gelişimi & İzolasyon",
    desc: "Cuma günkü kol seansında dirsekleri gövdeden ayırmadan biceps tepe noktası ve triceps uzun başını izole edin."
  },
  {
    id: 4,
    title: "Beslenme & Toparlanma",
    desc: "Hedeflenen 130g protein ve 2550 kaloriyi eksiksiz alarak dinlenme günlerinde kas onarımını maksimize edin."
  }
];

export const WORKOUT_DAYS = [
  {
    id: "day1",
    dayName: "1. GÜN (PAZARTESİ)",
    title: "Göğüs + Triceps (Ön Göğüs & İtiş Focus)",
    isRest: false,
    focus: ["Üst Göğüs", "Göğüs Pres", "Fly İzolasyon", "Triceps Pushdown", "Triceps Uzun Baş"],
    exercises: [
      {
        id: "d1_e1",
        name: "Incline Dumbbell Press",
        tag: "Üst Göğüs",
        defaultSets: 3,
        targetReps: "8-10",
        suggestedWeight: "10-14 kg",
        tips: "Üst göğüs hipertrofisi. Sehpaya 30° eğim verin, dirsekleri hafif içe alarak göğsü açarak basın."
      },
      {
        id: "d1_e2",
        name: "Chest Press Machine",
        tag: "Göğüs",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Sabit hat üzerinde maksimum göğüs aktivasyonu. Kürek kemiklerini arkada kilitleyip göğsü sıkıştırın."
      },
      {
        id: "d1_e3",
        name: "Cable Fly / Pec Deck Machine",
        tag: "Göğüs İzolasyon",
        defaultSets: 3,
        targetReps: "12-15",
        suggestedWeight: "Hafif-Orta",
        tips: "Göğüste izole esneme ve sıkışma. Kollar hafif bükülü, tepe noktada göğsü 1-2 saniye sıkın."
      },
      {
        id: "d1_e4",
        name: "Rope Triceps Pushdown (Cable)",
        tag: "Triceps",
        defaultSets: 4,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Dirsekleri gövdeye sabitleyin, alt noktada halat uçlarını iki yana açıp triceps'i kilitleyin."
      },
      {
        id: "d1_e5",
        name: "Dumbbell Overhead Triceps Extension",
        tag: "Triceps (Uzun Baş)",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "8-12 kg",
        tips: "Triceps uzun başı için. Dirsekleri baş hizasında tutun, dambılı ensenize kontrollü indirip yukarı basın."
      }
    ]
  },
  {
    id: "day2",
    dayName: "2. GÜN (SALI)",
    title: "Sırt + Biceps (Sırt Genişliği & Çekiş Focus)",
    isRest: false,
    focus: ["Kanat Genişliği", "Sırt Kalınlığı", "Tek Kol Row", "Arka Omuz", "Biceps Uzun Baş", "Ön Kol"],
    exercises: [
      {
        id: "d2_e1",
        name: "Lat Pulldown (Machine/Cable)",
        tag: "Kanat",
        defaultSets: 4,
        targetReps: "8-10",
        suggestedWeight: "Orta-Ağır",
        tips: "Kanat genişliği. Barı üst göğse çekerken dirsekleri aşağı-geriye bastırıp lat kasını sıkın."
      },
      {
        id: "d2_e2",
        name: "Seated Cable Row",
        tag: "Sırt Kalınlığı",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Sırt kalınlığı ve kürek kemiği aktivasyonu. Göğsü dik tutarak çekişi karnınıza doğru yapın."
      },
      {
        id: "d2_e3",
        name: "Dumbbell Single-Arm Row",
        tag: "Sırt",
        defaultSets: 3,
        targetReps: "8-10",
        suggestedWeight: "10-14 kg",
        tips: "Tek taraflı güç ve esneme. Dambılı kalça hizasına doğru çekerek lat kasını maksimum gerin."
      },
      {
        id: "d2_e4",
        name: "Machine Rear Delt Fly (Reverse Pec Deck)",
        tag: "Arka Omuz",
        defaultSets: 3,
        targetReps: "12-15",
        suggestedWeight: "Hafif-Orta",
        tips: "Arka omuz ve üst sırt detayı. Dirsekleri hafif kırık tutarak kolları geriye doğru açın."
      },
      {
        id: "d2_e5",
        name: "Incline Dumbbell Curl",
        tag: "Biceps (Uzun Baş)",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "6-10 kg",
        tips: "Biceps uzun başı. Eğimli sehpada kolu tam esnetin ve kaldırırken bileği hafif dışa çevirin."
      },
      {
        id: "d2_e6",
        name: "Cable Hammer Curl (Rope ile)",
        tag: "Brachialis & Ön Kol",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Brachialis ve ön kol. Halatı nötr tutuşla yukarı çekin, üst noktada dirseği oynatmadan sıkın."
      }
    ]
  },
  {
    id: "day3",
    dayName: "3. GÜN (ÇARŞAMBA)",
    title: "Dinlenme / Aktif Dinlenme",
    isRest: true,
    tips: "Toparlanma günü. Kas onarımı için protein ve su hedefinize dikkat edin, hafif yürüyüş yapabilirsiniz."
  },
  {
    id: "day4",
    dayName: "4. GÜN (PERŞEMBE)",
    title: "Üst Göğüs + Sırt (Hacim & Orantı Focus)",
    isRest: false,
    focus: ["Üst Göğüs Makine", "Düz Göğüs Pres", "Lat V-Grip", "Destekli Row", "Pullover"],
    exercises: [
      {
        id: "d4_e1",
        name: "Incline Chest Press Machine",
        tag: "Üst Göğüs",
        defaultSets: 3,
        targetReps: "8-10",
        suggestedWeight: "Orta-Ağır",
        tips: "Üst göğüs hipertrofisi. Omuzları geriye kilitleyip kontrollü negatifle itin."
      },
      {
        id: "d4_e2",
        name: "Flat Dumbbell Press",
        tag: "Göğüs",
        defaultSets: 3,
        targetReps: "8-10",
        suggestedWeight: "12-16 kg",
        tips: "Düz sehpada genel göğüs kütlesi. Dambılları göğüs hizasına kontrollü indirin."
      },
      {
        id: "d4_e3",
        name: "Lat Pulldown (V-Grip veya Close-Grip)",
        tag: "Sırt / Kanat",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Dar tutuşla kanatların alt kısmına ve kalınlığına odaklanın. Göğse doğru çekin."
      },
      {
        id: "d4_e4",
        name: "Machine Chest-Supported Row (veya T-Bar)",
        tag: "Sırt Kalınlığı",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Bel baskısı olmadan sırt kalınlaştırma. Göğsü dayayarak kürek kemiklerini sıkıştırın."
      },
      {
        id: "d4_e5",
        name: "Dumbbell Pullover",
        tag: "Göğüs Kafesi & Lat",
        defaultSets: 3,
        targetReps: "12",
        suggestedWeight: "10-14 kg",
        tips: "Göğüs kafesi genişletme ve lat esnetme. Dambılı baş arkasına uzatıp göğüs hizasına getirin."
      }
    ]
  },
  {
    id: "day5",
    dayName: "5. GÜN (CUMA)",
    title: "Kol Odaklı Gün (Biceps + Triceps + Omuz)",
    isRest: false,
    focus: ["Biceps Temel", "Skullcrusher", "Preacher Curl", "Dip Makine", "Yan Omuz"],
    exercises: [
      {
        id: "d5_e1",
        name: "EZ-Bar veya Dumbbell Biceps Curl",
        tag: "Biceps",
        defaultSets: 4,
        targetReps: "8-10",
        suggestedWeight: "Orta Ağırlık",
        tips: "Biceps temel kütlesi. Dirsekleri vücuda yapışık tutarak gövdeden ivme almadan kaldırın."
      },
      {
        id: "d5_e2",
        name: "Skullcrusher (EZ-Bar / Dumbbell ile)",
        tag: "Triceps",
        defaultSets: 4,
        targetReps: "8-10",
        suggestedWeight: "Orta Ağırlık",
        tips: "Triceps kütlesi için kilit hareket. Dirsekleri sabit tutarak alına indirin ve yukarı kilitleyin."
      },
      {
        id: "d5_e3",
        name: "Machine Preacher Curl",
        tag: "Biceps İzolasyon",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Hafif-Orta",
        tips: "Tepe noktası izolasyonu. Kolları pede tam sabitleyip tepe noktada biceps'i sıkın."
      },
      {
        id: "d5_e4",
        name: "Dip Machine veya Cable Dips",
        tag: "Triceps & İtiş",
        defaultSets: 3,
        targetReps: "10-12",
        suggestedWeight: "Orta Ağırlık",
        tips: "Gövdeyi dik tutarak triceps odaklı itiş gerçekleştirin."
      },
      {
        id: "d5_e5",
        name: "Dumbbell Lateral Raise",
        tag: "Yan Omuz",
        defaultSets: 4,
        targetReps: "12-15",
        suggestedWeight: "4-8 kg",
        tips: "Yan omuz genişliği. Dirsekleri hafif kırık tutarak dambılları omuz hizasına kadar yana açın."
      }
    ]
  },
  {
    id: "day6",
    dayName: "6. GÜN (CUMARTESİ)",
    title: "Hafta Sonu Dinlenme / Aktif Dinlenme",
    isRest: true,
    tips: "Kas onarımı ve merkezi sinir sistemini yenilemek için dinlenme günü."
  },
  {
    id: "day7",
    dayName: "7. GÜN (PAZAR)",
    title: "Hafta Sonu Dinlenme & Yeni Haftaya Hazırlık",
    isRest: true,
    tips: "Yeni haftanın antrenman hedeflerine hazırlık, uyku ve beslenmeye özen gösterin."
  }
];
