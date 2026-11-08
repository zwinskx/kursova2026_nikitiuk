import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const {
    currentText, lang, cars, compareCar1, setCompareCar1, compareCar2, setCompareCar2,
    formatPrice, calculatedAvgPrice, totalDbCars, calculatedLiquidityAvg, setIsFullComparisonOpen
  } = useApp();

  const c1 = compareCar1 || cars[0] || { title: 'Car 1', price: 30000, liquidity_score: 80, year: 2022, mileage: 25000 };
  const c2 = compareCar2 || cars[1] || { title: 'Car 2', price: 35000, liquidity_score: 85, year: 2023, mileage: 15000 };

  const getDaysOnMarket = (car) => {
    if (car.created_at) {
      const created = new Date(car.created_at);
      if (!isNaN(created)) {
        const diffTime = Math.abs(new Date() - created);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (days > 0 && days < 5000) return days;
      }
    }
    return Math.max(5, Math.round(20 + (car.id * 7) % 30));
  };

  const days1 = getDaysOnMarket(c1);
  const days2 = getDaysOnMarket(c2);

  const getDepreciation = (car) => {
    const year = Number(car.year);
    const age = (!isNaN(year) && year > 1990) ? Math.max(1, 2026 - year) : 3;
    const baseRate = 12 / age;
    const mileage = Number(car.mileage) || 15000;
    const mileageFactor = mileage / 50000;
    const liquidity = Number(car.liquidity_score) || 80;
    const liquidityBonus = liquidity * 0.02;
    const result = baseRate + mileageFactor - liquidityBonus;
    return isNaN(result) ? 6.5 : Number(Math.max(2.0, Math.min(25.0, result)).toFixed(1));
  };

  const dep1 = getDepreciation(c1);
  const dep2 = getDepreciation(c2);

  const getValueIndex = (car) => {
    const liquidity = Number(car.liquidity_score) || 80;
    const price = Number(car.price) || 30000;
    const score = (liquidity * 1000) / (price / 1000);
    const val = Math.min(100, Math.max(40, Math.round(score / 15)));
    return isNaN(val) ? 75 : val;
  };

  const val1 = getValueIndex(c1);
  const val2 = getValueIndex(c2);

  const dep1Better = dep1 <= dep2;
  const days1Better = days1 <= days2;
  const val1Better = val1 >= val2;

  let score1 = 0;
  let score2 = 0;
  if (dep1 <= dep2) score1++; else score2++;
  if (days1 <= days2) score1++; else score2++;
  if (val1 >= val2) score1++; else score2++;

  const overallWinner = score1 >= score2 ? c1 : c2;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={`p-8 rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-left block">LIVE MARKET DATA</span>
        <h2 className="text-3xl font-black mt-1 text-left">{currentText.marketAnalyticsTitle}</h2>
        <p className={`text-xs font-medium mt-1 text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{currentText.marketAnalyticsSub}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <p className="text-xs uppercase font-bold text-slate-400 text-left">{currentText.medianPrice}</p>
          <p className="text-2xl font-black mt-2 text-left">{formatPrice(calculatedAvgPrice)}</p>
          <span className="text-[10px] text-emerald-400 font-bold text-left block">+2.8% vs previous period</span>
        </div>
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <p className="text-xs uppercase font-bold text-slate-400 text-left">{currentText.inventory}</p>
          <p className="text-2xl font-black mt-2 text-left">{totalDbCars.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-bold text-left block">1,421 new listings</span>
        </div>
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <p className="text-xs uppercase font-bold text-slate-400 text-left">{currentText.daysOnMarket}</p>
          <p className="text-2xl font-black mt-2 text-left">36 {lang === 'ua' ? 'днів' : 'days'}</p>
          <span className="text-[10px] text-emerald-400 font-bold text-left block">2 {lang === 'ua' ? 'дні швидше' : 'days faster'}</span>
        </div>
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <p className="text-xs uppercase font-bold text-slate-400 text-left">{currentText.demandIndex}</p>
          <p className="text-2xl font-black mt-2 text-left">{calculatedLiquidityAvg}</p>
          <span className="text-[10px] text-emerald-400 font-bold text-left block">Strong buyer activity</span>
        </div>
      </div>

      <div className={`p-8 rounded-3xl border shadow-xl relative ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-left block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentText.decisionSnapshot}
            </span>
            <h3 className="text-2xl font-black mt-1 text-left">{currentText.compareMarketStrength}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            {c1?.image_url && (
              <img src={c1.image_url} alt="" className="w-20 h-14 object-cover rounded-xl shadow shrink-0" />
            )}
            <div className="flex-1 overflow-hidden">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase">{currentText.selectCar1}</label>
              <select
                value={c1 ? c1.id : ''}
                onChange={e => setCompareCar1(cars.find(c => c.id === Number(e.target.value)))}
                className={`w-full p-2 border rounded-xl text-xs font-bold cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                {cars.map(c => <option key={c.id} value={c.id}>{c.title} ({formatPrice(c.price)})</option>)}
              </select>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            {c2?.image_url && (
              <img src={c2.image_url} alt="" className="w-20 h-14 object-cover rounded-xl shadow shrink-0" />
            )}
            <div className="flex-1 overflow-hidden">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase">{currentText.selectCar2}</label>
              <select
                value={c2 ? c2.id : ''}
                onChange={e => setCompareCar2(cars.find(c => c.id === Number(e.target.value)))}
                className={`w-full p-2 border rounded-xl text-xs font-bold cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                {cars.map(c => <option key={c.id} value={c.id}>{c.title} ({formatPrice(c.price)})</option>)}
              </select>
            </div>
          </div>
        </div>

        {c1 && c2 && (
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-700/40">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{currentText.annualDepreciation} ({currentText.lowerIsBetter}):</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${dep1Better ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {dep1}% {dep1Better && <CheckCircle2 size={14}/>}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/40 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${dep1Better ? 'bg-emerald-500' : 'bg-slate-500'}`} style={{ width: `${Math.min(100, dep1 * 5)}%` }}></div>
                </div>
                {dep1Better && <p className="text-[10px] text-emerald-400 mt-1 font-bold">{c1.title} — {lang === 'ua' ? 'кращий показник збереження вартості' : 'stronger value retention'}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{currentText.annualDepreciation} ({currentText.lowerIsBetter}):</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${!dep1Better ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {dep2}% {!dep1Better && <CheckCircle2 size={14}/>}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/40 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${!dep1Better ? 'bg-emerald-500' : 'bg-slate-500'}`} style={{ width: `${Math.min(100, dep2 * 5)}%` }}></div>
                </div>
                {!dep1Better && <p className="text-[10px] text-emerald-400 mt-1 font-bold">{c2.title} — {lang === 'ua' ? 'кращий показник збереження вартості' : 'stronger value retention'}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{currentText.avgDaysOnMarket}:</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${days1Better ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {days1} {lang === 'ua' ? 'днів' : 'days'} {days1Better && <CheckCircle2 size={14}/>}
                  </span>
                </div>
                {days1Better && <p className="text-[10px] text-emerald-400 font-bold">{c1.title} — {lang === 'ua' ? 'швидший перепродаж' : 'faster expected resale'}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{currentText.avgDaysOnMarket}:</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${!days1Better ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {days2} {lang === 'ua' ? 'днів' : 'days'} {!days1Better && <CheckCircle2 size={14}/>}
                  </span>
                </div>
                {!days1Better && <p className="text-[10px] text-emerald-400 font-bold">{c2.title} — {lang === 'ua' ? 'швидший перепродаж' : 'faster expected resale'}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{currentText.valueMoneyIndex}:</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${val1Better ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {val1} / 100 {val1Better && <CheckCircle2 size={14}/>}
                  </span>
                </div>
                {val1Better && <p className="text-[10px] text-emerald-400 font-bold">{c1.title} — {lang === 'ua' ? 'найвигідніша пропозиція на ринку' : 'best market value'}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{currentText.valueMoneyIndex}:</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${!val1Better ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {val2} / 100 {!val1Better && <CheckCircle2 size={14}/>}
                  </span>
                </div>
                {!val1Better && <p className="text-[10px] text-emerald-400 font-bold">{c2.title} — {lang === 'ua' ? 'найвигідніша пропозиція на ринку' : 'best market value'}</p>}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3 mt-4 ${theme === 'dark' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
              <p className="text-xs font-semibold leading-relaxed">
                <strong className="font-extrabold">{currentText.advisorInsight}:</strong>{' '}
                <span className="text-emerald-400 font-extrabold">{overallWinner.title}</span> {lang === 'ua' ? 'перемагає за сукупністю ключових ринкових показників, забезпечуючи вигіднішу ціну та ліквідність.' : 'wins based on combined market metrics, offering better overall value and liquidity.'}
              </p>
            </div>

            <button
              onClick={() => setIsFullComparisonOpen(true)}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold rounded-2xl text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              {currentText.openFullComparison} <ArrowRight size={16} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}