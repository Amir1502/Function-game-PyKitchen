import React from 'react';
import { Ingredient, IngredientType } from '../types';
import { Box, Hash, List, Type, ToggleLeft } from 'lucide-react';

interface PantryProps {
  ingredients: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
}

const TypeIcon = ({ type }: { type: IngredientType }) => {
  switch (type) {
    case IngredientType.INTEGER: return <Hash size={14} className="text-blue-400" />;
    case IngredientType.STRING: return <Type size={14} className="text-green-400" />;
    case IngredientType.LIST: return <List size={14} className="text-orange-400" />;
    case IngredientType.BOOLEAN: return <ToggleLeft size={14} className="text-purple-400" />;
    default: return <Box size={14} />;
  }
};

const Pantry: React.FC<PantryProps> = ({ ingredients, onSelect }) => {
  return (
    <div className="bg-slate-800 border-r border-slate-700 w-64 flex-shrink-0 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Box size={16} /> Кладовая (Переменные)
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {ingredients.map((ing) => (
          <div
            key={ing.id}
            onClick={() => onSelect(ing)}
            className="group cursor-pointer bg-slate-700/50 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-md p-3 transition-all active:scale-95"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-mono text-sm font-bold text-slate-100 group-hover:text-amber-300">
                {ing.name}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded">
                <TypeIcon type={ing.type} />
                {ing.type}
              </span>
            </div>
            <div className="font-mono text-xs text-slate-300 truncate opacity-75 mb-1">
               = {ing.displayValue}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {ing.description}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-slate-900 text-xs text-slate-500 text-center border-t border-slate-700">
        Нажмите, чтобы выбрать ингредиент
      </div>
    </div>
  );
};

export default Pantry;