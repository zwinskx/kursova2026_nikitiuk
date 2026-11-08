import React from 'react';
import { X, Bookmark } from 'lucide-react';

export default function CarDetailModal({ car, isOpen, onClose, theme, lang, formatPrice, formatMileage, onBook }) {
  if (!isOpen || !car) return null;

  const ua = lang === 'ua';

  const specs = [
    { label: ua ? 'Рік' : 'Year', value: car.year },
    { label: ua ? 'Кузов' : 'Body', value: car.body_type },
    { label: ua ? 'Коробка' : 'Transmission', value: car.transmission },
    { label: ua ? 'Двигун' : 'Engine', value: car.engine_volume || '2.0L' },
    { label: ua ? 'Пробіг' : 'Mileage', value: formatMileage(car.mileage_raw ?? car.mileage ?? 15000) },
    { label: ua ? 'Ліквідність' : 'Liquidity', value: `${car.liquidity_score} / 100` },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`rounded-3xl w-full max-w-2xl shadow-2xl border text-left max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img src={car.image_url} alt={car.title} className="w-full h-full object-cover" />
          {car.badge && (
            <span className="absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-white rounded-full uppercase shadow">{car.badge}</span>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full cursor-pointer"><X size={18}/></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black">{car.title}</h3>
            <span className="text-2xl font-black text-emerald-400">{formatPrice(car.price)}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specs.map((s, i) => (
              <div key={i} className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-[10px] uppercase font-bold text-slate-400">{s.label}</p>
                <p className="text-sm font-bold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Блок ліквідності у вигляді зеленого круга та опису поруч */}
          <div className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-400 text-lg shrink-0 shadow-lg shadow-emerald-500/20">
              {car.liquidity_score}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {ua ? 'Індекс ліквідності' : 'Resale outlook'}
              </p>
             
            </div>
          </div>

        <div>
                 <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {car.description || (ua ? 'Цей автомобіль є лідером у своєму класі за швидкістю перепродажу та збереженням вартості.' : 'This vehicle maintains strong demand and low depreciation across local markets.')}
              </p>
        </div>

          <div className="flex gap-3">
            <button onClick={() => onBook(car)} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
              {ua ? 'Забронювати' : 'Book now'}
            </button>
            <button onClick={onClose} className={`px-5 py-3 rounded-xl text-xs font-bold border cursor-pointer ${theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
              {ua ? 'Закрити' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}