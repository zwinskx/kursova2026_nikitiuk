import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AccountSettingsModal({ user, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [settingsName, setSettingsName] = useState(user?.display_name || '');
  const [emailAlerts, setEmailAlerts] = useState(user?.email_alerts ?? true);
  const [deliveryFreq, setDeliveryFreq] = useState(user?.delivery_frequency || 'Daily digest');
  const [minLiquidity, setMinLiquidity] = useState(user?.min_liquidity || 85);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ display_name: settingsName, email_alerts: emailAlerts, delivery_frequency: deliveryFreq, min_liquidity: Number(minLiquidity) });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="p-8 rounded-3xl w-full max-w-xl shadow-2xl border bg-[#0f172a] border-slate-800 text-white relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full uppercase">Preferences</span>
            <h2 className="text-xl font-extrabold mt-1">Account settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Display name</label>
              <input type="text" value={settingsName} onChange={e => setSettingsName(e.target.value)} className="w-full p-3 border rounded-xl text-sm bg-slate-900 border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Email address</label>
              <input type="email" value={user?.email || ''} disabled className="w-full p-3 border rounded-xl text-sm opacity-60 cursor-not-allowed bg-slate-900 border-slate-700 text-white" />
            </div>
          </div>

          <div className="p-4 rounded-2xl border flex items-center justify-between bg-slate-900/50 border-slate-800">
            <div>
              <span className="text-sm font-bold">New vehicle email alerts</span>
              <p className="text-xs text-slate-400 mt-0.5">Receive a message when newly listed cars match your search profile.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-750 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold hover:bg-slate-800">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs">Save preferences</button>
          </div>
        </form>
      </div>
    </div>
  );
}