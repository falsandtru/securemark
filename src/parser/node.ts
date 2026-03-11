import { invisibleBlankHTMLEntityNames } from './api/normalize';

export const enum Flag {
  none,
  blank,
}

export const isBlankHTMLEntityName: (name: string) => boolean = eval([
  'name => {',
  'switch(name){',
  invisibleBlankHTMLEntityNames.map(name => `case '${name}':`).join(''),
  'return true;',
  'default:',
  'return false;',
  '}',
  '}',
].join(''));
