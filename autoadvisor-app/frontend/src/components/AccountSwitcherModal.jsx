import React from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function AccountSwitcherModal() {
  const { theme } = useTheme();
  const {
    isAccountSwitcherOpen, setIsAccountSwitcherOpen, currentText, savedAccounts, setSavedAccounts,
    user, setUser, lang, setAuthMode, setIsAuthModalOpen, fetchCars
  } = useApp();

  if (!isAccountSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border text-left ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{currentText.switchAccountModalTitle}</h3>
          <button onClick={() => setIsAccountSwitcherOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={20}/></button>
        </div>
        <p className="text-xs text-slate-400 mb-4">{currentText.switchAccountSub}</p>

        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
          {savedAccounts.map((acc, idx) => (
            <div key={idx} className={`p-3 rounded-2xl border flex justify-between items-center ${acc.email === user?.email ? 'border-emerald-500 bg-emerald-500/10' : theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                {acc.avatar_url ? (
                  <img src={acc.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {acc.display_name[0]}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-bold text-xs truncate">{acc.display_name} {acc.is_admin ? '(Admin)' : ''}</p>
                  <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {acc.email !== user?.email ? (
                  <button 
                    onClick={() => { 
                      setUser(acc); 
                      setIsAccountSwitcherOpen(false);
                      // Оновлюємо дані списків або викликаємо перезавантаження при потребі
                      if (fetchCars) fetchCars();
                    }} 
                    className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {lang === 'ua' ? 'Обрати' : 'Switch'}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 mr-2">{lang === 'ua' ? 'Активний' : 'Active'}</span>
                )}

                {/* Кнопка видалення акаунта зі збережених */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedAccounts = savedAccounts.filter(item => item.email !== acc.email);
                    setSavedAccounts(updatedAccounts);
                    localStorage.setItem('autoadvisor_accounts', JSON.stringify(updatedAccounts));

                    if (acc.email === user?.email) {
                      setUser(null);
                    }
                  }}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                  title={lang === 'ua' ? 'Видалити зі збережених' : 'Remove from saved'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
  onClick={() => { 
    setIsAccountSwitcherOpen(false); 
    setAuthMode('login'); 
    setIsAuthModalOpen(true); // НЕ викликаємо setUser(null)!
  }} 
  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
>
  <Plus size={16} /> {currentText.addAnotherAccount}
</button>
      </div>
    </div>
  );
}