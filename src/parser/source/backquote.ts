import { BackquoteParser } from '../source';

export const backquote: BackquoteParser = (source: string): [[Text], string] | undefined => {
  switch (source[0]) {
    case '`':
      return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
    default:
      return;
  }
};
