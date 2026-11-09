import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function DiscoverPage() {
  const { theme } = useTheme();
  const {
    currentText, formatPrice, formatMileage, budget, setBudget, selectedBrand, setSelectedBrand,
    selectedBody, setSelectedBody, minLiquidityFilter, setMinLiquidityFilter, handleApplyFilters,
    cars, currentUserData, handleToggleSave, handleOpenCarDetail, handleOpenBookingModal, getFinalPrice
  } = useApp();

  return (
    <div className="animate-fadeIn space-y-6">
      <div className={`p-8 rounded-3xl border mb-8 shadow-xl ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500/15 via-[#0f172a] to-[#0f172a] border-emerald-500/20 text-white' : 'bg-emerald-50 border-emerald-200 text-slate-900'}`}>
        <h1 className="text-4xl font-extrabold mb-3 text-left" dangerouslySetInnerHTML={{ __html: currentText.findCar }}></h1>
        <p className={`text-sm font-medium max-w-xl text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{currentText.subtitleDiscover}</p>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl mb-8 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className={`text-xs font-bold block mb-2 text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{currentText.maxBudget} ({formatPrice(budget)})</label>
            <input type="range" min="10000" max="150000" step="5000" value={budget} onChange={(e) => setBudget(e.target.value)} className={`w-full accent-emerald-500 cursor-pointer ${theme === 'light' ? 'bg-slate-200' : ''}`} />
          </div>
          <div>
            <label className={`text-xs font-bold block mb-2 text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{currentText.brand}</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm font-semibold cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
              <option value="All">{currentText.allBrands}</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
            </select>
          </div>
          <div>
            <label className={`text-xs font-bold block mb-2 text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{currentText.bodyType}</label>
            <select value={selectedBody} onChange={(e) => setSelectedBody(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm font-semibold cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
              <option value="Any">{currentText.anyBody}</option>
              <option value="Sedan">{currentText.sedan}</option>
              <option value="SUV">{currentText.suv}</option>
              <option value="Coupe">{currentText.coupe}</option>
            </select>
          </div>
          <div>
            <label className={`text-xs font-bold block mb-2 text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{currentText.minLiquidity} ({minLiquidityFilter}+)</label>
            <input type="range" min="0" max="95" step="5" value={minLiquidityFilter} onChange={(e) => setMinLiquidityFilter(e.target.value)} className={`w-full accent-emerald-500 cursor-pointer mt-1 ${theme === 'light' ? 'bg-slate-200' : ''}`} />
          </div>
          <div className="flex items-end">
            <button onClick={handleApplyFilters} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95 cursor-pointer">{currentText.apply}</button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-left">{currentText.topRecommendations} ({cars.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => {
          const isSaved = currentUserData.saved.includes(car.id);
          const isBooked = currentUserData.booked.includes(car.id);

          return (
            <div key={car.id} className={`rounded-3xl overflow-hidden border shadow-xl flex flex-col justify-between transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="h-48 overflow-hidden relative group">
                <img src={car.image_url} alt={car.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-white rounded-full uppercase shadow">{car.badge}</span>
                    {car.discount > 0 && (
                      <span className="absolute bottom-3 left-3 text-[10px] font-extrabold px-3 py-1 bg-red-500 text-white rounded-full uppercase shadow">-{car.discount}%</span>
                    )}
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
                  <div className="text-right">
                    {car.discount > 0 && <span className="block text-[10px] font-semibold line-through text-slate-400">{formatPrice(car.price)}</span>}
                    <span className="text-lg font-black text-emerald-400">{formatPrice(getFinalPrice(car))}</span>
                  </div>
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
                    {currentText.details}
                  </button>

                  {!isBooked ? (
                    <button onClick={() => handleOpenBookingModal(car)} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer">
                      {currentText.book}
                    </button>
                  ) : (
                    <button disabled className="px-4 py-2.5 bg-slate-700 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed">
                      {currentText.unavailable}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}