
import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  if (!isOpen || !car) return null;

  const ua = lang === 'ua';
  const dark = theme === 'dark';

  const images = (
    Array.isArray(car.images) && car.images.length
      ? car.images
      : Array.isArray(car.image_urls) && car.image_urls.length
        ? car.image_urls
        : [car.image_url]
  ).filter(Boolean);

  const selectedImage = images[index] || images[0];

  const finalPrice = Math.round(
    Number(car.price) *
    (1 - (Number(car.discount) || 0) / 100)
  );

  const archived = Boolean(car.is_archived);
  const pending = car.booking_status === 'pending';
  const unavailable = archived || pending;

  const specs = [
    [ua ? 'Рік' : 'Year', car.year],
    [
      ua ? 'Пробіг' : 'Mileage',
      formatMileage(car.mileage_raw ?? car.mileage)
    ],
    [ua ? 'Двигун' : 'Engine', car.engine_volume || '2.0L'],
    [ua ? 'Кузов' : 'Body', car.body_type],
    [
      ua ? 'Коробка передач' : 'Transmission',
      car.transmission
    ],
    [
      ua ? 'Ліквідність' : 'Liquidity',
      `${car.liquidity_score}/100`
    ]
  ];

  const previous = () => {
    setIndex(prev =>
      (prev - 1 + images.length) % images.length
    );
  };

  const next = () => {
    setIndex(prev =>
      (prev + 1) % images.length
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl shadow-2xl border grid grid-cols-1 md:grid-cols-[1.12fr_1fr] ${
        dark
          ? 'bg-[#0f172a] border-slate-700 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-900/80 text-white rounded-full p-2 hover:bg-slate-700"
        >
          <X size={18} />
        </button>

        <div className={`p-4 flex flex-col gap-3 ${
          dark ? 'bg-slate-950' : 'bg-slate-50'
        }`}>
          <div className={`relative h-[300px] md:h-[440px] flex items-center justify-center rounded-2xl overflow-hidden ${
            dark ? 'bg-slate-900' : 'bg-white'
          }`}>
            {selectedImage && (
              <img
                src={selectedImage}
                alt={`${car.title} — ${index + 1}`}
                className="w-full h-full object-contain"
              />
            )}

            {car.badge && (
              <span className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full px-3 py-1 text-[10px] font-bold">
                {car.badge}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black"
                >
                  <ChevronRight size={20} />
                </button>

                <span className="absolute bottom-3 right-3 text-white text-xs bg-black/70 rounded-lg px-2 py-1">
                  {index + 1}/{images.length}
                </span>
              </>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                type="button"
                key={`${i}-${src.slice(0, 20)}`}
                onClick={() => setIndex(i)}
                className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 ${
                  index === i
                    ? 'border-emerald-500'
                    : dark
                      ? 'border-slate-700'
                      : 'border-slate-200'
                }`}
              >
                <img
                  src={src}
                  alt={`${car.title} ${i + 1}`}
                  className={`w-full h-full object-contain ${
                    dark ? 'bg-slate-900' : 'bg-white'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="pr-8">
            <p className="text-emerald-500 text-[10px] tracking-widest font-black uppercase">
              Verified Market Listing
            </p>

            <div className="flex justify-between items-start gap-3 mt-3">
              <h2 className="text-2xl font-black">
                {car.title}
              </h2>

              <div className="text-right shrink-0">
                {Number(car.discount) > 0 && (
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className={`rounded-xl border p-3 ${
                  dark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-[10px] text-slate-400">
                  {label}
                </p>
                <p className="text-xs font-bold mt-1">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className={`rounded-2xl border p-4 ${
            dark
              ? 'border-emerald-700 bg-emerald-950/30'
              : 'border-emerald-200 bg-emerald-50'
          }`}>
            <p className="text-emerald-500 font-bold text-sm">
              {ua
                ? 'Ліквідність автомобіля'
                : 'Resale outlook'}: {car.liquidity_score}/100
            </p>

            <div className={`mt-3 h-2 rounded-full overflow-hidden ${
              dark ? 'bg-slate-700/40' : 'bg-emerald-200'
            }`}>
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Number(car.liquidity_score) || 0)
                  )}%`
                }}
              />
            </div>
          </div>

          {car.description && (
            <p className="text-sm leading-relaxed opacity-80">
              {car.description}
            </p>
          )}

          <button
            type="button"
            disabled={unavailable}
            onClick={() => {
              onClose();
              onBook(car);
            }}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold"
          >
            {archived
              ? (ua ? 'В архіві' : 'Archived')
              : pending
                ? (ua ? 'Заброньовано' : 'Reserved')
                : (ua ? 'Забронювати' : 'Book now')}
          </button>
        </div>
      </div>
    </div>
  );
}
