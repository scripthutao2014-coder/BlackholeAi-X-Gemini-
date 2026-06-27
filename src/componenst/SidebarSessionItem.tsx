import React from "react";
import { CircleDot, Trash2 } from "lucide-react";
import { ChatSession } from "../types";

interface SidebarSessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const SidebarSessionItem = React.memo(({
  session,
  isActive,
  onSelect,
  onDelete
}: SidebarSessionItemProps) => {
  return (
    <div
      onClick={() => onSelect(session.id)}
      className={`group w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
        isActive
          ? "bg-purple-950/20 border-purple-800/60 shadow-lg shadow-purple-950/10"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <CircleDot className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-purple-400" : "text-gray-600"}`} />
        <div className="truncate">
          <p className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
            {session.name}
          </p>
          <p className="text-[9px] text-gray-500 font-mono">
            {new Date(session.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => onDelete(session.id, e)}
        className="p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Collapse this void"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

SidebarSessionItem.displayName = "SidebarSessionItem";
