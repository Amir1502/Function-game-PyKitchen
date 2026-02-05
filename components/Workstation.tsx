import React, { useState } from 'react';
import { Tool, Ingredient, Order } from '../types';
import { Play, RotateCcw, HelpCircle, X, Sparkles, BookOpen } from 'lucide-react';

interface WorkstationProps {
  selectedTool: Tool | null;
  slots: (Ingredient | null)[];
  onSlotClick: (index: number) => void;
  onClearSlot: (index: number) => void;
  onRun: () => void;
  onClearAll: () => void;
  onGetHelp: () => void;
  isProcessing: boolean;
  selectedIngredient: Ingredient | null;
  failedAttempts?: number;
  currentOrder: Order;
}

const Workstation: React.FC<WorkstationProps> = ({
  selectedTool,
  slots,
  onSlotClick,
  onClearSlot,
  onRun,
  onClearAll,
  onGetHelp,
  isProcessing,
  selectedIngredient,
  failedAttempts = 0,
  currentOrder
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTheory, setShowTheory] = useState(true);
  const [animating, setAnimating] = useState(false);

  const handleRun = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      onRun();
    }, 500);
  };

  const suggestHelp = failedAttempts >= 2;

  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden min-w-0">
      
      {/* ORDER CARD */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-md flex flex-col shrink-0 relative z-10">
         <div className="p-5">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-amber-400 flex items-center gap-2">
                   Задача #{currentOrder.id.split('_')[1]}: {currentOrder.title}
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-1 rounded">
                   {currentOrder.difficulty}
                </span>
            </div>
            
            <p className="text-slate-300 text-base mb-3 leading-relaxed">
              {currentOrder.description}
            </p>

            {/* Educational Section */}
            <div className="mt-3 bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
               <button 
                 onClick={() => setShowTheory(!showTheory)}
                 className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 text-xs font-bold text-blue-400 uppercase tracking-wide hover:bg-slate-800 transition-colors"
               >
                 <span className="flex items-center gap-2"><BookOpen size={14}/> Теория / Справка</span>
                 <span>{showTheory ? '▲' : '▼'}</span>
               </button>
               {showTheory && (
                 <div className="p-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800">
                    {currentOrder.learningGoal}
                    <div className="mt-2 pt-2 border-t border-slate-800/50 text-xs font-mono text-slate-500">
                      Ожидаемый результат: <span className="text-amber-500">{JSON.stringify(currentOrder.expectedResult)}</span>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* EDITOR HEADER */}
      <div className="h-10 bg-slate-950 flex items-center px-4 border-b border-slate-800 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-xs text-slate-400 font-mono">main.py</span>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={onClearAll}
             className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800"
           >
             <RotateCcw size={12} /> Сброс
           </button>
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 p-4 md:p-8 relative flex items-center justify-center overflow-y-auto bg-slate-900/50">
        
        {!selectedTool ? (
            <div className="text-center text-slate-500 max-w-sm">
                <div className="inline-block p-4 bg-slate-800 rounded-full mb-4">
                  <RotateCcw size={32} className="opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-400">Верстак пуст</h3>
                <p className="text-sm">Выберите Инструмент (Функцию) из меню справа, чтобы начать программировать.</p>
            </div>
        ) : (
            <div className={`
              relative w-full max-w-2xl bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-6 md:p-10
              transition-all duration-300
              ${animating ? 'scale-105 shadow-green-900/20 border-green-500/50' : ''}
            `}>
              
              {/* Tooltip */}
              <div className="absolute top-4 right-4">
                 <button 
                   onMouseEnter={() => setShowTooltip(true)}
                   onMouseLeave={() => setShowTooltip(false)}
                   className="text-slate-500 hover:text-blue-400 transition-colors"
                 >
                   <HelpCircle size={20} />
                 </button>
                 {showTooltip && (
                   <div className="absolute top-8 right-0 w-72 bg-slate-900 text-slate-300 text-xs p-3 rounded border border-slate-600 shadow-xl z-20 font-mono whitespace-pre-wrap">
                     {selectedTool.pythonDoc}
                   </div>
                 )}
              </div>

              <div className="font-mono text-lg md:text-2xl leading-loose">
                <span className="text-purple-400 font-bold">def</span>{' '}
                <span className="text-blue-400 font-bold">solution</span>():
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span>{' '}
                <span className="text-yellow-300">{selectedTool.name}</span>(
                
                {/* Argument Slots */}
                <span className="inline-flex flex-wrap items-center gap-2 mx-1 align-middle my-2 md:my-0">
                  {selectedTool.args.map((arg, index) => (
                    <React.Fragment key={index}>
                      <div 
                        onClick={() => onSlotClick(index)}
                        className={`
                          relative group cursor-pointer
                          min-w-[80px] h-10 md:h-12 px-3 rounded-md border-2 border-dashed flex items-center justify-center
                          transition-all duration-200
                          ${slots[index] 
                            ? 'bg-slate-700 border-solid border-blue-500/50 text-slate-100 shadow-lg' 
                            : selectedIngredient 
                              ? 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10 animate-pulse' 
                              : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-400 hover:bg-slate-700'
                          }
                        `}
                      >
                        {slots[index] ? (
                          <>
                            <span className="text-sm md:text-base font-bold text-amber-300 mr-1">{slots[index]!.name}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onClearSlot(index); }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs md:text-sm select-none opacity-60">{arg.name}</span>
                        )}
                      </div>
                      {index < selectedTool.args.length - 1 && <span className="text-slate-400 text-xl">,</span>}
                    </React.Fragment>
                  ))}
                </span>
                )
              </div>
            </div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-between items-center shrink-0">
        <div className="text-sm text-slate-400 hidden md:block">
          {selectedIngredient ? (
             <span className="text-green-400 flex items-center gap-2 animate-fadeIn">
               Выбрано: <span className="font-mono font-bold bg-slate-900 px-2 py-1 rounded text-white border border-slate-700">{selectedIngredient.name}</span> 
               Нажмите на слот выше.
             </span>
          ) : (
             <span>Сначала выберите ингредиент из кладовой.</span>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-end">
           <button 
             onClick={onGetHelp}
             disabled={isProcessing}
             className={`
               px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 text-sm disabled:opacity-50 relative
               ${suggestHelp 
                 ? 'bg-purple-600 hover:bg-purple-500 text-white animate-pulse shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400' 
                 : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}
             `}
           >
             {suggestHelp ? <Sparkles size={16} className="text-yellow-300" /> : <HelpCircle size={16} />}
             {suggestHelp ? "Есть подсказка!" : "Шеф-Помощник"}
           </button>

           <button 
             onClick={handleRun}
             disabled={isProcessing || (selectedTool ? slots.includes(null) : true)}
             className={`
               px-6 py-2 rounded-md font-bold text-slate-900 transition-all flex items-center gap-2 shadow-lg
               ${(!selectedTool || slots.includes(null)) 
                 ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                 : 'bg-green-400 hover:bg-green-300 hover:scale-105 active:scale-95 shadow-green-500/20'}
             `}
           >
             <Play size={18} fill="currentColor" />
             ЗАПУСК
           </button>
        </div>
      </div>
    </div>
  );
};

export default Workstation;