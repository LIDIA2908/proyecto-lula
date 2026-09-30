import { CharacterState } from "../components/LottieCharacter";

export interface AIResponse {
  replySpanish: string;
  replyEnglish: string;
  emotion: CharacterState;
  category?: string;
}

// Rich General Knowledge fallback topics for Lula
const CULTURA_GENERAL_FALLBACKS: Array<{
  keywords: string[];
  replySpanish: string;
  replyEnglish: string;
  emotion: CharacterState;
  category: string;
}> = [
  {
    keywords: ["hola", "buenos dias", "buenas noches", "quien eres", "nombre", "hola lula", "lula"],
    replySpanish: "¡Hola! Soy Lula. ¡Pregúntame lo que quieras sobre ciencia, historia, geografía o arte!",
    replyEnglish: "Hello! I'm Lula. Ask me anything about science, history, geography or art!",
    emotion: "feliz",
    category: "Bienvenida",
  },
  {
    keywords: ["sol", "luna", "planeta", "marte", "galaxia", "espacio", "universo", "estrella", "luz"],
    replySpanish: "¡El Sol es una estrella gigante y representa el 99.8% de toda la masa de nuestro Sistema Solar!",
    replyEnglish: "The Sun is a giant star and accounts for 99.8% of all mass in our Solar System!",
    emotion: "feliz",
    category: "Ciencia y Astronomía",
  },
  {
    keywords: ["piramide", "egipto", "historia", "roma", "griego", "siglo", "imperio", "cristobal colon"],
    replySpanish: "La Gran Pirámide de Guiza es la única de las Siete Maravillas del Mundo Antiguo que aún sigue en pie hoy en día.",
    replyEnglish: "The Great Pyramid of Giza is the only one of the Seven Wonders of the Ancient World still standing today.",
    emotion: "hablando",
    category: "Historia Universal",
  },
  {
    keywords: ["capital", "pais", "francia", "paris", "japon", "tokio", "continente", "oceano", "rio"],
    replySpanish: "El río Amazonas es el más caudaloso y largo del mundo, atravesando gran parte de América del Sur.",
    replyEnglish: "The Amazon River is the largest and longest river in the world, traversing much of South America.",
    emotion: "hablando",
    category: "Geografía Mundial",
  },
  {
    keywords: ["dinosaurio", "dinosaurios", "extincion", "meteorito", "titanic", "guerra", "desastre", "triste", "tragedia", "peligro"],
    replySpanish: "Los dinosaurios se extinguieron hace 66 millones de años debido al impacto de un asteroide masivo en la Tierra.",
    replyEnglish: "Dinosaurs went extinct 66 million years ago due to a massive asteroid impact on Earth.",
    emotion: "triste",
    category: "Historia y Paleontología",
  },
  {
    keywords: ["mona lisa", "pintura", "da vinci", "arte", "musica", "cine", "pelicula", "mozart", "cancion"],
    replySpanish: "Leonardo da Vinci tardó más de 10 años en pintar los labios de la famosa Mona Lisa.",
    replyEnglish: "Leonardo da Vinci took more than 10 years to paint the lips of the famous Mona Lisa.",
    emotion: "feliz",
    category: "Arte y Cultura",
  },
  {
    keywords: ["corazon", "cerebro", "cuerpo", "sangre", "celula", "hueso", "adn"],
    replySpanish: "El corazón humano bombea aproximadamente 7,500 litros de sangre todos los días sin descansar.",
    replyEnglish: "The human heart pumps approximately 7,500 liters of blood every day without resting.",
    emotion: "hablando",
    category: "Biología Humana",
  },
  {
    keywords: ["ballena", "animal", "perro", "gato", "guepardo", "ave", "insecto", "naturaleza"],
    replySpanish: "La ballena azul es el animal más grande que jamás ha existido en la historia del planeta Tierra, ¡más grande que cualquier dinosaurio!",
    replyEnglish: "The blue whale is the largest animal to have ever lived in the history of planet Earth, bigger than any dinosaur!",
    emotion: "feliz",
    category: "Naturaleza y Fauna",
  },
];

