import { Exam, JLPTLevel } from "./types";

export const LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

// Mock Content Generator Helper
const createMockQuestion = (id: string, type: any, num: number): any => {
  if (type === 'vocabulary') {
    return {
      id, type, number: num,
      context: "この漢字の<u>読み方</u>を教えてください。",
      question: "「準備」の読み方はどれですか。",
      options: [
        { id: 'a', text: 'じゅんび' },
        { id: 'b', text: 'せんび' },
        { id: 'c', text: 'しょくび' },
        { id: 'd', text: 'そなえ' },
      ],
      correctOptionId: 'a',
      explanation: "「準備」は「じゅんび」と読みます。Translation: Preparation."
    };
  }
  if (type === 'grammar') {
    return {
      id, type, number: num,
      context: "明日、雨が______、ピクニックに行きません。",
      question: "（　　）に入れるのに最もよいものを一つ選びなさい。",
      options: [
        { id: 'a', text: '降ったら' },
        { id: 'b', text: '降れば' },
        { id: 'c', text: '降ると' },
        { id: 'd', text: '降って' },
      ],
      correctOptionId: 'a',
      explanation: "Conditional 'tara' is best here for specific future condition."
    };
  }
  if (type === 'reading') {
    return {
      id, type, number: num,
      readingText: "日本の夏はとても蒸し暑いです。多くの人がエアコンを使いますが、最近は電気代が高くなっています。それで、昔ながらの「扇風機」や「風鈴」を使う人も増えています。自然の風を感じることは、体にも良いと言われています。",
      question: "なぜ扇風機を使う人が増えていますか。",
      options: [
        { id: 'a', text: 'エアコンが壊れやすいから' },
        { id: 'b', text: '電気代が高くなっているから' },
        { id: 'c', text: '扇風機の方が涼しいから' },
        { id: 'd', text: '風鈴が好きだから' },
      ],
      correctOptionId: 'b',
      explanation: "The text says 'recently electricity costs are becoming high' (最近は電気代が高くなっています)."
    };
  }
  if (type === 'listening') {
    return {
      id, type, number: num,
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav", // Placeholder
      question: "男の人はこれから何をしますか。",
      imageUrl: "https://picsum.photos/400/200",
      options: [
        { id: 'a', text: '資料をコピーする' },
        { id: 'b', text: '会議室を予約する' },
        { id: 'c', text: '部長に電話する' },
        { id: 'd', text: 'コーヒーを買う' },
      ],
      correctOptionId: 'a',
      explanation: "In the dialogue, the boss asks the man to prepare the documents first."
    };
  }
  return {};
};

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'n3-dec-2023',
    title: 'JLPT N3 Full Mock Exam (Dec 2023)',
    level: 'N3',
    totalQuestions: 15, // Reduced for demo
    totalDuration: 140,
    sections: [
      {
        id: 'sec-1',
        title: '言語知識 (文字・語彙)',
        durationMinutes: 30,
        questions: Array.from({ length: 5 }).map((_, i) => createMockQuestion(`v-${i}`, 'vocabulary', i + 1))
      },
      {
        id: 'sec-2',
        title: '言語知識 (文法) ・ 読解',
        durationMinutes: 70,
        questions: [
            ...Array.from({ length: 3 }).map((_, i) => createMockQuestion(`g-${i}`, 'grammar', i + 6)),
            ...Array.from({ length: 3 }).map((_, i) => createMockQuestion(`r-${i}`, 'reading', i + 9))
        ]
      },
      {
        id: 'sec-3',
        title: '聴解',
        durationMinutes: 40,
        questions: Array.from({ length: 4 }).map((_, i) => createMockQuestion(`l-${i}`, 'listening', i + 12))
      }
    ]
  },
  {
    id: 'n5-sample',
    title: 'JLPT N5 Starter Mock',
    level: 'N5',
    totalQuestions: 10,
    totalDuration: 90,
    sections: [
      {
        id: 'sec-1',
        title: 'Vocabulary & Grammar',
        durationMinutes: 50,
        questions: Array.from({ length: 10 }).map((_, i) => createMockQuestion(`n5-${i}`, 'vocabulary', i + 1))
      }
    ]
  }
];

export const LEVEL_STATS = {
  N1: { color: 'bg-red-500', count: 3, description: "Advanced Japanese used in a variety of circumstances." },
  N2: { color: 'bg-orange-500', count: 5, description: "Japanese used in everyday situations, and in a variety of circumstances to a certain degree." },
  N3: { color: 'bg-emerald-500', count: 8, description: "Japanese used in everyday situations to a certain degree." },
  N4: { color: 'bg-sky-500', count: 12, description: "Basic Japanese." },
  N5: { color: 'bg-indigo-500', count: 15, description: "Basic Japanese." },
};