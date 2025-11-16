import { signal } from 'Elemento';

const countries = signal([
  { name: 'USA', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Chile', code: 'CL' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Peru', code: 'PE' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Bolivia', code: 'BO' },
]);

export const getCountries = () => {
  return countries;
};
