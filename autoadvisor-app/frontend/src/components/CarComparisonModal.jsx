import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function CarComparisonModal({ isOpen, onClose, car1, car2, theme, lang, formatPrice }) {
  if (!isOpen || !car1 || !car2) return null;

  // 1. Безпечний розрахунок днів на ринку (менше — краще)
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

  const days1 = getDaysOnMarket(car1);
  const days2 = getDaysOnMarket(car2);

  // 2. Безпечний розрахунок річної амортизації % (менше — краще)
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

  const dep1 = getDepreciation(car1);
  const dep2 = getDepreciation(car2);

  // 3. Індекс ціна-якість (більше — краще)
  const getValueIndex = (car) => {
    const liquidity = Number(car.liquidity_score) || 80;
    const price = Number(car.price) || 30000;
    const score = (liquidity * 1000) / (price / 1000);
    const val = Math.min(100, Math.max(40, Math.round(score / 15)));
    return isNaN(val) ? 75 : val;
  };

  const val1 = getValueIndex(car1);
  const val2 = getValueIndex(car2);

  const liq1 = Number(car1.liquidity_score) || 85;
  const liq2 = Number(car2.liquidity_score) || 85;

  // Порівняння критеріїв (ідентично головному екрану)
  const dep1Better = dep1 <= dep2;
  const days1Better = days1 <= days2;
  const val1Better = val1 >= val2;

  // Точний підрахунок балів (ідентично головній сторінці)
  let score1 = 0;
  let score2 = 0;
  if (dep1 <= dep2) score1++; else score2++;
  if (days1 <= days2) score1++; else score2++;
  if (val1 >= val2) score1++; else score2++;

  const winner = score1 >= score2 ? car1 : car2;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto">
      <div className={`p-8 rounded-3xl w-full max-w-4xl shadow-2xl border relative text-left my-auto ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              {lang === 'ua' ? 'повний звіт про рішення' : 'full decision report'}
            </span>
            <h2 className="text-2xl font-black mt-1">
              {lang === 'ua' ? 'Порівняння пліч-о-пліч' : 'Side-by-Side Comparison'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Картки автомобілів з правильним статусом переможця */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`inline-block px-2.5 py-1 font-bold text-[10px] rounded uppercase mb-2 ${car1.id === winner.id ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
              {car1.id === winner.id ? (lang === 'ua' ? 'Рекомендований вибір' : 'Recommended') : (lang === 'ua' ? 'Альтернатива' : 'Alternative')}
            </span>
            <div className="flex items-center gap-4 mt-2">
              <img src={car1.image_url} alt="" className="w-24 h-16 object-cover rounded-xl shadow" />
              <div>
                <h3 className="font-bold text-base">{car1.title}</h3>
                <p className="text-emerald-400 font-black text-sm">{formatPrice(car1.price)}</p>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`inline-block px-2.5 py-1 font-bold text-[10px] rounded uppercase mb-2 ${car2.id === winner.id ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
              {car2.id === winner.id ? (lang === 'ua' ? 'Рекомендований вибір' : 'Recommended') : (lang === 'ua' ? 'Альтернатива' : 'Alternative')}
            </span>
            <div className="flex items-center gap-4 mt-2">
              <img src={car2.image_url} alt="" className="w-24 h-16 object-cover rounded-xl shadow" />
              <div>
                <h3 className="font-bold text-base">{car2.title}</h3>
                <p className="text-emerald-400 font-black text-sm">{formatPrice(car2.price)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Таблиця показників */}
        <div className={`border rounded-2xl overflow-hidden mb-6 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`grid grid-cols-3 p-3.5 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
            <span>{lang === 'ua' ? 'Ринковий індикатор' : 'Market Indicator'}</span>
            <span>{car1.title}</span>
            <span>{car2.title}</span>
          </div>

          <div className={`grid grid-cols-3 p-4 border-t text-xs font-semibold items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className="text-slate-400">{lang === 'ua' ? 'Індекс ліквідності' : 'Liquidity Index'}</span>
            <span>{liq1} / 100</span>
            <span>{liq2} / 100</span>
          </div>

          <div className={`grid grid-cols-3 p-4 border-t text-xs font-semibold items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className="text-slate-400">{lang === 'ua' ? 'Річна амортизація' : 'Annual Depreciation'}</span>
            <span className={`font-bold flex items-center gap-1 ${dep1Better ? 'text-emerald-400' : 'text-slate-300'}`}>
              {dep1}% {dep1Better && <CheckCircle2 size={14}/>}
            </span>
            <span className={`font-bold flex items-center gap-1 ${!dep1Better ? 'text-emerald-400' : 'text-slate-300'}`}>
              {dep2}% {!dep1Better && <CheckCircle2 size={14}/>}
            </span>
          </div>

          <div className={`grid grid-cols-3 p-4 border-t text-xs font-semibold items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className="text-slate-400">{lang === 'ua' ? 'Сер. днів на ринку' : 'Avg. Days on Market'}</span>
            <span className={`font-bold flex items-center gap-1 ${days1Better ? 'text-emerald-400' : 'text-slate-300'}`}>
              {days1} {lang === 'ua' ? 'днів' : 'days'} {days1Better && <CheckCircle2 size={14}/>}
            </span>
            <span className={`font-bold flex items-center gap-1 ${!days1Better ? 'text-emerald-400' : 'text-slate-300'}`}>
              {days2} {lang === 'ua' ? 'днів' : 'days'} {!days1Better && <CheckCircle2 size={14}/>}
            </span>
          </div>

          <div className={`grid grid-cols-3 p-4 border-t text-xs font-semibold items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className="text-slate-400">{lang === 'ua' ? 'Співвідношення ціна/якість' : 'Value-for-money'}</span>
            <span className={`font-bold flex items-center gap-1 ${val1Better ? 'text-emerald-400' : 'text-slate-300'}`}>
              {val1} / 100 {val1Better && <CheckCircle2 size={14}/>}
            </span>
            <span className={`font-bold flex items-center gap-1 ${!val1Better ? 'text-emerald-400' : 'text-slate-300'}`}>
              {val2} / 100 {!val1Better && <CheckCircle2 size={14}/>}
            </span>
          </div>
        </div>

        {/* Підсумкова порада із правильним ім'ям переможця */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
  
          <p className="text-xs font-semibold leading-relaxed">
            <strong className="font-extrabold">{lang === 'ua' ? 'Порада AutoAdvisor:' : 'AutoAdvisor Insight:'}</strong>{' '}
            <span className="text-emerald-400 font-extrabold">{winner.title}</span> {lang === 'ua' ? 'перемагає за сукупністю ключових ринкових показників, забезпечуючи вигіднішу ціну та ліквідність.' : 'wins based on combined market metrics.'}
          </p>
        </div>

      </div>
    </div>
  );
}