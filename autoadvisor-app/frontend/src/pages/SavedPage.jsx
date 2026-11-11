
import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function SavedPage() {
  const { theme } = useTheme();

  const {
    currentText,
    lang,
    currentUserData,
    cars,
    formatPrice,
    getFinalPrice,
    handleOpenBookingModal,
    handleToggleSave,
    handleOpenCarDetail,
    myBookings
  } = useApp();

  const dark = theme === 'dark';

  const bookings = Array.isArray(myBookings) ? myBookings : [];
  const savedIds = (currentUserData.saved || []).map(Number);

  const pendingCarIds = bookings
    .filter(booking => booking.status === 'pending')
    .map(booking => Number(booking.car_id));

  const savedCars = cars.filter(car =>
    savedIds.includes(Number(car.id)) ||
    pendingCarIds.includes(Number(car.id))
  );

  const orderedSavedCars = [...savedCars].sort((a, b) => {
    const aPending = pendingCarIds.includes(Number(a.id));
    const bPending = pendingCarIds.includes(Number(b.id));

    if (aPending !== bPending) {
      return Number(bPending) - Number(aPending);
    }

    return Number(Boolean(a.is_archived)) -
      Number(Boolean(b.is_archived));
  });

  const getMyBooking = carId => {
    return bookings
      .filter(booking => Number(booking.car_id) === Number(carId))
      .sort((a, b) => Number(b.id) - Number(a.id))[0] || null;
  };

  const getBookingStatus = carId => {
    const carBookings = bookings.filter(
      booking => Number(booking.car_id) === Number(carId)
    );

    if (carBookings.some(booking => booking.status === 'approved')) {
      return 'approved';
    }

    if (carBookings.some(booking => booking.status === 'pending')) {
      return 'pending';
    }

    return null;
  };

  const isManuallySaved = carId => {
    return savedIds.includes(Number(carId)) &&
      !pendingCarIds.includes(Number(carId));
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-left">
        {currentText.savedVehicles} ({orderedSavedCars.length})
      </h2>

      {orderedSavedCars.length === 0 ? (
        <div className={`p-16 text-center rounded-3xl border shadow-xl ${
          dark
            ? 'bg-[#0f172a] border-slate-800 text-slate-300'
            : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <Bookmark
            size={56}
            className="mx-auto mb-4 opacity-40 text-emerald-400"
          />

          <p className="font-bold text-lg">
            {currentText.emptySaved}
          </p>

          <p className="text-xs font-medium mt-1 text-slate-400">
            {currentText.emptySavedSub}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orderedSavedCars.map(car => {
            const myBookingStatus = getBookingStatus(car.id);
            const myBooking = getMyBooking(car.id);

            const isPending = myBookingStatus === 'pending';
            const isApproved = myBookingStatus === 'approved';

            const isGloballyBooked =
              car.booking_status === 'pending';

            const archived = Boolean(car.is_archived);
            const unavailable = archived || isGloballyBooked;

            const manuallySaved = isManuallySaved(car.id);

            return (
              <div
                key={car.id}
                className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between transition-all ${
                  dark
                    ? 'bg-[#0f172a] border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                } ${archived ? 'grayscale-[0.6]' : ''}`}
              >
                <div>
                  <div className={`relative w-full h-36 rounded-2xl mb-4 overflow-hidden ${
                    dark ? 'bg-slate-900' : 'bg-white'
                  }`}>
                    <img
                      src={car.image_url}
                      alt={car.title}
                      className={`w-full h-full object-contain ${
                        archived ? 'grayscale opacity-60' : ''
                      }`}
                    />

                    {isPending && (
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full shadow">
                        {lang === 'ua' ? 'Заброньована' : 'Reserved'}
                      </span>
                    )}

                    {isApproved && (
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow">
                        {lang === 'ua' ? 'Придбано' : 'Purchased'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1 text-left">
                    {car.title}
                  </h3>

                  <p className="text-emerald-400 font-black text-lg mb-2 text-left">
                    {formatPrice(getFinalPrice(car))}

                    {Number(car.discount) > 0 && (
                      <>
                        <span className="ml-2 text-xs font-semibold line-through text-slate-400">
                          {formatPrice(car.price)}
                        </span>

                        <span className="ml-2 text-[10px] font-extrabold px-2 py-0.5 bg-red-500 text-white rounded-full">
                          -{car.discount}%
                        </span>
                      </>
                    )}
                  </p>

                  {isPending && (
                    <div className={`mb-3 px-3 py-2 rounded-xl border ${
                      dark
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-amber-50 border-amber-200'
                    }`}>
                      <p className={`text-xs font-bold ${
                        dark ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                        {lang === 'ua'
                          ? 'Заброньована — очікує підтвердження адміністратора'
                          : 'Reserved — awaiting administrator approval'}
                      </p>

                      {myBooking?.created_at && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          {lang === 'ua' ? 'Дата заявки: ' : 'Requested: '}
                          {new Date(myBooking.created_at).toLocaleDateString(
                            lang === 'ua' ? 'uk-UA' : 'en-US'
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {isApproved && (
                    <div className={`mb-3 px-3 py-2 rounded-xl border ${
                      dark
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <p className="text-xs font-bold text-emerald-500">
                        {lang === 'ua'
                          ? 'Покупку підтверджено'
                          : 'Purchase confirmed'}
                      </p>

                      {myBooking?.decided_at && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          {lang === 'ua' ? 'Дата покупки: ' : 'Purchased: '}
                          {new Date(myBooking.decided_at).toLocaleDateString(
                            lang === 'ua' ? 'uk-UA' : 'en-US'
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {!isPending && !isApproved && isGloballyBooked && (
                    <span className={`inline-block mb-3 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
                      dark
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {lang === 'ua'
                        ? 'Заброньовано іншим користувачем'
                        : 'Reserved by another user'}
                    </span>
                  )}

                  {archived && !isApproved && (
                    <span className={`inline-block mb-3 px-3 py-1.5 text-[10px] font-bold rounded-lg ${
                      dark
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {lang === 'ua'
                        ? 'Автомобіль в архіві'
                        : 'Vehicle archived'}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenCarDetail(car)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      dark
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    {currentText.details ||
                      (lang === 'ua' ? 'Детальніше' : 'Details')}
                  </button>

                  {isPending ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 bg-amber-500/20 text-amber-500 rounded-xl text-xs font-bold cursor-not-allowed"
                    >
                      {lang === 'ua'
                        ? 'Бронювання на розгляді'
                        : 'Booking pending'}
                    </button>
                  ) : isApproved ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 bg-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold cursor-not-allowed"
                    >
                      {lang === 'ua'
                        ? 'Автомобіль придбано'
                        : 'Vehicle purchased'}
                    </button>
                  ) : unavailable ? (
                    <button
                      type="button"
                      disabled
                      className={`w-full py-2 rounded-xl text-xs font-bold cursor-not-allowed ${
                        dark
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {lang === 'ua'
                        ? 'Авто недоступне'
                        : 'Car unavailable'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenBookingModal(car)}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {lang === 'ua'
                        ? 'Забронювати автомобіль'
                        : 'Book vehicle'}
                    </button>
                  )}

                  {manuallySaved && (
                    <button
                      type="button"
                      onClick={() => handleToggleSave(car.id)}
                      className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {lang === 'ua'
                        ? 'Видалити зі збережених'
                        : 'Remove from saved'}
                    </button>
                  )}

                  {!manuallySaved && isPending && (
                    <p className="text-[10px] text-center text-slate-400 mt-1">
                      {lang === 'ua'
                        ? 'Автомобіль автоматично додано через бронювання'
                        : 'Automatically added because of your booking'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
