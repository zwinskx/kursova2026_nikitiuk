
export const KM_PER_MILE = 1.60934;

export const convertDistance = (value, from = 'mi', to = 'mi') => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  const number = Number(value);

  if (!Number.isFinite(number)) return NaN;

  if (from === to) return number;

  if (from === 'mi' && to === 'km') {
    return Math.round(number * KM_PER_MILE);
  }

  if (from === 'km' && to === 'mi') {
    return Math.round(number / KM_PER_MILE);
  }

  return NaN;
};
