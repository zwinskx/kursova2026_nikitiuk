
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export default function OverviewPage() {
  const { theme } = useTheme();

  const {
    currentText,
    user,
    lang,
    setActiveTab,
    totalDbCars,
    formatPrice,
    calculatedAvgPrice,
    calculatedLiquidityAvg,
    calculatedSavedValue,
    currentUserData,
    savedVehiclesObjects,
    purchasedCars
  } = useApp();

  const dark = theme === 'dark';

  const cardClass = dark
    ? 'bg-slate-900/50 border-slate-800 text-white'
    : 'bg-slate-50 border-slate-200 text-slate-900';

  const confirmedPurchases = Array.isArray(purchasedCars)
    ? purchasedCars.filter(item => item.status === 'approved')
    : [];

  return (
    <div className="space-y-8 animate-fadeIn transition-all duration-500">
      <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500 ${
        dark
          ? 'bg-[#0f172a] border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Smart Market Intelligence
            </span>

            <h1 className="text-3xl font-black mt-1 text-left">
              {currentText.hello}, {user?.display_name || currentText.guest}!
            </h1>

            <p className={`text-xs font-medium mt-1 text-left ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {lang === 'ua'
                ? 'Ось що відбувається на автомобільному ринку сьогодні.'
                : 'Here is what is happening in the automotive market today.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
          >
            {lang === 'ua'
              ? 'Переглянути звіт ринку >'
              : 'View market report >'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className={`p-4 rounded-2xl border ${cardClass}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400 text-left">
              {currentText.carsAnalyzed}
            </p>

            <p className="text-2xl font-black mt-1 text-left">
              {totalDbCars.toLocaleString()}
            </p>

            <span className="text-[10px] text-emerald-400 font-bold text-left block">
              +142 {lang === 'ua'
                ? 'додано цього місяця'
                : 'added this month'}
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${cardClass}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400 text-left">
              {currentText.averagePrice}
            </p>

            <p className="text-2xl font-black mt-1 text-left">
              {formatPrice(calculatedAvgPrice)}
            </p>

            <span className="text-[10px] text-emerald-400 font-bold text-left block">
              {lang === 'ua'
                ? 'По всій активній базі БД'
                : 'Across all active DB listings'}
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${cardClass}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400 text-left">
              {currentText.marketLiquidity}
            </p>

            <p className="text-2xl font-black mt-1 text-left">
              {calculatedLiquidityAvg}
            </p>

            <span className="text-[10px] text-emerald-400 font-bold text-left block">
              {lang === 'ua'
                ? 'Здоровий попит покупців'
                : 'Healthy buyer demand'}
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${cardClass}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400 text-left">
              {currentText.savedValue}
            </p>

            <p className="text-2xl font-black mt-1 text-left">
              {formatPrice(calculatedSavedValue)}
            </p>

            <span className="text-[10px] text-emerald-400 font-bold text-left block">
              {lang === 'ua'
                ? `Підтверджених покупок: ${confirmedPurchases.length}`
                : `Confirmed purchases: ${confirmedPurchases.length}`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`md:col-span-2 p-6 rounded-3xl border ${
          dark
            ? 'bg-[#0f172a] border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base text-left">
              {currentText.marketTrend}
            </h3>

            <div className="flex gap-1 text-[10px] font-bold">
              {['1M', '3M', '6M', '1Y'].map((period, index) => (
                <span
                  key={period}
                  className={`px-2 py-1 rounded ${
                    dark
                      ? index === 0
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-800 text-slate-300'
                      : index === 0
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {period}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm font-black text-emerald-400 mb-4 text-left">
            {formatPrice(calculatedAvgPrice)}{' '}
            <span className="text-xs text-emerald-500 font-semibold">
              +{formatPrice(1080)} vs previous period
            </span>
          </p>

          <div className="h-40 flex items-end gap-3 pt-6 border-b border-slate-700/50 px-2">
            <div className="w-1/6 bg-emerald-500/20 h-[30%] rounded-t-xl" />
            <div className="w-1/6 bg-emerald-500/30 h-[50%] rounded-t-xl" />
            <div className="w-1/6 bg-emerald-500/40 h-[65%] rounded-t-xl" />
            <div className="w-1/6 bg-emerald-500/60 h-[80%] rounded-t-xl" />
            <div className="w-1/6 bg-emerald-500/80 h-[70%] rounded-t-xl" />
            <div className="w-1/6 bg-emerald-500 h-[95%] rounded-t-xl shadow-lg shadow-emerald-500/30" />
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
          dark
            ? 'bg-gradient-to-br from-emerald-950 via-[#0f172a] to-[#0f172a] border-emerald-500/30 text-white'
            : 'bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-200 text-slate-900'
        }`}>
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded uppercase">
              {currentText.aiInsight}
            </span>

            <h3 className="font-extrabold text-lg mt-3 text-left">
              {lang === 'ua'
                ? 'Найкращий час купувати преміум седани зараз.'
                : 'The best time to buy premium sedans is now.'}
            </h3>

            <p className={`text-xs font-medium mt-2 leading-relaxed text-left ${
              dark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {lang === 'ua'
                ? 'Ціни на 6.2% нижчі за сезонну середню, тоді як ліквідність зростає третій тиждень поспіль.'
                : 'Prices are 6.2% below the seasonal average while liquidity has increased for the third week in a row.'}
            </p>
          </div>

          <div className={`pt-4 border-t flex justify-between items-center text-xs font-semibold ${
            dark
              ? 'border-slate-700/50 text-slate-300'
              : 'border-slate-200 text-slate-700'
          }`}>
            <span>{currentText.confidence}</span>
            <span className="font-bold text-emerald-400">
              High - 92%
            </span>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl ${
        dark
          ? 'bg-[#0f172a] border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <h3 className="text-xl font-bold mb-5 text-left">
          {lang === 'ua'
            ? 'Історія придбаних автомобілів'
            : 'Purchased vehicles'}
        </h3>

        {confirmedPurchases.length === 0 ? (
          <p className="text-sm text-slate-400 text-left">
            {lang === 'ua'
              ? 'Поки немає підтверджених покупок.'
              : 'No confirmed purchases yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {confirmedPurchases.map(booking => (
              <div
                key={booking.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  dark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <img
                  src={booking.image_url}
                  alt={booking.car_title}
                  className={`w-24 h-16 object-contain rounded-xl ${
                    dark ? 'bg-slate-950' : 'bg-white'
                  }`}
                />

                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-sm">
                    {booking.car_title}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {booking.decided_at
                      ? new Date(booking.decided_at).toLocaleDateString(
                          lang === 'ua' ? 'uk-UA' : 'en-US'
                        )
                      : '—'}
                  </p>
                </div>

                <span className="text-emerald-500 font-black text-sm">
                  {formatPrice(
                    Number(
                      booking.purchase_price ??
                      booking.car_price ??
                      0
                    )
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
