import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
  text: string;
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, className }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span className={cn("relative inline-flex items-center ml-1 select-none", className)}>
      <HelpCircle
        size={12}
        className="text-slate-400 hover:text-slate-600 cursor-help transition-colors shrink-0"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
      />
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-900 text-white text-[10px] leading-relaxed rounded shadow-premium z-50 font-medium font-sans text-center pointer-events-none select-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
};

export default HelpTooltip;
