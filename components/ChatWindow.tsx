import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, CheckCircle2, RefreshCw, Mail } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { sendEmail } from '../services/emailService'; // YENİ SERVİS
import { ChatState, Message, Sender } from '../types';
import type { Chat } from '@google/genai';

const ChatWindow: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    status: 'chatting',
  });
  const [input, setInput] = useState('');
  const chatSessionRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatSessionRef.current = createChatSession();
      const initialMessage: Message = {
        id: 'init-1',
        sender: Sender.Bot,
        text: "Merhaba! Ben Haluk İnal Medya asistanıyım. Size nasıl yardımcı olabilirim? (Düğün, İşletme Tanıtımı, E-Ticaret veya Drone Çekimi)",
        timestamp: new Date(),
      };
      setChatState(prev => ({ ...prev, messages: [initialMessage] }));
    } catch (error) {
      console.error("Chat Init Error:", error);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight > clientHeight) {
        chatContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }
    }
  }, [chatState.messages, chatState.isLoading, chatState.status]);

  const processMessage = async (userText: string) => {
     const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: userText,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newUserMsg],
      isLoading: true,
      status: 'chatting'
    }));

    try {
      if (!chatSessionRef.current) throw new Error("Chat session fail");

      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = result.text || "Bir hata oluştu.";
      const isReportGenerated = responseText.includes("--- RAPOR BAŞLANGICI ---");

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: responseText,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newBotMsg],
        isLoading: false,
        status: isReportGenerated ? 'reviewing' : 'chatting',
      }));

    } catch (error) {
      console.error("Gemini Error:", error);
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, {
            id: Date.now().toString(),
            sender: Sender.Bot,
            text: "Bağlantı hatası. Lütfen tekrar deneyin.",
            timestamp: new Date()
        }]
      }));
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatState.isLoading || chatState.status === 'completed') return;
    const text = input.trim();
    setInput('');
    await processMessage(text);
  };

  const handleConfirm = async () => {
    const reportMessage = [...chatState.messages].reverse().find(m => m.text.includes("--- RAPOR BAŞLANGICI ---"));
    
    if (reportMessage) {
        setChatState(prev => ({ ...prev, isLoading: true }));
        
        // YENİ EMAİL GÖNDERME MANTIĞI
        const result = await sendEmail({
            from_name: "AI Asistan",
            from_email: "noreply@halukinal.com",
            message: reportMessage.text,
            to_name: "Haluk İnal"
        });

        if (result.success) {
            setChatState(prev => ({ ...prev, isLoading: false, status: 'completed' }));
        } else {
            setChatState(prev => ({ ...prev, isLoading: false }));
            alert("Rapor gönderilemedi: " + result.message);
        }
    }
  };

  const handleRegenerate = async () => {
    await processMessage("Revize edelim. Lütfen kısa bir özet geç.");
  };

  return (
    <div className="flex flex-col mx-auto h-[600px] w-full max-w-2xl bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-white/5 p-4 border-b border-white/5 flex items-center gap-3">
        <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Bot size={20} />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-900 rounded-full animate-pulse"></div>
        </div>
        <div>
            <h2 className="font-display font-bold text-white">Asistan</h2>
            <p className="text-xs text-emerald-400 font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {chatState.messages.map((msg) => {
          const isUser = msg.sender === Sender.User;
          const isReport = msg.text.includes("--- RAPOR BAŞLANGICI ---");

          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : isReport
                        ? 'bg-zinc-800 border border-emerald-500/30 text-emerald-50 rounded-bl-sm'
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {chatState.isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
              <span className="text-xs text-zinc-400">Yazıyor...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white/5 border-t border-white/5">
          {chatState.status === 'completed' ? (
             <div className="flex items-center justify-center gap-2 text-emerald-400 py-2 animate-in fade-in">
                <CheckCircle2 size={20} />
                <span className="font-medium">Rapor İletildi</span>
             </div>
          ) : chatState.status === 'reviewing' ? (
              <div className="flex gap-3 animate-in slide-in-from-bottom-2">
                  <button onClick={handleRegenerate} className="flex-1 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <RefreshCw size={16} /> Düzenle
                  </button>
                  <button onClick={handleConfirm} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                      <Mail size={16} /> Onayla
                  </button>
              </div>
          ) : (
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Mesajınızı yazın..."
                    disabled={chatState.isLoading}
                    className="w-full bg-zinc-950 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 placeholder:text-zinc-600 transition-all"
                />
                <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || chatState.isLoading}
                    className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                    {chatState.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatWindow;