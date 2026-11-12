
import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function DiscoverPage() {
  const { theme } = useTheme();

  const {
    lang,
    currentText,
    formatPrice,
    formatMileage,
    budget,
    setBudget,
    selectedBrand,
    setSelectedBrand,
    selectedBody,
    setSelectedBody,
    minLiquidityFilter,
    setMinLiquidityFilter,
    handleApplyFilters,
    cars,
    currentUserData,
    handleToggleSave,
    handleOpenCarDetail,
    handleOpenBookingModal,
    getFinalPrice
  } = useApp();

  const dark = theme === 'dark';

  const selectClass = `w-full p-2.5 border rounded-xl text-sm font-semibold outline-none cursor-pointer ${
    dark
      ? 'bg-slate-900 border-slate-700 text-white'
      : 'bg-white border-slate-300 text-slate-900'
  }`;

  const labelClass = `text-xs font-bold block mb-2 text-left ${
    dark
      ? 'text-slate-300'
      : 'text-slate-800'
  }`;

  const detailsClass = dark
    ? 'bg-slate-800 hover:bg-emerald-500 hover:text-white text-white'
    : 'bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-800';

  const availableCars = Array.isArray(cars) ? cars : [];

  const orderedCars = [...availableCars].sort(
    (a, b) =>
      Number(Boolean(a.is_archived)) -
      Number(Boolean(b.is_archived))
  );

  const savedIds = Array.isArray(currentUserData?.saved)
    ? currentUserData.saved.map(Number)
    : [];

  return (
    <div className="animate-fadeIn space-y-6">
      <div
        className={`p-8 rounded-3xl border mb-8 shadow-xl ${
          dark
            ? 'bg-gradient-to-r from-emerald-500/15 via-[#0f172a] to-[#0f172a] border-emerald-500/20 text-white'
            : 'bg-emerald-50 border-emerald-200 text-slate-900'
        }`}
      >
        <h1
          className="text-4xl font-extrabold mb-3 text-left"
          dangerouslySetInnerHTML={{
            __html: currentText.findCar
          }}
        />

        <p
          className={`text-sm font-medium max-w-xl text-left ${
            dark
              ? 'text-slate-300'
              : 'text-slate-700'
          }`}
        >
          {currentText.subtitleDiscover}
        </p>
      </div>

      <div
        className={`p-6 rounded-3xl border shadow-xl mb-8 ${
          dark
            ? 'bg-[#0f172a] border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className={labelClass}>
              {currentText.maxBudget} ({formatPrice(budget)})
            </label>

            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={budget}
              onChange={event => setBudget(event.target.value)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className={labelClass}>
              {currentText.brand}
            </label>

            <select
              value={selectedBrand}
              onChange={event => setSelectedBrand(event.target.value)}
              className={selectClass}
            >
              <option value="All">
                {currentText.allBrands}
              </option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {currentText.bodyType}
            </label>

            <select
              value={selectedBody}
              onChange={event => setSelectedBody(event.target.value)}
              className={selectClass}
            >
              <option value="Any">{currentText.anyBody}</option>
              <option value="Sedan">{currentText.sedan}</option>
              <option value="SUV">{currentText.suv}</option>
              <option value="Coupe">{currentText.coupe}</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {currentText.minLiquidity} ({minLiquidityFilter}+)
            </label>

            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minLiquidityFilter}
              onChange={event =>
                setMinLiquidityFilter(event.target.value)
              }
              className="w-full accent-emerald-500 cursor-pointer mt-1"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {currentText.apply}
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-left">
        {currentText.topRecommendations} ({availableCars.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orderedCars.map(car => {
          const isSaved = savedIds.includes(Number(car.id));

          const archived = Boolean(car.is_archived);
          const pending = car.booking_status === 'pending';
          const unavailable = archived || pending;

          const discount = Number(car.discount) || 0;

          const liquidity = Math.min(
            100,
            Math.max(0, Number(car.liquidity_score) || 0)
          );

          return (
            <div
              key={car.id}
              className={`relative rounded-3xl overflow-hidden border shadow-xl flex flex-col justify-between transition-all duration-300 ${
                dark
                  ? 'bg-[#0f172a] border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              } ${
                archived ? 'opacity-60 grayscale' : ''
              }`}
            >
              <div
                className={`relative group h-52 sm:h-56 overflow-hidden ${
                  dark
                    ? 'bg-slate-900'
                    : 'bg-slate-200'
                }`}
              >
                {car.image_url && (
                  <>
                    <img
                      src={car.image_url}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-65 pointer-events-none"
                    />

                    <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                      <img
                        src={car.image_url}
                        alt={car.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[0.92]"
                      />
                    </div>
                  </>
                )}

                {car.badge && (
                  <span className="absolute z-20 top-3 left-3 text-[10px] font-extrabold px-3 py-1.5 bg-emerald-500 text-white rounded-full uppercase shadow-lg">
                    {car.badge}
                  </span>
                )}

                {discount > 0 && (
                  <span className="absolute z-20 bottom-3 left-3 text-[10px] font-extrabold px-3 py-1.5 bg-red-500 text-white rounded-full shadow-lg">
                    -{discount}%
                  </span>
                )}

                {pending && !archived && (
                  <span className="absolute z-20 bottom-3 right-3 text-[10px] font-black px-3 py-1.5 bg-amber-500 text-slate-950 rounded-full shadow-lg">
                    {lang === 'ua'
                      ? 'Заброньовано'
                      : 'Reserved'}
                  </span>
                )}

                {archived && (
                  <span className="absolute z-20 bottom-3 right-3 text-[10px] font-black px-3 py-1.5 bg-slate-800 text-white rounded-full shadow-lg">
                    {lang === 'ua'
                      ? 'В архіві'
                      : 'Archived'}
                  </span>
                )}

                <button
                  type="button"
                  disabled={archived}
                  aria-label={
                    isSaved
                      ? lang === 'ua'
                        ? 'Прибрати зі збережених'
                        : 'Remove from saved'
                      : lang === 'ua'
                        ? 'Додати у збережені'
                        : 'Add to saved'
                  }
                  onClick={() => handleToggleSave(car.id)}
                  className={`absolute z-20 top-3 right-3 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50 ${
                    isSaved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-black/60 text-white hover:bg-black'
                  }`}
                >
                  <Bookmark
                    size={16}
                    fill={isSaved ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center gap-3">
                  <h3 className="font-bold text-lg text-left min-w-0 break-words">
                    {car.title}
                  </h3>

                  <div className="text-right shrink-0">
                    {discount > 0 && (
                      <span className="block text-[10px] font-semibold line-through text-slate-400">
                        {formatPrice(car.price)}
                      </span>
                    )}

                    <span className="text-lg font-black text-emerald-500">
                      {formatPrice(getFinalPrice(car))}
                    </span>
                  </div>
                </div>

                <p
                  className={`text-xs font-semibold text-left ${
                    dark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {car.body_type} • {car.year} •{' '}
                  {car.engine_volume || '2.0L'} •{' '}
                  {formatMileage(car.mileage_raw ?? 15000)}
                </p>

                <div
                  className={`p-3 rounded-2xl border ${
                    dark
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-xs font-bold ${
                        dark
                          ? 'text-slate-300'
                          : 'text-slate-600'
                      }`}
                    >
                      {currentText.liquidityScoreLabel}
                    </span>

                    <span className="text-emerald-500 font-black text-sm">
                      {car.liquidity_score} / 100
                    </span>
                  </div>

                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      dark
                        ? 'bg-slate-700/50'
                        : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${liquidity}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCarDetail(car)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      detailsClass
                    }`}
                  >
                    {currentText.details}
                  </button>

                  <button
                    type="button"
                    disabled={unavailable}
                    onClick={() => handleOpenBookingModal(car)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:bg-slate-500 disabled:cursor-not-allowed"
                  >
                    {archived
                      ? currentText.unavailable
                      : pending
                        ? lang === 'ua'
                          ? 'Заброньовано'
                          : 'Reserved'
                        : currentText.book}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
