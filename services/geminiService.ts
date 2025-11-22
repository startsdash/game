import { GoogleGenAI, Type } from "@google/genai";
import { Director, GameScenario, GameResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SCENARIO_THEMES = [
  "Бытовая Рутина: уборка квартиры, поход в 'Пятерочку', переполненная маршрутка, соседи с перфоратором, отключили горячую воду.",
  "Любовь и Отношения: неловкое первое свидание, ссора из-за пустяка, знакомство с родителями, бывший/бывшая написали ночью.",
  "Работа и Карьера: собеседование с глупым HR, дедлайн горит, корпоратив, начальник-самодур, попытка попросить повышение.",
  "Друзья и Социум: друг просит в долг, вечеринка пошла не по плану, встреча одноклассников, неловкий разговор в лифте.",
  "Учеба и Саморазвитие: подготовка к экзамену в последнюю ночь, попытка начать бегать с понедельника, прокрастинация, инфоцыгане."
];

const GET_SCENARIO_PROMPT = (theme: string) => `
Ты — сценарист жизненных драм и комедий положений.
Твоя текущая ТЕМА: ${theme}.

Твоя задача:
1. Придумать узнаваемую, жизненную ситуацию (бытовую, рабочую или личную). Ситуация должна быть реалистичной, с которой сталкивался каждый (или многие).
2. Описать ситуацию (1-2 предложения). Без лишней фантастики, чистый "жизненный реализм".
3. Предложи 3 варианта действия для игрока.

Варианты действий:
1. Дерзкий/Прямой (пойти на конфликт, сказать правду в лицо, сделать по-своему).
2. Странный/Нелепый (сделать вид, что ничего не происходит, отшутиться невпопад, абсурдная реакция).
3. Стандартный/Пассивный (смириться, промолчать, сделать "как принято").

Язык: Русский, живой, разговорный.
`;

const RESULT_SYSTEM_PROMPT = `
Ты — циничный киноман, знаток переводов Гоблина (Дмитрий Пучков) и фанат русской культовой классики (Балабанов, ДМБ, Особенности национальной охоты).

Контекст:
Игрок находится в обычной БЫТОВОЙ ситуации (работа, дом, отношения).
Он совершил определенное действие.

Твоя задача:
Дать реакцию на это действие в виде ЦИТАТЫ из фильма.
ГЛАВНОЕ: Цитата должна предлагать НЕОЖИДАННЫЙ взгляд на эту бытовую ситуацию. Она должна переосмыслить рутину как эпичную драму, криминальную разборку или философский тупик.

ПРАВИЛА ПОДБОРА ЦИТАТ:
1. **Американские фильмы** (Тарантино, Ричи, Коэны, Цельнометаллическая оболочка и др.): Использовать стилистику перевода **Гоблина**. Жестко, смешно, с характерными оборотами ("малолетний дебил", "мега-вещь", "тупое говно тупого говна" и т.д., если уместно).
2. **Русские фильмы** (Брат, Жмурки, ДМБ, Даун Хаус, Ширли-Мырли, Особенности охоты): Аутентичные цитаты. Народная мудрость, армейский абсурд, бандитская философия 90-х.
3. **Мат**: Допустим, если он есть в оригинале цитаты (или в стиле Гоблина) и усиливает комический эффект.
4. **Смысл**: Цитата не обязана описывать действие буквально. Она должна передавать НАСТРОЕНИЕ или СУТЬ происходящего (метафора).

Примеры логики:
- Ситуация: Игрок моет гору посуды. Цитата из "Бойцовского клуба" про рабство вещей или из "ДМБ" про то, что "духи" должны летать.
- Ситуация: Начальник орет. Цитата сержанта Хартмана (Гоблин) или Михалкова из "Жмурок".
- Ситуация: Игрок тупит на свидании. Цитата "Ты, я погляжу, не дурак выпить" или "Сказочный долбо*б".

Формат ответа JSON:
quote: Сама цитата.
character: Кто сказал.
movie: Фильм.
director: Режиссер.
year: Год.
`;

export const createScenario = async (): Promise<GameScenario> => {
  const theme = SCENARIO_THEMES[Math.floor(Math.random() * SCENARIO_THEMES.length)];

  if (!apiKey) {
    return {
      context: "Ты стоишь перед полкой с макаронами в супермаркете. Акция '3 по цене 2' закончилась минуту назад перед твоим носом.",
      options: [
        { id: "1", text: "Устроить скандал на кассе, требуя справедливости" },
        { id: "2", text: "Взять гречку и сделать вид, что ты на ПП" },
        { id: "3", text: "Молча уйти, проклиная капитализм" }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Придумай жизненную ситуацию и варианты.",
      config: {
        systemInstruction: GET_SCENARIO_PROMPT(theme),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            context: { type: Type.STRING, description: "Описание жизненной ситуации." },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING, description: "Вариант действия." }
                }
              }
            }
          },
          required: ["context", "options"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as GameScenario;

  } catch (error) {
    console.error("Scenario Error:", error);
    throw error;
  }
};

