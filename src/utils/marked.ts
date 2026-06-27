import { marked } from "marked";

// --- Custom Marked Renderer for Code Block Copy Optimization ---
const customRenderer = new marked.Renderer();

customRenderer.code = function(first: any, second?: any, third?: any) {
  let text = "";
  let lang = "";
  if (typeof first === "object" && first !== null) {
    text = first.text || "";
    lang = first.lang || "";
  } else {
    text = first || "";
    lang = second || "";
  }
  const codeText = text;
  const language = lang || "code";
  
  // Create a robust inline self-contained Copy function
  const escapedCode = encodeURIComponent(codeText).replace(/'/g, "\\'");
  
  return `
    <div class="code-block-wrapper my-4 rounded-xl overflow-hidden border border-purple-800/20 bg-black/80 font-mono text-xs relative shadow-inner">
      <div class="code-block-header flex items-center justify-between px-4 py-2 bg-purple-950/20 border-b border-purple-900/15 text-[10px] text-gray-400 font-mono select-none">
        <span class="uppercase tracking-wider text-purple-400 font-bold">${language}</span>
        <button 
          type="button" 
          class="copy-code-btn px-2.5 py-1 rounded bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-300 transition-all font-sans font-bold text-[10px] cursor-pointer" 
          onclick="try{navigator.clipboard.writeText(decodeURIComponent('${escapedCode}'));this.innerText='Copied!';this.style.color='#10b981';const btn=this;setTimeout(()=>{btn.innerText='Copy Code';btn.style.color='';},2000);}catch(e){}"
        >
          Copy Code
        </button>
      </div>
      <pre class="p-4 overflow-x-auto text-gray-200 leading-relaxed font-mono"><code>${codeText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
    </div>
  `;
};

marked.use({ renderer: customRenderer });

export { marked };
