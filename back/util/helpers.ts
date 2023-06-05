import bcrypt from 'bcrypt';
import { Operator } from 'types';
import { Op, WhereOptions } from 'sequelize';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hashed = bcrypt.hash(password, salt);
  return hashed;
};

const isString = (x: unknown): x is string => typeof x === 'string' || x instanceof String;

const isDate = (x: unknown): x is Date => !Number.isNaN(new Date(String(x)).getDate());

const isNumber = (x: unknown): x is number => {
  if (typeof x !== 'string') return false;
  return !Number.isNaN(x) && !Number.isNaN(parseFloat(x));
};

const createWhere = (
  field: string,
  operator: Operator,
  value?: string | number
): WhereOptions | undefined => {
  const sequelizeOperator =
    operator === '!='
      ? Op.ne
      : operator === '<'
      ? Op.lt
      : operator === '<='
      ? Op.lte
      : operator === '='
      ? Op.eq
      : operator === '>'
      ? Op.gt
      : operator === '>='
      ? Op.gte
      : operator === 'contains'
      ? Op.iLike
      : operator === 'endsWith'
      ? Op.iLike
      : operator === 'equals'
      ? Op.eq
      : operator === 'isAnyOf'
      ? Op.in
      : operator === 'startsWith'
      ? Op.iLike
      : operator === 'isEmpty'
      ? Op.eq
      : operator === 'isNotEmpty'
      ? Op.ne
      : undefined;

  if (!sequelizeOperator) {
    return undefined;
  }

  let finalValue: string | number | string[] | number[] | null | undefined = value;
  if (operator === 'isAnyOf' && isString(value)) {
    finalValue = value.split(',');
  }
  if (operator === 'isEmpty' || operator === 'isNotEmpty') {
    finalValue = null;
  }
  if (value) {
    if (operator === 'startsWith') {
      finalValue = `${value}%`;
    }
    if (operator === 'endsWith') {
      finalValue = `%${value}`;
    }
    if (operator === 'contains') {
      finalValue = `%${value}%`;
    }
  }
  if (finalValue === undefined) {
    return undefined;
  }

  return { [field]: { [sequelizeOperator]: finalValue } };
};

export { hashPassword, isString, createWhere, isNumber, isDate };
