import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const API = 'http://127.0.0.1:8000';

export default function ForgotPasswordForm() {
  const { theme } = useTheme();
  const { lang, setAuthMode, emailInput, setEmailInput } = useApp();
  const ua = lang === 'ua';
  const dark = theme === 'dark';

  const [step, setStep] = useState(1); // 1 - пошта, 2 - код, 3 - новий пароль
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const inputCls = `w-full p-3 border rounded-xl text-xs ${dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;
  const btnCls = 'w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer';

  const post = async (path, body) => {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail;
      throw new Error(detail || `Error ${res.status}`);
    }
    return data;
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post('/api/auth/forgot-password', { email: emailInput.trim() });
      setCode('');
      setStep(2);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

    const verifyCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await post('/api/auth/verify-code', { email: emailInput.trim(), code: code.trim() });
      setStep(3);
    } catch (err) {
      alert(err.message);
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPass.length < 8) {
      alert(ua ? 'Пароль має містити мінімум 8 символів!' : 'Password must be at least 8 characters!');
      return;
    }
    if (newPass !== confirmPass) {
      alert(ua ? 'Паролі не збігаються!' : 'Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await post('/api/auth/reset-password', {
        email: emailInput.trim(),
        code: code.trim(),
        new_password: newPass,
      });
      alert(ua ? 'Пароль успішно змінено! Тепер увійдіть.' : 'Password changed! Please sign in.');
      setAuthMode('login');
    } catch (err) {
      alert(err.message);
      setStep(2); // найімовірніше, проблема в коді
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left">
      <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mb-4 cursor-pointer">
        <ArrowLeft size={12} /> {ua ? 'Назад до входу' : 'Back to sign in'}
      </button>
      <h3 className="text-xl font-bold mb-1">{ua ? 'Відновлення пароля' : 'Reset password'}</h3>

      {step === 1 && (
        <form onSubmit={sendCode} className="space-y-3 mt-4">
          <p className="text-xs opacity-70">
            {ua ? 'Введіть email акаунта, ми надішлемо 6-значний код.' : "Enter your account email and we'll send a 6-digit code."}
          </p>
          <input type="email" required placeholder="Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className={inputCls} />
          <button type="submit" disabled={loading} className={btnCls}>{ua ? 'Надіслати код' : 'Send code'}</button>
        </form>
      )}

            {step === 2 && (
        <form onSubmit={verifyCode} className="space-y-3 mt-4">
          <p className="text-xs opacity-70">
            {ua ? `Код надіслано на ${emailInput}. Він дійсний 10 хвилин.` : `Code sent to ${emailInput}. Valid for 10 minutes.`}
          </p>
          <input
            type="text" inputMode="numeric" maxLength={6} required autoFocus
            placeholder="000000" value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className={`${inputCls} text-center text-lg font-bold tracking-[0.5em]`}
          />
          <button type="submit" disabled={code.length !== 6 || loading} className={btnCls}>{ua ? 'Підтвердити' : 'Verify'}</button>
          <button type="button" onClick={sendCode} disabled={loading} className="w-full text-xs text-emerald-400 hover:underline cursor-pointer">
            {ua ? 'Надіслати код ще раз' : 'Resend code'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword} className="space-y-3 mt-4">
          <input type="password" required autoFocus placeholder={ua ? 'Новий пароль' : 'New password'} value={newPass} onChange={(e) => setNewPass(e.target.value)} className={inputCls} />
          <input type="password" required placeholder={ua ? 'Повторіть пароль' : 'Confirm password'} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className={inputCls} />
          <button type="submit" disabled={loading} className={btnCls}>{ua ? 'Змінити пароль' : 'Change password'}</button>
        </form>
      )}
    </div>
  );
}