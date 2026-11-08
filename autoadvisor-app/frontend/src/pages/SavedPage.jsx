import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function SavedPage() {
  const { theme } = useTheme();
  const {
    currentText, lang, currentUserData, cars, formatPrice, handleOpenBookingModal, handleToggleSave
  } = useApp();

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-left">{currentText.savedVehicles} ({currentUserData.saved.length})</h2>
      {currentUserData.saved.length === 0 ? (
        <div className={`p-16 text-center rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
          <Bookmark size={56} className="mx-auto mb-4 opacity-40 text-emerald-400" />
          <p className="font-bold text-lg">{currentText.emptySaved}</p>
          <p className="text-xs font-medium mt-1 text-slate-400">{currentText.emptySavedSub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.filter(c => currentUserData.saved.includes(c.id)).map(car => {
            const isBooked = currentUserData.booked.includes(car.id);
            const bDetails = currentUserData.bookingsDetails?.[car.id];
            let statusText = '';
            if (isBooked) {
              if (bDetails?.status === 'approved') statusText = lang === 'ua' ? 'Статус: Бронювання схвалено адміном' : 'Status: Booking approved';
              else if (bDetails?.status === 'rejected') statusText = lang === 'ua' ? 'Статус: Відхилено' : 'Status: Rejected';
              else statusText = lang === 'ua' ? 'Статус: Заброньовано (очікує підтвердження)' : 'Status: Booked (pending)';
            }

            return (
              <div key={car.id} className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div>
                  <img src={car.image_url} alt="" className="w-full h-36 object-cover rounded-2xl mb-4" />
                  <h3 className="font-bold text-lg mb-1 text-left">{car.title}</h3>
                  <p className="text-emerald-400 font-black text-lg mb-2 text-left">{formatPrice(car.price)}</p>
                  {isBooked && (
                    <span className="inline-block px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px] rounded uppercase mb-2">
                      {statusText}
                    </span>
                  )}
                </div>
                <div className="space-y-2 mt-4">
                  {!isBooked ? (
                    <button onClick={() => handleOpenBookingModal(car)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer">{lang === 'ua' ? 'Забронювати автомобіль' : 'Book vehicle'}</button>
                  ) : (
                    <button disabled className="w-full py-2 bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-not-allowed">{lang === 'ua' ? 'Бронювання на розгляді' : 'Booking pending'}</button>
                  )}
                  <button onClick={() => handleToggleSave(car.id)} className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold cursor-pointer">{lang === 'ua' ? 'Видалити зі збережених' : 'Remove from saved'}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}