
import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

export default function CarDetailModal({
  car,
  isOpen,
  onClose,
  theme,
  lang,
  formatPrice,
  formatMileage,
  onBook
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [car?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !car) return null;

  const ua = lang === 'ua';
  const dark = theme === 'dark';

  const images = (
    Array.isArray(car.images) && car.images.length
      ? car.images
      : Array.isArray(car.image_urls) && car.image_urls.length
        ? car.image_urls
        : [car.image_url]
  )
    .map(image =>
      typeof image === 'string'
        ? image
        : image?.image_url || image?.url || ''
    )
    .filter(Boolean);

  const currentIndex = Math.min(
    index,
    Math.max(0, images.length - 1)
  );

  const selectedImage = images[currentIndex];

  const discount = Math.max(
    0,
    Math.min(100, Number(car.discount) || 0)
  );

  const finalPrice = Math.round(
    Number(car.price || 0) * (1 - discount / 100)
  );

  const archived = Boolean(car.is_archived);
  const pending = car.booking_status === 'pending';
  const unavailable = archived || pending;

  const liquidity = Math.min(
    100,
    Math.max(0, Number(car.liquidity_score) || 0)
  );

  const specs = [
    [ua ? 'Рік' : 'Year', car.year ?? '—'],
    [
      ua ? 'Пробіг' : 'Mileage',
      formatMileage(car.mileage_raw ?? car.mileage)
    ],
    [
      ua ? 'Двигун' : 'Engine',
      car.engine_volume || '2.0L'
    ],
    [
      ua ? 'Кузов' : 'Body',
      car.body_type || '—'
    ],
    [
      ua ? 'Коробка передач' : 'Transmission',
      car.transmission || '—'
    ],
    [
      ua ? 'Ліквідність' : 'Liquidity',
      `${liquidity}/100`
    ]
  ];

  const previous = () => {
    if (images.length <= 1) return;

    setIndex(prev =>
      (prev - 1 + images.length) % images.length
    );
  };

  const next = () => {
    if (images.length <= 1) return;

    setIndex(prev =>
      (prev + 1) % images.length
    );
  };

  const handleBook = () => {
    if (unavailable) return;

    onClose();
    onBook(car);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={car.title}
        className={`relative w-full max-w-6xl h-[94dvh] sm:h-[90dvh] lg:h-[740px] lg:max-h-[90dvh] min-h-0 overflow-y-auto lg:overflow-hidden rounded-3xl border shadow-2xl grid grid-cols-1 lg:grid-cols-[1.08fr_1fr] ${
          dark
            ? 'bg-[#0f172a] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={ua ? 'Закрити' : 'Close'}
          className="absolute top-4 right-4 z-30 bg-black/75 hover:bg-black text-white rounded-full p-2.5 shadow-lg"
        >
          <X size={19} />
        </button>

        <div
          className={`flex flex-col min-h-0 p-3 sm:p-4 gap-3 ${
            dark
              ? 'bg-[#0a1120]'
              : 'bg-[#e9eef4]'
          }`}
        >
          <div
            className={`relative group w-full h-[240px] sm:h-[330px] lg:h-auto lg:flex-1 lg:min-h-0 overflow-hidden rounded-2xl ${
              dark
                ? 'bg-slate-900'
                : 'bg-slate-200'
            }`}
          >
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-45 pointer-events-none"
                />

                <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={`${car.title} — ${currentIndex + 1}`}
                    className="w-full h-full object-contain object-center transition-transform duration-500 ease-out"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <ImageIcon size={42} />
                <span className="text-xs">
                  {ua
                    ? 'Фотографія відсутня'
                    : 'No image available'}
                </span>
              </div>
            )}

            {car.badge && (
              <span className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg">
                {car.badge}
              </span>
            )}

            {discount > 0 && (
              <span className="absolute top-12 left-3 z-20 px-3 py-1.5 rounded-full bg-red-500 text-white text-[10px] font-black shadow-lg">
                -{discount}%
              </span>
            )}

            {pending && !archived && (
              <span className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-lg">
                {ua ? 'Заброньовано' : 'Reserved'}
              </span>
            )}

            {archived && (
              <span className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-full bg-slate-800 text-white text-[10px] font-black shadow-lg">
                {ua ? 'В архіві' : 'Archived'}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  aria-label={ua ? 'Попереднє фото' : 'Previous photo'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/70 hover:bg-black text-white p-2.5 shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label={ua ? 'Наступне фото' : 'Next photo'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/70 hover:bg-black text-white p-2.5 shadow-lg"
                >
                  <ChevronRight size={20} />
                </button>

                <span className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold">
                  {currentIndex + 1}/{images.length}
                </span>
              </>
            )}
          </div>

          <div className="shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  type="button"
                  key={`${car.id}-${i}`}
                  onClick={() => setIndex(i)}
                  aria-label={`${ua ? 'Фото' : 'Photo'} ${i + 1}`}
                  className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    currentIndex === i
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : dark
                        ? 'border-slate-700'
                        : 'border-slate-300'
                  }`}
                >
                  <img
                    src={src}
                    alt={`${car.title} ${i + 1}`}
                    className={`w-full h-full object-contain ${
                      dark ? 'bg-slate-900' : 'bg-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            {images.length > 0 && (
              <p className="text-[11px] text-slate-400 text-center mt-1">
                {ua
                  ? `${images.length} фото автомобіля`
                  : `${images.length} vehicle photos`}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col min-h-0 p-4 sm:p-6 lg:p-7 gap-4 lg:gap-5 lg:overflow-hidden">
          <div className="shrink-0 pr-10">
            <p className="text-emerald-500 text-[10px] tracking-widest font-black uppercase">
              Verified Market Listing
            </p>

            <div className="flex flex-wrap justify-between items-start gap-3 mt-2">
              <h2 className="text-xl sm:text-2xl font-black break-words min-w-0">
                {car.title}
              </h2>

              <div className="text-left sm:text-right shrink-0">
                {discount > 0 && (
                  <p className="line-through text-slate-400 text-xs">
                    {formatPrice(car.price)}
                  </p>
                )}

                <p className="text-xl font-black text-emerald-500">
                  {formatPrice(finalPrice)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className={`rounded-xl border p-3 min-w-0 ${
                  dark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-[10px] text-slate-400">
                  {label}
                </p>

                <p className="text-xs font-bold mt-1 break-words">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`rounded-2xl border p-4 shrink-0 ${
              dark
                ? 'border-emerald-700 bg-emerald-950/30'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="flex justify-between items-center gap-2">
              <p className="text-emerald-500 font-bold text-xs">
                {ua
                  ? 'Ліквідність автомобіля'
                  : 'Resale outlook'}
              </p>

              <p className="text-sm font-black text-emerald-500">
                {liquidity}/100
              </p>
            </div>

            <div
              className={`mt-3 h-2 rounded-full overflow-hidden ${
                dark
                  ? 'bg-slate-700/40'
                  : 'bg-emerald-200'
              }`}
            >
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${liquidity}%` }}
              />
            </div>
          </div>

          <section
            className={`flex flex-col min-h-[130px] max-h-[170px] lg:max-h-none lg:min-h-0 lg:flex-1 rounded-2xl border overflow-hidden ${
              dark
                ? 'bg-slate-900/80 border-slate-700'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div
              className={`px-4 py-3 shrink-0 border-b ${
                dark
                  ? 'border-slate-700'
                  : 'border-slate-200'
              }`}
            >
              <h3 className="text-xs font-black uppercase tracking-wide">
                {ua
                  ? 'Опис автомобіля'
                  : 'Vehicle description'}
              </h3>
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4"
              tabIndex={0}
              aria-label={
                ua
                  ? 'Прокручуваний опис автомобіля'
                  : 'Scrollable vehicle description'
              }
            >
              <p
                className={`text-sm leading-6 whitespace-pre-wrap break-words ${
                  dark
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                {car.description?.trim()
                  ? car.description
                  : ua
                    ? 'Опис автомобіля відсутній.'
                    : 'No vehicle description available.'}
              </p>
            </div>
          </section>

          <div className="shrink-0 pt-1">
            <button
              type="button"
              disabled={unavailable}
              onClick={handleBook}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors"
            >
              {archived
                ? (ua ? 'В архіві' : 'Archived')
                : pending
                  ? (ua ? 'Заброньовано' : 'Reserved')
                  : (ua ? 'Забронювати автомобіль' : 'Book now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
