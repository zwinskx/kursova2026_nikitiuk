import React, { useState } from 'react';
import { X, User, SlidersHorizontal, Bell, Lock, Trash2, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function AccountSettingsModal() {
  const { theme } = useTheme();
  const {
    isSettingsOpen, setIsSettingsOpen, user, currentText, lang,
    handleSavePreferences, settingsName, setSettingsName, settingsAvatar, setSettingsAvatar,
    handleAvatarUpload, settingsLang, setSettingsLang, settingsCurrency, setSettingsCurrency,
    settingsDistance, setSettingsDistance, currentPass, setCurrentPass, newPass, setNewPass,
    confirmNewPass, setConfirmNewPass,
    // нове: підписка на email-розсилку (треба додати в AppContext, див. нижче)
    settingsEmailAlerts, setSettingsEmailAlerts
  } = useApp();

  const [tab, setTab] = useState('profile');

  if (!isSettingsOpen || !user) return null;

  const ua = lang === 'ua';
  const dark = theme === 'dark';

  const inputCls = `w-full p-3 border rounded-xl text-xs ${dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;
  const lockedCls = `w-full p-3 border rounded-xl text-xs opacity-60 cursor-not-allowed ${dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`;
  const selectCls = `w-full p-2.5 border rounded-xl text-xs font-bold ${dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;
  const sectionTitle = 'font-bold text-xs text-emerald-400 uppercase tracking-wider mb-3';

  const tabs = [
    { id: 'profile', icon: User, label: ua ? 'Профіль' : 'Profile' },
    { id: 'system', icon: SlidersHorizontal, label: ua ? 'Система' : 'System' },
    { id: 'notifications', icon: Bell, label: ua ? 'Сповіщення' : 'Notifications' },
    { id: 'security', icon: Lock, label: ua ? 'Безпека' : 'Security' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`rounded-3xl w-full max-w-3xl shadow-2xl border text-left max-h-[90vh] overflow-hidden flex flex-col ${dark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        {/* Шапка */}
        <div className={`flex justify-between items-center px-8 pt-6 pb-4 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h3 className="text-xl font-bold">{currentText.settingsTitle}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentText.settingsSub}</p>
          </div>
          <button type="button" onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={handleSavePreferences} className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Лівий навбар */}
          <nav className={`md:w-52 shrink-0 p-4 flex md:flex-col gap-1.5 overflow-x-auto border-b md:border-b-0 md:border-r ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-all cursor-pointer ${
                  tab === id
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : dark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'
                }`}
              >
                <Icon size={16} className="shrink-0" /> {label}
              </button>
            ))}
          </nav>

          {/* Вміст вкладки */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">

              {/* ПРОФІЛЬ */}
              {tab === 'profile' && (
                <>
                  <div>
                    <h4 className={sectionTitle}>{currentText.profileInfo}</h4>
                    <div className="flex items-center gap-5 mb-5">
                      {settingsAvatar ? (
                        <img src={settingsAvatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/60 shadow-lg" />
                      ) : (
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                          {user.display_name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <label className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                          {ua ? 'Змінити фото' : 'Change photo'}
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                        {settingsAvatar && (
                          <button type="button" onClick={() => setSettingsAvatar('')} className="px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                            <Trash2 size={13} /> {ua ? 'Видалити' : 'Remove'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">{currentText.avatarUrlLabel}</label>
                        <input type="text" placeholder="https://..." value={settingsAvatar} onChange={e => setSettingsAvatar(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">{currentText.fullName}</label>
                       <input type="text" value={settingsName} onChange={(e) => setSettingsName(e.target.value)}  minLength={2}  maxLength={255} required className={inputCls}/> <p className="text-[10px] opacity-60 mt-1">
                          {ua ? "Ім'я та прізвище змінити не можна." : 'First and last name cannot be changed.'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">{currentText.emailLocked}</label>
                        <input type="email" value={user.email} disabled className={lockedCls} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* СИСТЕМА */}
              {tab === 'system' && (
                <div>
                  <h4 className={sectionTitle}>{currentText.marketPreferences}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">{currentText.language}</label>
                      <select value={settingsLang} onChange={e => setSettingsLang(e.target.value)} className={selectCls}>
                        <option value="ua">Українська</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">{currentText.currency}</label>
                      <select value={settingsCurrency} onChange={e => setSettingsCurrency(e.target.value)} className={selectCls}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="UAH">UAH (₴)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">{currentText.distanceUnits}</label>
                      <select value={settingsDistance} onChange={e => setSettingsDistance(e.target.value)} className={selectCls}>
                        <option value="mi">mi (miles)</option>
                        <option value="km">km (kilometers)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* СПОВІЩЕННЯ */}
              {tab === 'notifications' && (
                <div>
                  <h4 className={sectionTitle}>{ua ? 'Email-розсилка' : 'Email notifications'}</h4>
                  <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">{ua ? 'Нові надходження в каталозі' : 'New cars in the catalog'}</p>
                        <p className="text-[11px] opacity-70 mt-0.5">
                          {ua ? `Листи надходитимуть на ${user.email}` : `Emails will be sent to ${user.email}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!settingsEmailAlerts}
                      onClick={() => setSettingsEmailAlerts(!settingsEmailAlerts)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${settingsEmailAlerts ? 'bg-emerald-500' : dark ? 'bg-slate-700' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settingsEmailAlerts ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* БЕЗПЕКА */}
              {tab === 'security' && (
                <div>
                  <h4 className={sectionTitle}>{currentText.changePass}</h4>
                  <div className="space-y-3">
                    <input type="password" placeholder={currentText.currPass} value={currentPass} onChange={e => setCurrentPass(e.target.value)} className={inputCls} />
                    <input type="password" placeholder={currentText.newPass} value={newPass} onChange={e => setNewPass(e.target.value)} className={inputCls} />
                    <input type="password" placeholder={currentText.confirmPass} value={confirmNewPass} onChange={e => setConfirmNewPass(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
            </div>

            {/* Кнопки (спільні для всіх вкладок) */}
            <div className={`flex gap-3 px-8 py-4 border-t ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              <button type="submit" className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
                {currentText.savePrefs}
              </button>
              <button type="button" onClick={() => setIsSettingsOpen(false)} className={`px-5 py-3 rounded-xl text-xs font-bold border cursor-pointer ${dark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
                {currentText.cancel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}