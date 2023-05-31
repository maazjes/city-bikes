import { Operator } from 'src/types';

export const isString = (x: unknown): x is string => typeof x === 'string' || x instanceof String;

const isNumber = (x: unknown): x is number =>
  !Number.isNaN(x) && !Number.isNaN(parseFloat(String(x)));

export const createTextFile = (text: string): string => {
  const data = new Blob([text], { type: 'text/csv' });
  const csvURL = window.URL.createObjectURL(data);
  return csvURL;
};
