import React from 'react';
import { Heart } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 max-w-3xl mr-auto animate-fade-in">
      {/* Assistant Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-blush-400 flex items-center justify-center text-white shadow-xs shrink-0">
        <Heart className="w-4 h-4 fill-current" />
      </div>

      <div className="bg-white/90 border border-rose-200/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-rose-800 font-medium">Recalling memory...</span>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
