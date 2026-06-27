import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Body parser
app.use(express.json({ limit: "10mb" }));

// Server API Routes first
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { 
      messages, 
      model, 
      systemInstruction, 
      activeProvider, 
      anotherProvider, 
      anotherApiKey, 
      anotherModel 
    } = req.body;

    let finalSystemInstruction = systemInstruction || "";
    if (req.body.deepSearch) {
      finalSystemInstruction = (finalSystemInstruction ? finalSystemInstruction + "\n\n" : "") + 
        "You are operating in DEEP SEARCH / DEEP RESEARCH mode. You must analyze the query thoroughly, think step-by-step, explain your scientific reasoning, cross-reference data points, and provide an exceptionally detailed, well-structured comprehensive response.";
    }

    // 1. Check if the user wants to route to an Alternative AI Provider
    if (activeProvider === "alternative") {
      const provider = (anotherProvider || "openai").toLowerCase();
      const apiKey = (anotherApiKey || "").trim();

      if (!apiKey) {
        return res.status(400).json({
          error: "Missing Alternative API Key",
          message: `API Key untuk provider '${provider.toUpperCase()}' tidak ditemukan atau kosong. Silakan masukkan API Key Anda sendiri di tab 'Integrasi Provider AI Lain' pada menu Pengaturan (Settings) untuk terus menggunakannya.`
        });
      }

      let endpoint = "";
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      let body: any = {};
      let targetModel = anotherModel || "";

      if (provider === "openai") {
        targetModel = targetModel || "gpt-4o-mini";
        endpoint = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${apiKey}`;
        body = {
          model: targetModel,
          messages: [
            ...(finalSystemInstruction ? [{ role: "system", content: finalSystemInstruction }] : []),
            ...(messages || []).map((msg: any) => ({
              role: msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
              content: msg.text || msg.content || ""
            }))
          ]
        };
      } else if (provider === "deepseek") {
        targetModel = targetModel || "deepseek-chat";
        endpoint = "https://api.deepseek.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${apiKey}`;
        body = {
          model: targetModel,
          messages: [
            ...(finalSystemInstruction ? [{ role: "system", content: finalSystemInstruction }] : []),
            ...(messages || []).map((msg: any) => ({
              role: msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
              content: msg.text || msg.content || ""
            }))
          ]
        };
      } else if (provider === "groq") {
        targetModel = targetModel || "llama-3.3-70b-specdec";
        endpoint = "https://api.groq.com/openai/v1/chat/completions";
        headers["Authorization"] = `Bearer ${apiKey}`;
        body = {
          model: targetModel,
          messages: [
            ...(finalSystemInstruction ? [{ role: "system", content: finalSystemInstruction }] : []),
            ...(messages || []).map((msg: any) => ({
              role: msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
              content: msg.text || msg.content || ""
            }))
          ]
        };
      } else if (provider === "anthropic") {
        targetModel = targetModel || "claude-3-5-sonnet-latest";
        endpoint = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
        body = {
          model: targetModel,
          system: finalSystemInstruction || undefined,
          max_tokens: 4000,
          messages: (messages || []).map((msg: any) => ({
            role: msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
            content: msg.text || msg.content || ""
          }))
        };
      } else if (provider === "cohere") {
        targetModel = targetModel || "command-r-plus";
        endpoint = "https://api.cohere.com/v1/chat";
        headers["Authorization"] = `Bearer ${apiKey}`;
        
        const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1] : { text: "" };
        const history = messages && messages.length > 1 ? messages.slice(0, -1) : [];

        body = {
          model: targetModel,
          message: lastMsg.text || lastMsg.content || "",
          chat_history: history.map((msg: any) => ({
            role: msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" ? "CHATBOT" : "USER",
            message: msg.text || msg.content || ""
          })),
          preamble: finalSystemInstruction || undefined
        };
      } else {
        // Fallback for custom Open-AI compatible base URL or similar
        targetModel = targetModel || "gpt-4o-mini";
        endpoint = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${apiKey}`;
        body = {
          model: targetModel,
          messages: [
            ...(finalSystemInstruction ? [{ role: "system", content: finalSystemInstruction }] : []),
            ...(messages || []).map((msg: any) => ({
              role: msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
              content: msg.text || msg.content || ""
            }))
          ]
        };
      }

      console.log(`Routing request to alternative provider: ${provider}, model: ${targetModel}`);
      
      const response = await globalThis.fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      const data: any = await response.json();

      if (!response.ok) {
        console.error(`${provider.toUpperCase()} API error response:`, data);
        const errMsg = data.error?.message || data.error || JSON.stringify(data);
        return res.status(response.status).json({
          error: `${provider.toUpperCase()} API Failure`,
          message: `${provider.toUpperCase()} API returned error: ${errMsg}`
        });
      }

      let responseText = "";
      if (provider === "anthropic") {
        responseText = data.content && data.content[0] ? data.content[0].text : "";
      } else if (provider === "cohere") {
        responseText = data.text || "";
      } else {
        // openai, deepseek, groq
        responseText = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "";
      }

      return res.json({
        text: responseText,
        model: targetModel
      });
    }

    // 2. Default to Google Gemini Core Credentials
    // Retrieve Gemini API Key: Prefer client-provided header key if it's a real custom key (not empty and not the default placeholder starting with "AQ.Ab8").
    // Otherwise, fall back to the platform's environment-provided GEMINI_API_KEY.
    const clientKey = req.headers["x-gemini-key"] || req.body.apiKey;
    const hasClientKey = typeof clientKey === "string" && clientKey.trim() !== "";
    const isPlaceholder = hasClientKey && (clientKey.trim() === "" || clientKey.trim().startsWith("AQ.Ab8"));

    let apiKey = "";
    if (hasClientKey && !isPlaceholder) {
      apiKey = (clientKey as string).trim();
    } else {
      apiKey = (process.env.GEMINI_API_KEY || "").trim();
    }

    if (!apiKey) {
      return res.status(400).json({
        error: "Missing API Key",
        message: "Gemini API Key is not configured. Silakan masukkan API Key Anda sendiri di menu Pengaturan (Settings) untuk terus menggunakan aplikasi."
      });
    }

    // Initialize @google/genai with the chosen key and telemetry headers
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const modelName = model || "gemini-3.5-flash";

    // Format chat messages to Gemini SDK contents format
    // role must be 'user' or 'model'
    const formattedContents = (messages || []).map((msg: any) => {
      const role = msg.sender === "ai" || msg.role === "model" || msg.role === "assistant" 
        ? "model" 
        : "user";
      return {
        role: role,
        parts: [{ text: msg.text || msg.content || "" }],
      };
    });

    // Configure the request options
    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    // Activate Google Search Grounding if deepSearch is enabled
    if (req.body.deepSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    // Make the API call
    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedContents,
      config: config,
    });

    const responseText = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || null;

    return res.json({
      text: responseText,
      model: modelName,
      groundingChunks: groundingChunks,
    });
  } catch (error: any) {
    console.error("Gemini Proxy Error:", error);
    const errString = typeof error === "object" ? JSON.stringify(error) : String(error);
    const errMessage = error.message || "";
    
    let friendlyMessage = errMessage || "An error occurred while communicating with Google Gemini API.";
    
    if (
      errMessage.includes("quota") || 
      errMessage.includes("exhausted") || 
      errMessage.includes("429") || 
      errMessage.includes("RESOURCE_EXHAUSTED") ||
      errString.includes("quota") ||
      errString.includes("exhausted") ||
      errString.includes("429") ||
      errString.includes("RESOURCE_EXHAUSTED")
    ) {
      friendlyMessage = "⚠️ Kuota Gratis API Key Default telah habis (RESOURCE_EXHAUSTED / 429). Silakan buka menu Pengaturan (Settings ⚙️) di pojok kanan atas, lalu masukkan API Key Google Gemini Anda sendiri atau gunakan provider alternatif untuk terus menikmati akses tanpa batas secara instan.";
    }

    return res.status(500).json({
      error: "Gemini Service Failure",
      message: friendlyMessage,
    });
  }
});

// Start the server listening immediately in standard environments (Railway, Render, etc.)
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BlackholeAi Server is listening on http://0.0.0.0:${PORT}`);
  });
}

// Serve Vite dev server or static frontend production assets
async function setupVite() {
  if (process.env.VERCEL) {
    // Di Vercel, serverless function hanya meng-handle API route. 
    // Static assets akan di-serve langsung oleh router Vercel.
    return;
  }

  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));

  // If we are in production or static dist exists, serve pre-compiled frontend assets
  if (process.env.NODE_ENV === "production" || hasDist) {
    console.log("Serving compiled static assets from dist/.");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("Integrating Vite development middleware...");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite development middleware integrated successfully.");
    } catch (err) {
      console.error("Failed to load Vite dev middleware, falling back to static dist serving:", err);
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        if (fs.existsSync(path.join(distPath, "index.html"))) {
          res.sendFile(path.join(distPath, "index.html"));
        } else {
          res.status(500).send("Frontend assets not found. Please run 'npm run build' first.");
        }
      });
    }
  }
}

setupVite().catch((err) => {
  console.error("Failed to bootstrap Vite server:", err);
});

export default app;

