import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function AuthModal() {
  const { theme } = useTheme();
  const {
    isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, lang,
    handleAuth, nameInput, setNameInput, emailInput, setEmailInput, passInput, setPassInput
  } = useApp();

  if (!isAuthModalOpen) return null;

  const ua = lang === 'ua';
  const dark = theme === 'dark';
  const inputCls = `w-full p-3 border rounded-xl text-xs ${dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;

  const title =
    authMode === 'login' ? (ua ? 'Вхід в акаунт' : 'Sign In')
    : authMode === 'register' ? (ua ? 'Реєстрація' : 'Register')
    : (ua ? 'Відновлення пароля' : 'Reset password');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border text-left ${dark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="flex justify-between items-center mb-4">
          {/* для режиму forgot заголовок рендерить сама форма */}
          {authMode !== 'forgot' ? <h3 className="text-xl font-bold">{title}</h3> : <span />}
          <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
        </div>

        {authMode === 'forgot' ? (
          <ForgotPasswordForm />
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold block mb-1">{ua ? "Повне ім'я" : 'Full Name'}</label>
                <input type="text" placeholder="Олександра" value={nameInput} onChange={e => setNameInput(e.target.value)} className={inputCls} required />
              </div>
            )}
            <div>
              <label className="text-xs font-bold block mb-1">Email</label>
              <input type="email" placeholder="user@gmail.com" value={emailInput} onChange={e => setEmailInput(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold">{ua ? 'Пароль' : 'Password'}</label>
                {authMode === 'login' && (
                  <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer">
                    {ua ? 'Забули пароль?' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <input type="password" placeholder="••••••••" value={passInput} onChange={e => setPassInput(e.target.value)} className={inputCls} required />
            </div>
            <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
              {authMode === 'login' ? (ua ? 'Увійти' : 'Sign In') : (ua ? 'Створити акаунт' : 'Create Account')}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer">
                {authMode === 'login' ? (ua ? 'Немає акаунта? Зареєструватися' : 'No account? Register') : (ua ? 'Вже є акаунт? Увійти' : 'Already have an account? Sign In')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}