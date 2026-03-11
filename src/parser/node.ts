import { invisibleHTMLEntityNames } from './api/normalize';

export const enum Flag {
  none,
  invisible,
}

export const isInvisibleHTMLEntityName: (name: string) => boolean = eval([
  'name => {',
  'switch(name){',
  invisibleHTMLEntityNames.map(name => `case '${name}':`).join(''),
  'return true;',
  'default:',
  'return false;',
  '}',
  '}',
].join(''));
