import { invisibleHTMLEntityNames } from './api/normalize';

export const enum Flag {
  none,
  invisible,
}

export function isinvisibleHTMLEntityName(name: string): boolean {
  return invisibleHTMLEntityNames.includes(name);
}
