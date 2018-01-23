import { CharParser } from '../source';

export function char(char: '`'): CharParser.BackquoteParser;
export function char(char: string) {
  return (source: string): [[Text], string] | undefined => {
    assert(char.length === 1);
    switch (source[0]) {
      case char:
        return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
      default:
        return;
    }
  };
};
