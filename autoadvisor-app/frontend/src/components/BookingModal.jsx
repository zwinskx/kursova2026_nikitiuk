import React, { useEffect, useState } from 'react';
import { X, Phone, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const countries = [
  { code: 'UA', ua: 'Україна', en: 'Ukraine', dial: '+380', mask: 'XX XXX XX XX' },
  { code: 'PL', ua: 'Польща', en: 'Poland', dial: '+48', mask: 'XXX XXX XXX' },
  { code: 'DE', ua: 'Німеччина', en: 'Germany', dial: '+49', mask: 'XXXXXXXXXX' },
  { code: 'US', ua: 'США', en: 'United States', dial: '+1', mask: 'XXX XXX XXXX' },
  { code: 'GB', ua: 'Велика Британія', en: 'United Kingdom', dial: '+44', mask: 'XXXXXXXXXX' },
  { code: 'CZ', ua: 'Чехія', en: 'Czechia', dial: '+420', mask: 'XXX XXX XXX' },
  { code: 'FR', ua: 'Франція', en: 'France', dial: '+33', mask: 'XXXXXXXXX' },
  { code: 'IT', ua: 'Італія', en: 'Italy', dial: '+39', mask: 'XXXXXXXXXX' }
];

function applyMask(digits, mask) {
  let index = 0;
  let result = '';

  for (const character of mask) {
    if (index >= digits.length) break;

    if (character === 'X') {
      result += digits[index];
      index += 1;
    } else {
      result += character;
    }
  }

  return result;
}

export default function BookingModal() {
  const { theme } = useTheme();

  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    carToBook,
    lang,
    formatPrice,
    handleSubmitBooking,
    bookingSubmitting
  } = useApp();

  const dark = theme === 'dark';
  const ua = lang === 'ua';

  const [country, setCountry] = useState(countries[0]);
  const [digits, setDigits] = useState('');
  const [comment, setComment] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isBookingModalOpen) {
      setCountry(countries[0]);
      setDigits('');
      setComment('');
      setCountryOpen(false);
      setError('');
    }
  }, [isBookingModalOpen, carToBook?.id]);

  if (!isBookingModalOpen || !carToBook) {
    return null;
  }

  const maxDigits = (country.mask.match(/X/g) || []).length;
  const complete = digits.length === maxDigits;

  const fieldClass = dark
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-white border-slate-300 text-slate-900';

  const close = () => {
    if (!bookingSubmitting) {
      setIsBookingModalOpen(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!complete) {
      setError(
        ua ? 'Введіть повний номер телефону.' : 'Enter a complete phone number.'
      );
      return;
    }

    const phone = `${country.dial}${digits}`;

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setError(
        ua ? 'Неправильний формат телефону.' : 'Invalid phone number.'
      );
      return;
    }

    if (country.code === 'UA' && !/^[1-9]\d{8}$/.test(digits)) {
      setError(
        ua ? 'Перевірте український номер.' : 'Check your Ukrainian number.'
      );
      return;
    }

    setError('');

    await handleSubmitBooking({
      phone,
      comment: comment.trim()
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 ${
        dark
          ? 'bg-[#0f172a] border-slate-700 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-black">
              {ua ? 'Бронювання автомобіля' : 'Vehicle booking'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {ua
                ? 'Вкажіть номер для зв’язку з менеджером'
                : 'Provide your contact number'}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={bookingSubmitting}
            className={`p-2 rounded-full ${
              dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            <X size={19} />
          </button>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-2xl mb-6 ${
          dark ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
          <img
            src={carToBook.image_url}
            alt={carToBook.title}
            className={`w-24 h-16 object-contain rounded-xl ${
              dark ? 'bg-slate-950' : 'bg-white'
            }`}
          />
          <div>
            <p className="text-sm font-bold">{carToBook.title}</p>
            <p className="text-emerald-500 font-black text-sm mt-1">
              {formatPrice(
                Math.round(
                  Number(carToBook.price) *
                  (1 - (Number(carToBook.discount) || 0) / 100)
                )
              )}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2">
              {ua ? 'Країна' : 'Country'}
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setCountryOpen(value => !value)}
                className={`w-full rounded-xl border p-3 flex justify-between items-center text-sm ${fieldClass}`}
              >
                <span>
                  {ua ? country.ua : country.en} ({country.dial})
                </span>
                <ChevronDown size={16} />
              </button>

              {countryOpen && (
                <div className={`absolute z-30 top-full left-0 right-0 mt-2 max-h-52 overflow-y-auto rounded-xl border shadow-xl ${
                  dark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                }`}>
                  {countries.map(item => (
                    <button
                      type="button"
                      key={item.code}
                      onClick={() => {
                        setCountry(item);
                        setDigits('');
                        setError('');
                        setCountryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm ${
                        dark
                          ? 'text-white hover:bg-slate-700'
                          : 'text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {ua ? item.ua : item.en} ({item.dial})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">
              {ua ? 'Номер телефону' : 'Phone number'} *
            </label>

            <div className={`flex items-center gap-2 rounded-xl border px-3 ${fieldClass}`}>
              <Phone size={16} className="text-emerald-500" />
              <span className="text-sm font-bold">{country.dial}</span>

              <input
                type="tel"
                required
                autoComplete="tel-national"
                inputMode="numeric"
                value={applyMask(digits, country.mask)}
                placeholder={country.mask.replace(/X/g, '_')}
                onChange={(event) => {
                  setDigits(
                    event.target.value.replace(/\D/g, '').slice(0, maxDigits)
                  );
                  setError('');
                }}
                className={`flex-1 min-w-0 py-3 bg-transparent outline-none text-sm ${
                  dark ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {digits.length}/{maxDigits}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">
              {ua ? 'Коментар (необов’язково)' : 'Comment (optional)'}
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={comment}
              onChange={event => setComment(event.target.value)}
              placeholder={
                ua ? 'Зручний час для дзвінка...' : 'Best time to call...'
              }
              className={`w-full rounded-xl border p-3 resize-none outline-none text-sm ${fieldClass}`}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold">{error}</p>
          )}

          <button
            type="submit"
            disabled={!complete || bookingSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {bookingSubmitting
              ? (ua ? 'Надсилання...' : 'Submitting...')
              : (ua ? 'Підтвердити бронювання' : 'Confirm booking')}
          </button>
        </form>
      </div>
    </div>
  );
}