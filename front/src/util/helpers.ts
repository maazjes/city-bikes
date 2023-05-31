import { Operator } from 'src/types';

export const isString = (x: unknown): x is string => typeof x === 'string' || x instanceof String;

const isNumber = (x: unknown): x is number =>
  !Number.isNaN(x) && !Number.isNaN(parseFloat(String(x)));

export const createComparator = (
  filterBy: string | number | null,
  value: string | string[],
  operator: Operator
): boolean => {
  if (operator === 'isEmpty') {
    return filterBy === null;
  }

  if (operator === 'isNotEmpty') {
    return filterBy !== null;
  }

  if (Array.isArray(value)) {
    return value.map((v) => v.toLowerCase()).includes(String(filterBy).toLowerCase());
  }

  if (isNumber(value) && isNumber(filterBy)) {
    const valueNum = parseInt(value);
    return operator === '!='
      ? filterBy !== valueNum
      : operator === '<'
      ? filterBy < valueNum
      : operator === '<='
      ? filterBy <= valueNum
      : operator === '='
      ? filterBy === valueNum
      : operator === '>'
      ? filterBy > valueNum
      : operator === '>='
      ? filterBy >= valueNum
      : false;
  }

  if (isString(value) && isString(filterBy)) {
    return operator === 'endsWith'
      ? value.endsWith(filterBy)
      : operator === 'equals'
      ? value === filterBy
      : operator === 'startsWith'
      ? value.startsWith(filterBy)
      : operator === 'contains'
      ? filterBy.toLowerCase().includes(value.toLowerCase())
      : false;
  }

  return false;
};

export const createTextFile = (text: string): string => {
  const data = new Blob([text], { type: 'text/csv' });
  const csvURL = window.URL.createObjectURL(data);
  return csvURL;
};
