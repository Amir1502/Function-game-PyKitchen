import { Ingredient, IngredientType, Tool, Order, Difficulty } from './types';

// --- INGREDIENTS (Variables) ---
export const INITIAL_PANTRY: Ingredient[] = [
  {
    id: 'ing_1',
    name: 'price_a',
    value: 10,
    displayValue: '10',
    type: IngredientType.INTEGER,
    description: 'Цена первого товара (число).'
  },
  {
    id: 'ing_2',
    name: 'price_b',
    value: 25,
    displayValue: '25',
    type: IngredientType.INTEGER,
    description: 'Цена второго товара (число).'
  },
  {
    id: 'ing_3',
    name: 'cart_items',
    value: [5, 10, 15, 20],
    displayValue: '[5, 10, 15, 20]',
    type: IngredientType.LIST,
    description: 'Список цен товаров в корзине.'
  },
  {
    id: 'ing_4',
    name: 'user_name',
    value: 'Alice',
    displayValue: '"Alice"',
    type: IngredientType.STRING,
    description: 'Имя пользователя (строка).'
  },
  {
    id: 'ing_7',
    name: 'greeting',
    value: 'Hello, ',
    displayValue: '"Hello, "',
    type: IngredientType.STRING,
    description: 'Приветственная фраза.'
  },
  {
    id: 'ing_6',
    name: 'mixed_bag',
    value: [100, 20, 5, 200],
    displayValue: '[100, 20, 5, 200]',
    type: IngredientType.LIST,
    description: 'Список разных чисел.'
  }
];

// --- TOOLS (Python Functions) ---
export const TOOLS: Tool[] = [
  {
    id: 'tool_add',
    name: 'add',
    description: 'Складывает два числа или объединяет строки.',
    signature: 'add(a, b)',
    pythonDoc: 'def add(a, b):\n    # Возвращает сумму a + b\n    return a + b',
    args: [
      { name: 'a', allowedTypes: [IngredientType.INTEGER, IngredientType.STRING] },
      { name: 'b', allowedTypes: [IngredientType.INTEGER, IngredientType.STRING] }
    ],
    execute: (a, b) => a + b
  },
  {
    id: 'tool_sum',
    name: 'sum',
    description: 'Вычисляет сумму всех чисел в списке.',
    signature: 'sum(iterable)',
    pythonDoc: 'def sum(iterable):\n    total = 0\n    for x in iterable:\n        total += x\n    return total',
    args: [
      { name: 'iterable', allowedTypes: [IngredientType.LIST] }
    ],
    execute: (arr) => {
       if (!Array.isArray(arr)) throw new Error("Аргумент должен быть списком");
       return arr.reduce((acc, curr) => acc + curr, 0);
    }
  },
  {
    id: 'tool_len',
    name: 'len',
    description: 'Возвращает длину списка или строки.',
    signature: 'len(obj)',
    pythonDoc: 'def len(obj):\n    # Возвращает количество элементов\n    return length_of_object',
    args: [
      { name: 'obj', allowedTypes: [IngredientType.LIST, IngredientType.STRING] }
    ],
    execute: (obj) => obj.length
  },
  {
    id: 'tool_max',
    name: 'max',
    description: 'Находит самый большой элемент в списке.',
    signature: 'max(iterable)',
    pythonDoc: 'def max(iterable):\n    # Возвращает максимальное значение\n    return largest_item',
    args: [
      { name: 'iterable', allowedTypes: [IngredientType.LIST] }
    ],
    execute: (arr) => {
        if (!Array.isArray(arr)) throw new Error("Аргумент должен быть списком");
        return Math.max(...arr);
    }
  },
  {
    id: 'tool_first',
    name: 'get_first',
    description: 'Возвращает первый элемент списка.',
    signature: 'get_first(lst)',
    pythonDoc: 'def get_first(lst):\n    # Возвращает элемент с индексом 0\n    return lst[0]',
    args: [
      { name: 'lst', allowedTypes: [IngredientType.LIST] }
    ],
    execute: (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) throw new Error("Список пуст или не является списком");
        return arr[0];
    }
  }
];

// --- ORDERS (Levels) ---
export const ORDERS: Order[] = [
  {
    id: 'ord_1',
    title: 'Сумма покупки',
    description: 'Клиент выбрал два товара. Рассчитайте общую стоимость, сложив `price_a` и `price_b`.',
    difficulty: Difficulty.EASY,
    expectedResult: 35,
    hint: 'Используйте функцию add() для сложения двух чисел.',
    learningGoal: 'В Python для сложения чисел используется оператор `+`. В нашей игре его роль выполняет функция `add(a, b)`. Переменные (ингредиенты) хранят значения, которые мы можем использовать многократно.',
    requiredToolId: 'tool_add'
  },
  {
    id: 'ord_2',
    title: 'Инвентаризация',
    description: 'Нам нужно узнать, сколько всего товаров находится в списке `cart_items`. Не их сумму, а именно количество штук.',
    difficulty: Difficulty.EASY,
    expectedResult: 4,
    hint: 'Функция len() возвращает длину (количество элементов) списка.',
    learningGoal: 'Функция `len()` — это встроенная функция Python. Она универсальна и может посчитать количество элементов в списке, символов в строке или ключей в словаре.',
    requiredToolId: 'tool_len'
  },
  {
    id: 'ord_3',
    title: 'Общая выручка',
    description: 'Посчитайте общую стоимость всех товаров в корзине `cart_items`.',
    difficulty: Difficulty.MEDIUM,
    expectedResult: 50,
    hint: 'Используйте sum() для списка.',
    learningGoal: 'Чтобы не складывать элементы списка вручную (a[0] + a[1]...), Python предлагает функцию `sum()`, которая автоматически проходит по всему списку и возвращает сумму всех чисел.',
    requiredToolId: 'tool_sum'
  },
  {
    id: 'ord_4',
    title: 'Дорогой товар',
    description: 'Найдите товар с самой высокой ценой в списке `mixed_bag`.',
    difficulty: Difficulty.MEDIUM,
    expectedResult: 200,
    hint: 'Функция max() ищет максимальное значение.',
    learningGoal: 'Функции `min()` и `max()` позволяют быстро находить экстремальные значения в коллекциях данных без необходимости писать сложные циклы сравнения.',
    requiredToolId: 'tool_max'
  },
  {
    id: 'ord_5',
    title: 'Приветствие',
    description: 'Создайте вежливое приветствие для клиента. Объедините строку `greeting` и имя `user_name`.',
    difficulty: Difficulty.MEDIUM,
    expectedResult: "Hello, Alice",
    hint: 'Функция add() умеет работать и со строками!',
    learningGoal: 'В Python оператор `+` полиморфен. Это значит, что он работает по-разному для разных типов данных: числа он складывает (1+1=2), а строки — склеивает (конкатенирует) ("A"+"B"="AB").',
    requiredToolId: 'tool_add'
  },
  {
    id: 'ord_6',
    title: 'Первый в очереди',
    description: 'Получите стоимость самого первого товара из списка `cart_items`.',
    difficulty: Difficulty.HARD,
    expectedResult: 5,
    hint: 'Используйте функцию get_first() для получения начального элемента.',
    learningGoal: 'Элементы в списке Python пронумерованы (проиндексированы). Нумерация всегда начинается с нуля! Первый элемент имеет индекс 0, второй — 1 и так далее.',
    requiredToolId: 'tool_first'
  }
];