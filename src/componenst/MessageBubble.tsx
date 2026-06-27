import React, { useMemo, useState, useEffect, useRef } from "react";
import { CircleDot, Sparkles, VolumeX, Volume2, Check, Copy, Globe } from "lucide-react";
import { Message } from "../types";
import { marked } from "../utils/marked";

interface MessageBubbleProps {
  msg: Message;
  onSpeak: (text: string, id: string) => void;
  onCopy: (text: string, id: string) => void;
  isTtsActive: boolean;
  isCopied: boolean;
}

export const MessageBubble = React.memo(({ 
  msg, 
  onSpeak, 
  onCopy, 
  isTtsActive, 
  isCopied 
}: MessageBubbleProps) => {
  // 1. Text Typing / Streaming Simulation State
  const [displayText, setDisplayText] = useState(() => {
    if (
      msg.sender === "user" || 
      msg.isTypingDone || 
      msg.text.startsWith("Token kuota") || 
      msg.text.startsWith("Pilih apakah")
    ) {
      return msg.text;
    }
    return "";
  });

  const [isTyping, setIsTyping] = useState(() => {
    return (
      msg.sender === "ai" && 
      !msg.isTypingDone && 
      !msg.text.startsWith("Token kuota") && 
      !msg.text.startsWith("Pilih apakah")
    );
  });

  const textRef = useRef(msg.text);
  textRef.current = msg.text;

  useEffect(() => {
    if (!isTyping) {
      setDisplayText(msg.text);
      return;
    }

    let index = 0;
    const fullText = textRef.current;
    
    // Smooth custom chunk-based typewriter interval (reveals 3-4 chars every 12ms for fluid speed)
    const interval = setInterval(() => {
      index += 4;
      if (index >= fullText.length) {
        setDisplayText(fullText);
        setIsTyping(false);
        msg.isTypingDone = true;
        clearInterval(interval);
      } else {
        setDisplayText(fullText.slice(0, index));
      }
    }, 12);

    return () => clearInterval(interval);
  }, [isTyping, msg]);

  // Pre-parse Markdown with useMemo so it ONLY runs when the displayText changes.
  const parsedHtml = useMemo(() => {
    try {
      const rawHtml = marked.parse(displayText, { async: false }) as string;
      return { __html: rawHtml };
    } catch (e) {
      return { __html: displayText };
    }
  }, [displayText]);

  const timestampString = useMemo(() => {
    return new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [msg.timestamp]);

  return (
    <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 lg:p-5 relative transition-all ${
          msg.sender === "user"
            ? "bg-purple-900/35 border border-purple-800/30 text-white rounded-br-none user-bubble-style"
            : "glass-panel-neon text-gray-100 rounded-bl-none ai-bubble-style"
        }`}
      >
        {/* Header bar inside bubble */}
        <div className="flex items-center justify-between gap-10 mb-2 pb-1.5 border-b border-white/5 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
            {msg.sender === "user" ? (
              <>
                <CircleDot className="w-3 h-3 text-purple-400" />
                <span>Cosmic Explorer</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-purple-300">IBT Singularity AI</span>
              </>
            )}
          </span>
          <span>{timestampString}</span>
        </div>

        {/* Text Body parsed as markdown */}
        <div className="relative">
          <div 
            className="markdown-body text-sm font-sans break-words text-gray-200 leading-relaxed inline"
            dangerouslySetInnerHTML={parsedHtml}
          />
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse align-middle" />
          )}
        </div>

        {/* Render Search Grounding Sources if present */}
        {msg.searchSources && msg.searchSources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 font-bold tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deep Research Sources ({msg.searchSources.length})</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {msg.searchSources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/30 text-[10px] text-gray-300 hover:text-purple-300 transition-all font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="max-w-[130px] truncate">{src.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Speech & copy actions footer (for AI answers) */}
        {msg.sender === "ai" && (
          <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => onSpeak(msg.text, msg.id)}
              className="p-1.5 rounded bg-white/5 hover:bg-purple-950/35 text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
              title="Read aloud response"
            >
              {isTtsActive ? (
                <VolumeX className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onCopy(msg.text, msg.id)}
              className="p-1.5 rounded bg-white/5 hover:bg-purple-950/35 text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-1 text-[10px] font-mono cursor-pointer"
              title="Copy message text"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
