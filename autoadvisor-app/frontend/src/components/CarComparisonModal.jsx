import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function CarComparisonModal({ isOpen, onClose, car1, car2, theme, lang, formatPrice }) {
  if (!isOpen || !car1 || !car2) return null;

  const ua = lang === 'ua';

  // better: 'low' — менше краще, 'high' — більше краще, null — без підсвічування
  const rows = [
    { label: ua ? 'Ціна' : 'Price', v1: car1.price, v2: car2.price, fmt: formatPrice, better: 'low' },
    { label: ua ? 'Рік випуску' : 'Year', v1: car1.year, v2: car2.year, better: 'high' },
    { label: ua ? 'Пробіг' : 'Mileage', v1: car1.mileage, v2: car2.mileage, fmt: (v) => (typeof v === 'number' ? v.toLocaleString() : v ?? '-'), better: 'low' },
    { label: ua ? 'Тип кузова' : 'Body type', v1: car1.body_type, v2: car2.body_type },
    { label: ua ? 'Коробка передач' : 'Transmission', v1: car1.transmission, v2: car2.transmission },
    { label: ua ? 'Об\'єм двигуна' : 'Engine', v1: car1.engine_volume, v2: car2.engine_volume },
    { label: ua ? 'Ліквідність' : 'Liquidity', v1: car1.liquidity_score, v2: car2.liquidity_score, fmt: (v) => `${v} / 100`, better: 'high' },
  ];

  const isBetter = (row, side) => {
    if (!row.better || row.v1 === row.v2 || typeof row.v1 !== 'number' || typeof row.v2 !== 'number') return false;
    const first = row.better === 'low' ? row.v1 < row.v2 : row.v1 > row.v2;
    return side === 1 ? first : !first;
  };

  const show = (row, v) => (v === undefined || v === null || v === '' ? '-' : row.fmt ? row.fmt(v) : v);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`p-8 rounded-3xl w-full max-w-3xl shadow-2xl border text-left max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{ua ? 'Повне порівняння' : 'Full comparison'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer"><X size={20}/></button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 items-end">
          <div></div>
          {[car1, car2].map((car, i) => (
            <div key={i} className="text-center">
              {car.image_url && <img src={car.image_url} alt="" className="w-full h-28 object-cover rounded-2xl mb-2" />}
              <p className="font-bold text-sm">{car.title}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 gap-4 p-3 rounded-xl border items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-bold text-slate-400 uppercase">{row.label}</span>
              {[1, 2].map(side => {
                const better = isBetter(row, side);
                return (
                  <span key={side} className={`text-sm font-bold text-center flex items-center justify-center gap-1 ${better ? 'text-emerald-400' : ''}`}>
                    {show(row, side === 1 ? row.v1 : row.v2)} {better && <CheckCircle2 size={14} />}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <button onClick={onClose} className={`mt-6 w-full py-3 rounded-xl text-xs font-bold border cursor-pointer ${theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
          {ua ? 'Закрити' : 'Close'}
        </button>
      </div>
    </div>
  );
}