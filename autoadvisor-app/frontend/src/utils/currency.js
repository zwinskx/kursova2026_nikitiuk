
export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  UAH: 41.5
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  UAH: '₴'
};

export function convertCurrency(amount, from = 'USD', to = 'USD') {
  if (amount === '' || amount === null || amount === undefined) {
    return '';
  }

  const value = Number(amount);
  const fromRate = CURRENCY_RATES[from];
  const toRate = CURRENCY_RATES[to];

  if (!Number.isFinite(value) || !fromRate || !toRate) {
    return NaN;
  }

  return Math.round((value / fromRate) * toRate * 100) / 100;
}

export const toUSD = (amount, currency = 'USD') =>
  convertCurrency(amount, currency, 'USD');