export const resolveRound = async (scenarioContext: string, userAction: string, likedQuotes: string[] = []): Promise<GameResult> => {
  if (!apiKey) {
    return {
      userAction: userAction,
      quote: "В чем сила, брат?",
      character: "Данила Багров",
      movie: "Брат 2",
      director: Director.BALABANOV,
      year: "2000",
      themeColor: "bg-slate-800"
    };
  }

  try {
    // 1. Generate Text Response
    let prompt = `Бытовая Ситуация: ${scenarioContext}. Выбор игрока: ${userAction}. Дай неожиданную цитату-реакцию (Гоблин стайл или Русская классика).`;
    
    if (likedQuotes.length > 0) {
      prompt += `\n\nКонтекст вкуса игрока (ему нравилось ранее): ${likedQuotes.slice(-3).join('; ')}`;
    }

    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: RESULT_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING, description: "Цитата." },
            character: { type: Type.STRING, description: "Кто сказал." },
            movie: { type: Type.STRING, description: "Фильм." },
            director: { type: Type.STRING, description: "Режиссер." },
            year: { type: Type.STRING, description: "Год." },
          },
          required: ["quote", "character", "movie", "director", "year"]
        }
      }
    });

    const text = textResponse.text;
    if (!text) throw new Error("Empty response");
    const data = JSON.parse(text);

    // 2. Generate Image Response (Imagen)
    let imageUrl: string | undefined;
    try {
      // Extremely aggressive No-Text Prompt
      const imagePrompt = `
        CRITICAL RULE: NO TEXT. NO WORDS. NO LETTERS. NO NUMBERS. NO SPEECH BUBBLES. NO SUBTITLES.
        The image must be a pure, text-free animation frame.

        Style: Adult Swim surreal 2D animation (similar to Smiling Friends, Superjail, Rick and Morty, Mr. Pickles).
        Visuals: Flat shading, bold black outlines, vibrant/acid colors, slightly grotesque or exaggerated character design.
        Atmosphere: Absurd, chaotic, cynical, funny.

        Subject: The character "${data.character}" from the movie "${data.movie}".
        Context: The character is inside a mundane environment: "${scenarioContext}".
        Action: The character is doing this: "${userAction}".

        Composition: A high-quality animation keyframe.
        Visual features: Expressive faces, weird background details.
        
        Again: DO NOT INCLUDE ANY TEXT OR TYPOGRAPHY IN THE IMAGE.
      `;

      // *** ИСПРАВЛЕННЫЙ ВЫЗОВ: ai.models.generateImages -> ai.images.generate ***
      const imageResponse = await ai.images.generate({
        // ИСПРАВЛЕННАЯ МОДЕЛЬ: 'imagen-4.0-generate-001' -> 'imagen-3.0-generate-002'
        model: 'imagen-3.0-generate-002', 
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '4:3',
          outputMimeType: 'image/jpeg'
        }
      });

      const base64ImageBytes = imageResponse.generatedImages?.[0]?.image?.imageBytes;
      if (base64ImageBytes) {
        imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      }
    } catch (imgError) {
      // Это консоль, которую мы искали. Теперь она, вероятно, не покажется.
      console.error("Image generation failed, proceeding with text only:", imgError); 
      // We don't throw here, just return result without image
    }

    const colors = [
      "bg-red-800", 
      "bg-yellow-700", 
      "bg-emerald-900", 
      "bg-slate-900", 
      "bg-purple-900", 
      "bg-orange-800", 
      "bg-stone-900"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      userAction: userAction,
      quote: data.quote,
      character: data.character,
      movie: data.movie,
      director: data.director as Director,
      year: data.year,
      themeColor: randomColor,
      imageUrl: imageUrl
    };
  } catch (error) {
    console.error("Resolution Error:", error);
    throw error;
  }
};
