import { GoogleGenAI } from "@google/genai";
import { Order, Tool, Ingredient } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize safely. 
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const getAiHelp = async (
  currentOrder: Order,
  selectedTool: Tool | null,
  placedIngredients: (Ingredient | null)[],
  lastError: string | null,
  failedAttempts: number = 0
): Promise<string> => {
  
  if (!ai) {
    return currentOrder.hint || "Попробуйте проверить ожидаемый результат и ваши аргументы.";
  }

  const model = "gemini-3-flash-preview";
  
  const toolName = selectedTool ? selectedTool.name : "Ничего";
  const args = placedIngredients.map(i => i ? `${i.name} (значение: ${JSON.stringify(i.value)}, тип: ${i.type})` : "Пусто").join(", ");
  
  // Logic for progressive hinting
  let hintStrategy = "";
  if (failedAttempts < 2) {
    hintStrategy = "Дай КОНЦЕПТУАЛЬНУЮ подсказку. Объясни логику (например, 'Чтобы найти сумму, нужно сложить элементы'). Не называй конкретную функцию, если это не критично.";
  } else {
    hintStrategy = "Дай ПРЯМУЮ подсказку. Пользователь застрял. Предложи конкретную функцию или укажи на ошибку в аргументах.";
  }

  const prompt = `
    Ты дружелюбный Шеф-повар и преподаватель Python в игре 'PyKitchen'.
    Пользователь пытается решить задачу по программированию.
    ОТВЕЧАЙ НА РУССКОМ ЯЗЫКЕ.
    
    Контекст уровня:
    - Задача: ${currentOrder.description}
    - Ожидаемый результат: ${JSON.stringify(currentOrder.expectedResult)}
    - Цель обучения: ${currentOrder.learningGoal}
    - Стратегия подсказки: ${hintStrategy}
    
    Текущая попытка пользователя:
    - Выбранная функция: ${toolName}
    - Аргументы: [${args}]
    - Последняя ошибка: ${lastError || "Нет (просто просит помощи)"}
    
    Инструкции:
    1. Будь краток (максимум 2-3 предложения).
    2. Используй кулинарные метафоры (ингредиенты, рецепт, инструменты).
    3. НИКОГДА не пиши готовый код решения.
    4. Направляй игрока к правильному использованию функций Python.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Продолжайте попытки! У вас получится.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return currentOrder.hint || "Шеф-повар сейчас занят. Проверьте аргументы функции!";
  }
};