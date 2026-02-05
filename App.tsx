import React, { useState, useEffect } from 'react';
import { 
  Ingredient, 
  Tool, 
  Order, 
  LogEntry 
} from './types';
import { INITIAL_PANTRY, TOOLS, ORDERS } from './constants';
import Pantry from './components/Pantry';
import Tools from './components/Tools';
import Workstation from './components/Workstation';
import { getAiHelp } from './services/geminiService';
import { ChefHat, CheckCircle2, AlertTriangle, MessageSquare, Terminal as TerminalIcon } from 'lucide-react';

const App: React.FC = () => {
  // Game State
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  // Workstation State
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [placedIngredients, setPlacedIngredients] = useState<(Ingredient | null)[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  
  // Feedback State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const currentOrder = ORDERS[levelIndex];

  // Initialize slots when tool changes
  useEffect(() => {
    if (selectedTool) {
      setPlacedIngredients(new Array(selectedTool.args.length).fill(null));
    } else {
      setPlacedIngredients([]);
    }
  }, [selectedTool]);

  // Logging Helper
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message
    };
    setLogs(prev => [entry, ...prev]);
  };

  // Interaction Handlers
  const handleSelectIngredient = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    // Visual feedback handled in Workstation by highlighting valid slots
  };

  const handleSelectTool = (tool: Tool) => {
    if (selectedTool?.id === tool.id) return;
    setSelectedTool(tool);
    setSelectedIngredient(null); // Reset selection
    addLog(`Выбран инструмент: ${tool.name}`, 'info');
  };

  const handleSlotClick = (index: number) => {
    if (!selectedIngredient) {
      return;
    }

    if (!selectedTool) return;

    // Type Checking (Basic)
    const requiredTypes = selectedTool.args[index].allowedTypes;
    if (!requiredTypes.includes(selectedIngredient.type)) {
      addLog(`Ошибка типа: ${selectedIngredient.name} это ${selectedIngredient.type}, но ${selectedTool.name} ожидает [${requiredTypes.join(', ')}]`, 'error');
      // Simple shake effect logic could go here
      return;
    }

    // Place it
    const newSlots = [...placedIngredients];
    newSlots[index] = selectedIngredient;
    setPlacedIngredients(newSlots);
    setSelectedIngredient(null); // Consumed interaction
    addLog(`Добавлен ${selectedIngredient.name} в аргумент ${index + 1}`, 'info');
  };

  const handleClearSlot = (index: number) => {
    const newSlots = [...placedIngredients];
    newSlots[index] = null;
    setPlacedIngredients(newSlots);
  };

  const handleClearAll = () => {
    if (selectedTool) {
        setPlacedIngredients(new Array(selectedTool.args.length).fill(null));
    }
  };

  const handleRun = () => {
    if (!selectedTool || !currentOrder) return;

    // 1. Check if all slots filled
    if (placedIngredients.some(i => i === null)) {
      addLog("Ошибка: Не все аргументы заполнены!", 'error');
      return;
    }

    try {
      // 2. Execute
      const args = placedIngredients.map(i => i!.value);
      const result = selectedTool.execute(...args);
      
      const resultStr = JSON.stringify(result);
      addLog(`Выполнение: ${selectedTool.name}(${args.join(', ')}) вернуло ${resultStr}`, 'info');

      // 3. Verify against Order
      const isCorrect = JSON.stringify(result) === JSON.stringify(currentOrder.expectedResult);

      if (isCorrect) {
        addLog(`УСПЕХ! Заказ выполнен. Результат: ${resultStr}`, 'success');
        setScore(prev => prev + 100);
        
        // Next Level Delay
        setTimeout(() => {
          if (levelIndex < ORDERS.length - 1) {
            setLevelIndex(prev => prev + 1);
            setFailedAttempts(0); // Reset failures for next level
            setSelectedTool(null);
            setLogs([]); // Clear logs for fresh start
            addLog("Поступил новый заказ!", 'info');
          } else {
             addLog("ВСЕ ЗАКАЗЫ ВЫПОЛНЕНЫ! Вы настоящий Шеф Python!", 'success');
          }
        }, 1500);
      } else {
        const newFailCount = failedAttempts + 1;
        setFailedAttempts(newFailCount);
        addLog(`Неверный результат. Ожидалось: ${currentOrder.expectedResult}, Получено: ${resultStr}`, 'error');
        
        if (newFailCount === 3) {
           setTimeout(() => {
             addLog("Шеф-повар: Трудно? Нажми 'Шеф-Помощник' для подсказки!", 'ai');
           }, 800);
        }
      }

    } catch (err: any) {
      setFailedAttempts(prev => prev + 1);
      addLog(`Ошибка выполнения: ${err.message}`, 'error');
    }
  };

  const handleGetHelp = async () => {
    setIsProcessing(true);
    addLog("Спрашиваем Шефа...", 'ai');
    
    // Get last error from logs
    const lastError = logs.find(l => l.type === 'error')?.message || null;

    // Pass failedAttempts to get smarter hints
    const helpText = await getAiHelp(currentOrder, selectedTool, placedIngredients, lastError, failedAttempts);
    
    addLog(`Шеф: ${helpText}`, 'ai');
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* HEADER */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-1.5 rounded text-slate-900">
            <ChefHat size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-blue-400">Py</span>Kitchen
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase font-bold">Текущий заказ</span>
            <span className="text-sm font-mono text-amber-400">Уровень {levelIndex + 1}/{ORDERS.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="flex flex-col items-end">
             <span className="text-xs text-slate-400 uppercase font-bold">Счет</span>
             <span className="text-sm font-mono text-green-400">{score} XP</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT: PANTRY */}
        <Pantry 
          ingredients={INITIAL_PANTRY} 
          onSelect={handleSelectIngredient} 
        />

        {/* CENTER: WORKSTATION & LOGS */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* MIDDLE: EDITOR */}
          <Workstation 
            selectedTool={selectedTool}
            slots={placedIngredients}
            onSlotClick={handleSlotClick}
            onClearSlot={handleClearSlot}
            onRun={handleRun}
            onClearAll={handleClearAll}
            onGetHelp={handleGetHelp}
            isProcessing={isProcessing}
            selectedIngredient={selectedIngredient}
            failedAttempts={failedAttempts}
            currentOrder={currentOrder}
          />

          {/* BOTTOM: CONSOLE */}
          <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
            <div className="h-8 bg-slate-900 flex items-center px-4 border-b border-slate-800 text-xs text-slate-400 gap-2">
               <TerminalIcon size={12} /> Консоль
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1.5">
               {logs.length === 0 && (
                 <span className="text-slate-600 italic">Готов к работе...</span>
               )}
               {logs.map((log) => (
                 <div key={log.id} className="flex gap-3 animate-fadeIn">
                    <span className="text-slate-600 text-xs min-w-[60px]">
                      {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </span>
                    <div className="flex-1 break-words">
                       {log.type === 'error' && (
                         <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={12}/> {log.message}</span>
                       )}
                       {log.type === 'success' && (
                         <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={12}/> {log.message}</span>
                       )}
                       {log.type === 'info' && (
                         <span className="text-slate-300">{log.message}</span>
                       )}
                       {log.type === 'ai' && (
                         <span className="text-purple-400 flex items-start gap-1"><MessageSquare size={12} className="mt-1"/> {log.message}</span>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT: TOOLS */}
        <Tools 
          tools={TOOLS}
          selectedToolId={selectedTool?.id || null}
          onSelect={handleSelectTool}
        />
        
      </div>
    </div>
  );
};

export default App;