import { Exam, JLPTLevel } from "./types";

export const LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

// Mock Content Generator Helper
const createMockQuestion = (id: string, type: any, num: number): any => {
  if (type === 'vocabulary') {
    return {
      id, type, number: num,
      context: "この{漢字|かんじ}の{読み方|よみかた}を{教|おし}えてください。",
      question: "「{準備|じゅんび}」の{読|よ}み{方|かた}はどれですか。",
      options: [
        { id: 'a', text: 'じゅんび' },
        { id: 'b', text: 'せんび' },
        { id: 'c', text: 'しょくび' },
        { id: 'd', text: 'そなえ' },
      ],
      correctOptionId: 'a',
      explanation: "「{準備|じゅんび}」は「じゅんび」と{読|よ}みます。Translation: Preparation."
    };
  }
  if (type === 'grammar') {
    return {
      id, type, number: num,
      context: "{明日|あした}、{雨|あめ}が______、ピクニックに{行|い}きません。",
      question: "（　　）に{入|い}れるのに{最|もっと}もよいものを{一|ひと}つ{選|えら}びなさい。",
      options: [
        { id: 'a', text: '{降|ふ}ったら' },
        { id: 'b', text: '{降|ふ}れば' },
        { id: 'c', text: '{降|ふ}ると' },
        { id: 'd', text: '{降|ふ}って' },
      ],
      correctOptionId: 'a',
      explanation: "Conditional 'tara' is best here for specific future condition."
    };
  }
  if (type === 'reading') {
    return {
      id, type, number: num,
      readingText: "{日本|にほん}の{夏|なつ}はとても{蒸|む}し{暑|あつ}いです。{多|おお}くの{人|ひと}がエアコンを{使|つか}いますが、{最近|さいきん}は{電気代|でんきだい}が{高|たか}くなっています。それで、{昔|むかし}ながらの「{扇風機|せんぷうき}」や「{風鈴|ふうりん}」を{使|つか}う{人|ひと}も{増|ふ}えています。{自然|しぜん}の{風|かぜ}を{感|かん}じることは、{体|からだ}にも{良|よ}いと{言|い}われています。",
      question: "なぜ{扇風機|せんぷうき}を{使|つか}う{人|ひと}が{増|ふ}えていますか。",
      options: [
        { id: 'a', text: 'エアコンが{壊|こわ}れやすいから' },
        { id: 'b', text: '{電気代|でんきだい}が{高|たか}くなっているから' },
        { id: 'c', text: '{扇風機|せんぷうき}の{方|ほう}が{涼|すず}しいから' },
        { id: 'd', text: '{風鈴|ふうりん}が{好|す}きだから' },
      ],
      correctOptionId: 'b',
      explanation: "The text says 'recently electricity costs are becoming high' ({最近|さいきん}は{電気代|でんきだい}が{高|たか}くなっています)."
    };
  }
  if (type === 'listening') {
    return {
      id, type, number: num,
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav", // Placeholder
      question: "{男|おとこ}の{人|ひと}はこれから{何|なに}をしますか。",
      imageUrl: "https://picsum.photos/400/200",
      options: [
        { id: 'a', text: '{資料|しりょう}をコピーする' },
        { id: 'b', text: '{会議室|かいぎしつ}を{予約|よやく}する' },
        { id: 'c', text: '{部長|ぶちょう}に{電話|でんわ}する' },
        { id: 'd', text: 'コーヒーを{買|か}う' },
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