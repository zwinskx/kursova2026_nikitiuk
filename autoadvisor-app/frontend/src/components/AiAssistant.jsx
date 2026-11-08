import React from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function AiAssistant() {
  const { theme } = useTheme();
  const {
    isChatOpen, setIsChatOpen, currentText, chatMessages, chatInput, setChatInput, handleSendMessageToAI
  } = useApp();

  return (
    <div className="fixed bottom-20 right-6 z-40">
      {!isChatOpen ? (
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
          title="AI Assistant"
        >
          <Bot size={26} />
        </button>
      ) : (
        <div className={`w-80 md:w-96 h-[450px] rounded-3xl border shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-emerald-400" />
              <span className="font-bold text-xs">{currentText.aiChatTitle}</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[80%] font-medium ${msg.sender === 'user' ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessageToAI} className={`p-3 border-t flex gap-2 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <input type="text" placeholder={currentText.aiChatPlaceholder} value={chatInput} onChange={e=>setChatInput(e.target.value)} className={`flex-1 p-2.5 border rounded-xl text-xs outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} />
            <button type="submit" className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow cursor-pointer"><Send size={16}/></button>
          </form>
        </div>
      )}
    </div>
  );
}