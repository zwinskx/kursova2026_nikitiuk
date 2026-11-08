import React from 'react';
import { Trash2, History, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function RecentPage() {
  const { theme } = useTheme();
  const {
    currentText, currentUserData, handleClearRecent, cars, formatPrice, formatMileage,
    handleToggleSave, handleOpenCarDetail, handleOpenBookingModal
  } = useApp();

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-left">{currentText.recent} ({currentUserData.recent.length})</h2>
        {currentUserData.recent.length > 0 && (
          <button onClick={handleClearRecent} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
            <Trash2 size={16}/> {currentText.clearHistory}
          </button>
        )}
      </div>

      {currentUserData.recent.length === 0 ? (
        <div className={`p-16 text-center rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
          <History size={56} className="mx-auto mb-4 opacity-40 text-emerald-400" />
          <p className="font-bold text-lg">{currentText.emptyHistory}</p>
          <p className="text-xs font-medium mt-1 text-slate-400">{currentText.emptyHistorySub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.filter(c => currentUserData.recent.includes(c.id)).map(car => {
            const isBooked = currentUserData.booked.includes(car.id);
            const isSaved = currentUserData.saved.includes(car.id);

            return (
              <div key={car.id} className={`rounded-3xl overflow-hidden border shadow-xl flex flex-col justify-between transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="h-48 overflow-hidden relative group">
                  <img src={car.image_url} alt={car.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-white rounded-full uppercase shadow">{car.badge}</span>
                  {isBooked && (
                    <span className="absolute top-3 right-14 text-[10px] font-black px-3 py-1 bg-amber-500 text-slate-950 rounded-full uppercase shadow">{currentText.bookedStatus}</span>
                  )}
                  <button onClick={() => handleToggleSave(car.id)} className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer ${isSaved ? 'bg-emerald-500 text-white' : 'bg-black/60 text-white hover:bg-black'}`}>
                    <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-left">{car.title}</h3>
                    <span className="text-lg font-black text-emerald-400">{formatPrice(car.price)}</span>
                  </div>

                  <p className={`text-xs font-semibold text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {car.body_type} • {car.year} • ⚙️ {car.engine_volume || '2.0L'} • {formatMileage(car.mileage ?? 15000)}
                  </p>

                  <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300 dark:text-slate-400">{currentText.liquidityScoreLabel}</span>
                      <span className="text-emerald-400 font-black text-sm">{car.liquidity_score} / 100</span>
                    </div>
                    <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${car.liquidity_score}%` }}></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleOpenCarDetail(car)} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white' : 'bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-800'}`}>
                      {currentText.viewAgain}
                    </button>

                    {!isBooked ? (
                      <button onClick={() => handleOpenBookingModal(car)} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer">
                        {currentText.book}
                      </button>
                    ) : (
                      <button disabled className="px-4 py-2.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-not-allowed">
                        {currentText.unavailable}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}