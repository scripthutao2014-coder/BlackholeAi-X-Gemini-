import React from "react";
import { ChevronRight } from "lucide-react";

interface PresetButtonProps {
  title: string;
  category: string;
  onClick: (key: string) => void;
}

export const PresetButton = React.memo(({ 
  title, 
  category, 
  onClick 
}: PresetButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(title)}
      className="w-full text-left p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-800/40 hover:bg-purple-950/15 group transition-all text-xs cursor-pointer flex flex-col gap-1"
    >
      <div className="flex items-center justify-between">
        <span className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-900/40 text-[9px] font-mono text-purple-300 font-medium tracking-wide uppercase">
          {category}
        </span>
        <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
      </div>
      <span className="text-gray-200 group-hover:text-white font-medium capitalize mt-1 text-[12px]">
        &gt; {title}?
      </span>
    </button>
  );
});

PresetButton.displayName = "PresetButton";