// Dynamic Math / Calculation Solver for simple and complex math questions offline
function trySolveMath(question: string): AIResponse | null {
  const clean = question.toLowerCase().replace(/¿|\?|cuanto es|calcula|calculame|resultado de|dime cuanto es/g, "").trim();
  // Match math pattern like 25 + 4, 100 / 5, 2^3, 50 * 4
  const mathMatch = clean.match(/^([\d.\s+\-*/()^x]+)$/);
  if (mathMatch) {
    try {
      const expr = mathMatch[1].replace(/x/g, "*").replace(/\^/g, "**");
      /* eslint-disable-next-line no-eval */
      const result = eval(expr);
      if (typeof result === "number" && !isNaN(result)) {
        return {
          replySpanish: `El resultado de la operación matemática "${mathMatch[1].trim()}" es ${result}.`,
          replyEnglish: `The result of the math operation "${mathMatch[1].trim()}" is ${result}.`,
          emotion: "feliz",
          category: "Matemáticas",
        };
      }
    } catch {
      // Ignore if not a valid math expression
    }
  }
  return null;
}

export async function askAIAgent(userQuestion: string): Promise<AIResponse> {
  const normalized = userQuestion.toLowerCase().trim();

  // 1. Try solving simple math expressions offline first
  const mathResult = trySolveMath(userQuestion);
  if (mathResult) return mathResult;

  // 2. Try Gemini API if key is present in environment variables
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const rawKey =
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== "undefined" && (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY)) ||
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (typeof window !== "undefined" && (window as any).VITE_GEMINI_API_KEY);

  const apiKey =
    rawKey && typeof rawKey === "string" && rawKey.trim() !== "" && !rawKey.includes("tu_clave")
      ? rawKey.trim()
      : null;

  if (apiKey) {
    const modelsToTry = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
    ];

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Eres Lula, una asistente virtual inteligente, simpática y divertida que está en una llamada telefónica interactiva con el usuario. Respondes a TODO TIPO DE PREGUNTAS en español.

REGLAS DE RESPUESTA:
1. Responde a la pregunta del usuario en español de forma concisa, conversacional y amable (máximo 2-3 oraciones).
2. Añade la traducción al inglés en la línea siguiente comenzando con "EN: ".
3. Al final del texto debes incluir exactamente UNO de los siguientes 4 estados entre llaves según el tema/tono:
   - {feliz} para datos alegres, curiosidades fascinantes, logros o respuestas entusiastas.
   - {triste} para tragedias, desastres, extinciones o temas tristes.
   - {hablando} para explicaciones, conceptos, tecnología o definiciones estándar.
   - {neutral} para datos formales o cálculos neutros.

Pregunta del usuario: "${userQuestion}"`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const fullText: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

          let emotion: CharacterState = "hablando";
          if (fullText.includes("{feliz}")) emotion = "feliz";
          else if (fullText.includes("{triste}")) emotion = "triste";
          else if (fullText.includes("{neutral}")) emotion = "neutral";

          const cleanText = fullText.replace(/\{feliz\}|\{triste\}|\{hablando\}|\{neutral\}/g, "").trim();
          const parts = cleanText.split("EN:");

          return {
            replySpanish: parts[0]?.trim() || cleanText,
            replyEnglish: parts[1]?.trim() || "Fascinating point!",
            emotion,
          };
        } else {
          const errText = await response.text();
          console.warn(`Gemini API request with ${modelName} returned ${response.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Gemini API request with ${modelName} failed:`, err);
      }
    }
  }

  // 3. Fallback pattern matcher for offline knowledge topics
  for (const item of CULTURA_GENERAL_FALLBACKS) {
    const matched = item.keywords.some((kw) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?:^|\\s|\\b)${escaped}(?:$|\\s|\\b|s)`, "i");
      return regex.test(normalized);
    });

    if (matched) {
      return {
        replySpanish: item.replySpanish,
        replyEnglish: item.replyEnglish,
        emotion: item.emotion,
        category: item.category,
      };
    }
  }

  // 4. Dynamic general fallback reasoning
  let fallbackEmotion: CharacterState = "hablando";
  if (
    normalized.includes("triste") ||
    normalized.includes("muerte") ||
    normalized.includes("guerra") ||
    normalized.includes("error") ||
    normalized.includes("desastre") ||
    normalized.includes("malo")
  ) {
    fallbackEmotion = "triste";
  } else if (
    normalized.includes("feliz") ||
    normalized.includes("sol") ||
    normalized.includes("gracias") ||
    normalized.includes("hola") ||
    normalized.includes("lula")
  ) {
    fallbackEmotion = "feliz";
  }

  return {
    replySpanish: `¡Qué buena pregunta sobre "${userQuestion}"! Me encanta platicar contigo sobre esto.`,
    replyEnglish: `What a great question about "${userQuestion}"! I love chatting with you about this.`,
    emotion: fallbackEmotion,
    category: "Conversación",
  };
}


