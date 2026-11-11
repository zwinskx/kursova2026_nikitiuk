
import React, { useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function AiAssistant() {
  const { theme } = useTheme();

  const {
    isChatOpen,
    setIsChatOpen,
    currentText,
    chatMessages,
    chatInput,
    setChatInput,
    handleSendMessageToAI,
    isAiTyping,
    lang,
    cars,
    setActiveTab,
    handleOpenCarDetail,
    fetchCars
  } = useApp();

  const dark = theme === 'dark';
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chatMessages, isAiTyping, isChatOpen]);

  const suggestions = lang === 'ua'
    ? [
        'Підібрати авто до $15 000',
        'Що перевірити у вживаному авто?',
        'Порівняй мої збережені автомобілі'
      ]
    : [
        'Find a car under $15,000',
        'What to check in a used car?',
        'Compare my saved cars'
      ];

  const sendSuggestion = (text) => {
    if (isAiTyping) return;
    handleSendMessageToAI(null, text);
  };

  const openCar = async (carId) => {
    const id = Number(carId);

    let car = cars.find(item => item.id === id);

    if (!car) {
      const response = await fetch(
        'http://127.0.0.1:8000/api/recommendations?budget_max=100000000&min_liquidity=0'
      );

      if (response.ok) {
        const list = await response.json();
        car = list.find(item => item.id === id);
      }
    }

    if (!car) {
      alert(
        lang === 'ua'
          ? 'Автомобіль не знайдено.'
          : 'Vehicle not found.'
      );
      return;
    }

    setActiveTab('discover');
    handleOpenCarDetail(car);
    setIsChatOpen(false);
  };

  const renderText = (value) => {
    const text = String(value || '');

    const regex =
      /\[([^\]]+)\]\((\/\?tab=discover&car=\d+|\/discover\?car=\d+)\)|(\/\?tab=discover&car=\d+|\/discover\?car=\d+)/g;

    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(
          <React.Fragment key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.index)}
          </React.Fragment>
        );
      }

      const url = match[2] || match[3];
      const carId = new URLSearchParams(
        url.split('?')[1]
      ).get('car');

      result.push(
        <button
          type="button"
          key={`car-${match.index}`}
          onClick={() => openCar(carId)}
          className="inline text-emerald-400 font-bold underline underline-offset-2 hover:text-emerald-300 text-left"
        >
          {match[1] || (
            lang === 'ua'
              ? `Переглянути автомобіль №${carId}`
              : `View vehicle #${carId}`
          )}
        </button>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      result.push(
        <React.Fragment key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </React.Fragment>
      );
    }

    return result;
  };

  const BotAvatar = ({ size = 28 }) => (
    <div
      style={{
        width: size,
        height: size
      }}
      className="shrink-0 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/30"
    >
      <Bot size={size * 0.55} />
    </div>
  );

  return (
    <div className="fixed bottom-20 right-6 z-40">
      {!isChatOpen ? (
        <div className="relative">
          <span className="ai-pulse absolute inset-0 rounded-full bg-emerald-400" />

          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="relative w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-transform hover:scale-110 cursor-pointer"
            title="AI Assistant"
          >
            <Bot size={26} />
          </button>
        </div>
      ) : (
        <div className={`ai-window w-80 md:w-96 h-[500px] rounded-3xl border flex flex-col overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.45)] ${
          dark
            ? 'bg-[#0f172a] border-slate-700/60 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="px-4 py-3.5 flex justify-between items-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot size={22} />
                </div>

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-emerald-600 rounded-full" />
              </div>

              <div className="leading-tight">
                <p className="font-bold text-sm">
                  {currentText.aiChatTitle}
                </p>

                <p className="text-[10px] text-emerald-50/90 flex items-center gap-1">
                  <Sparkles size={10} />
                  {isAiTyping
                    ? (lang === 'ua' ? 'друкує…' : 'typing…')
                    : (lang === 'ua' ? 'онлайн' : 'online')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className={`ai-scroll flex-1 p-4 overflow-y-auto space-y-3 text-[13px] ${
            dark ? 'bg-[#0b1220]' : 'bg-slate-50'
          }`}>
            {chatMessages.map((msg, i) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={i}
                  className={`ai-msg flex items-end gap-2 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isUser && <BotAvatar />}

                  <div className={`px-3.5 py-2.5 max-w-[78%] leading-relaxed whitespace-pre-wrap break-words shadow-md ${
                    isUser
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-br-md shadow-emerald-500/25'
                      : dark
                        ? 'bg-slate-800 text-slate-100 rounded-2xl rounded-bl-md shadow-black/30'
                        : 'bg-white text-slate-800 rounded-2xl rounded-bl-md border border-slate-200 shadow-slate-300/50'
                  }`}>
                    {renderText(msg.text)}
                  </div>
                </div>
              );
            })}

            {isAiTyping && (
              <div className="ai-msg flex items-end gap-2 justify-start">
                <BotAvatar />

                <div className={`px-4 py-3.5 rounded-2xl rounded-bl-md flex items-center gap-1.5 shadow-md ${
                  dark
                    ? 'bg-slate-800 shadow-black/30'
                    : 'bg-white border border-slate-200 shadow-slate-300/50'
                }`}>
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                </div>
              </div>
            )}

            {chatMessages.length <= 1 && !isAiTyping && (
              <div className="flex flex-col items-start gap-2 pt-2 pl-9">
                {suggestions.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => sendSuggestion(s)}
                    className={`px-3.5 py-2 rounded-full border text-[12px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
                      dark
                        ? 'border-emerald-500/40 text-emerald-300 bg-slate-800/60 hover:bg-emerald-500/10'
                        : 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form
            id="ai-chat-form"
            onSubmit={handleSendMessageToAI}
            className={`p-3 border-t flex items-center gap-2 ${
              dark
                ? 'bg-[#0f172a] border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            <input
              type="text"
              maxLength={500}
              placeholder={currentText.aiChatPlaceholder}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className={`flex-1 min-w-0 px-4 py-2.5 border rounded-full text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-500/50 ${
                dark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />

            <button
              type="submit"
              disabled={isAiTyping || !chatInput.trim()}
              className="w-10 h-10 shrink-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
