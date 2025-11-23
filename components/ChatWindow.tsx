import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, CheckCircle2, RefreshCw, Mail } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatState, Message, Sender } from '../types';
import type { Chat } from '@google/genai';

const ChatWindow: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    status: 'chatting', // 'chatting' | 'reviewing' | 'completed'
  });
  const [input, setInput] = useState('');
  
  // Ref to hold the mutable Chat object from the SDK
  const chatSessionRef = useRef<Chat | null>(null);
  
  // Ref for the scrollable container specifically
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat on mount
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
      console.error("Failed to init chat", error);
    }
  }, []);

  // Auto-scroll logic: Scopes scrolling strictly to the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      // Only scroll if content is taller than container
      if (scrollHeight > clientHeight) {
        chatContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [chatState.messages, chatState.isLoading, chatState.status]);

  // Helper to process sending a message
  const processMessage = async (userText: string) => {
     // 1. Add User Message (Optimistic UI)
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
      status: 'chatting' // Reset status to chatting if we were reviewing
    }));

    try {
      if (!chatSessionRef.current) {
        throw new Error("Chat session not initialized");
      }

      // 2. Send to Gemini
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = result.text || "Bir hata oluştu, lütfen tekrar deneyin.";

      // 3. Check for Report Completion Tag
      const isReportGenerated = responseText.includes("--- RAPOR BAŞLANGICI ---");

      // 4. Add Bot Message
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
            text: "Üzgünüm, şu an bağlantıda bir sorun yaşıyorum. Lütfen biraz sonra tekrar deneyin.",
            timestamp: new Date()
        }]
      }));
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatState.isLoading || chatState.status === 'completed') return;

    const textToSend = input.trim();
    setInput('');
    await processMessage(textToSend);
  };

  const handleRegenerate = async () => {
    // Trigger the bot to revise the report
    await processMessage("Oluşturduğun özette bazı değişiklikler yapmak istiyorum. Lütfen tekrar üzerinden geçelim.");
  };

  const handleConfirm = async () => {
    // Find the last message containing the report
    const reportMessage = [...chatState.messages].reverse().find(m => m.text.includes("--- RAPOR BAŞLANGICI ---"));
    
    if (reportMessage) {
        // TODO: MAIL AUTOMATION INTEGRATION
        // This is where you would call your backend API to send the email.
        console.log(">>> MAIL API TRIGGERED <<<");
        console.log("Payload:", reportMessage.text);
        
        // Simulate API delay
        setChatState(prev => ({ ...prev, isLoading: true }));
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setChatState(prev => ({ 
            ...prev, 
            isLoading: false, 
            status: 'completed' 
        }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col mx-auto h-[650px] w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 relative">
      
      {/* Header */}
      <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex items-center justify-between backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg">
                    <Bot size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            </div>
            <div>
                <h2 className="font-semibold text-gray-100">Haluk İnal Asistan</h2>
                <p className="text-xs text-green-400 font-medium">Çevrimiçi</p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30 scroll-smooth pb-32"
      >
        {chatState.messages.map((msg) => {
          const isUser = msg.sender === Sender.User;
          // Basic check to see if this specific message box contains the report
          const containsReport = msg.text.includes("--- RAPOR BAŞLANGICI ---");

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : containsReport 
                        ? 'bg-gray-800 border border-emerald-500/50 text-gray-200 rounded-bl-none shadow-emerald-900/20' 
                        : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {chatState.isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              <span className="text-xs text-gray-400">Haluk Bey'e iletiyorum...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Area: Changes based on Status */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
          
          {/* STATE: COMPLETED */}
          {chatState.status === 'completed' && (
             <div className="p-6 flex flex-col items-center justify-center text-center bg-emerald-900/20 h-full animate-in fade-in slide-in-from-bottom-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} />
                </div>
                <h3 className="text-emerald-400 font-semibold mb-1">Başvurunuz Alındı</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                    Teşekkürler. Proje özeti ve iletişim bilgileriniz Haluk İnal'a e-posta olarak iletildi.
                </p>
             </div>
          )}

          {/* STATE: REVIEWING (Buttons) */}
          {chatState.status === 'reviewing' && (
              <div className="p-4 flex flex-col gap-3 bg-gray-800/95 backdrop-blur animate-in slide-in-from-bottom-2">
                  <div className="text-center text-sm text-gray-400 mb-1">
                      Yukarıdaki özeti onaylıyor musunuz?
                  </div>
                  <div className="flex gap-3">
                      <button 
                        onClick={handleRegenerate}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors text-sm font-medium border border-gray-600"
                      >
                          <RefreshCw size={16} />
                          Tekrar Düzenle
                      </button>
                      <button 
                        onClick={handleConfirm}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-900/20"
                      >
                          <Mail size={16} />
                          Onayla ve Gönder
                      </button>
                  </div>
              </div>
          )}

          {/* STATE: CHATTING (Input) */}
          {chatState.status === 'chatting' && (
            <div className="p-4">
                <div className="relative flex items-center">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Mesajınızı yazın..."
                    disabled={chatState.isLoading}
                    className="w-full bg-gray-900 text-gray-200 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700 placeholder-gray-500 transition-all disabled:opacity-50"
                    />
                    <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || chatState.isLoading}
                    className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 transition-colors shadow-lg"
                    >
                    {chatState.isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatWindow;