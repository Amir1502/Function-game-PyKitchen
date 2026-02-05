import React from 'react';
import { Tool } from '../types';
import { Terminal, Wrench } from 'lucide-react';

interface ToolsProps {
  tools: Tool[];
  selectedToolId: string | null;
  onSelect: (tool: Tool) => void;
}

const Tools: React.FC<ToolsProps> = ({ tools, selectedToolId, onSelect }) => {
  return (
    <div className="bg-slate-800 border-l border-slate-700 w-64 flex-shrink-0 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Wrench size={16} /> Инструменты (Функции)
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tools.map((tool) => {
          const isSelected = selectedToolId === tool.id;
          return (
            <div
              key={tool.id}
              onClick={() => onSelect(tool)}
              className={`
                cursor-pointer rounded-md p-3 border transition-all
                ${isSelected 
                  ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'bg-slate-700/50 hover:bg-slate-600 border-slate-600'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <Terminal size={14} className={isSelected ? 'text-blue-400' : 'text-slate-500'} />
                <span className={`font-mono font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                  {tool.name}()
                </span>
              </div>
              <div className="text-xs text-slate-400 mb-2 leading-tight">
                {tool.description}
              </div>
              <div className="bg-slate-900/50 rounded p-1.5">
                <code className="text-[10px] text-slate-500 font-mono block">
                  def {tool.signature}:
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tools;