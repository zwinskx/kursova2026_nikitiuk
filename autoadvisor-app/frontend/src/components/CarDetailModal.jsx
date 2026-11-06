import React from 'react';
import { X, ShieldCheck, Zap, Gauge, DollarSign } from 'lucide-react';

export default function CarDetailModal({ car, isOpen, onClose }) {
  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-white relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black text-white z-10"><X size={20}/></button>
        <div className="h-64 overflow-hidden relative">
          <img src={car.image_url} alt={car.title} className="w-full h-full object-cover" />
          <span className="absolute bottom-4 left-4 text-xs font-bold px-3 py-1 bg-emerald-500 text-white rounded-full uppercase shadow">{car.badge}</span>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black">{car.title}</h2>
            <span className="text-2xl font-black text-emerald-400">${car.price?.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">🗓️ Рік: <b>{car.year}</b></div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">⚙️ Двигун: <b>{car.engine_volume || '2.0L'}</b></div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">🛣️ Пробіг: <b>{car.mileage}</b></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2 text-emerald-400">Детальний опис та експертний висновок</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{car.description || "Цей автомобіль пройшов повну комп'ютерну та технічну перевірку. Володіє високим індексом ліквідності на вторинному ринку та мінімальною втратою ринкової вартості."}</p>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-400">Індекс ліквідності моделі:</span>
            <span className="text-lg font-black text-emerald-400">{car.liquidity_score} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}