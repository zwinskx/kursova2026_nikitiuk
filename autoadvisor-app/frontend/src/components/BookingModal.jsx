import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function BookingModal() {
  const { theme } = useTheme();
  const {
    isBookingModalOpen, setIsBookingModalOpen, carToBook, lang,
    handleSubmitBooking, bookingPhone, setBookingPhone, bookingComment, setBookingComment
  } = useApp();

  if (!isBookingModalOpen || !carToBook) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border text-left ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{lang === 'ua' ? 'Бронювання' : 'Booking'}: {carToBook.title}</h3>
          <button onClick={() => setIsBookingModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X size={20}/></button>
        </div>
        <p className="text-xs text-slate-400 mb-6">{lang === 'ua' ? 'Введіть номер телефону та коментар для зв\'язку з менеджером:' : 'Enter your phone number and comment for the manager:'}</p>
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          <div>
            <label className="text-xs font-bold block mb-1">{lang === 'ua' ? 'Номер телефону *' : 'Phone Number *'}</label>
            <input type="tel" placeholder="+38 (068) 123-45-67" value={bookingPhone} onChange={e=>setBookingPhone(e.target.value)} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">{lang === 'ua' ? 'Коментар (опціонально)' : 'Comment (optional)'}</label>
            <textarea placeholder={lang === 'ua' ? 'Зручний час для дзвінка...' : 'Best time to call...'} value={bookingComment} onChange={e=>setBookingComment(e.target.value)} className={`w-full p-3 border rounded-xl text-xs h-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
            {lang === 'ua' ? 'Підтвердити бронювання' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}