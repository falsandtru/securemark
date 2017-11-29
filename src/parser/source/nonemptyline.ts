import { NonemptyLineParser } from '../source';

export const nonemptyline: NonemptyLineParser = (source: string): [[Text], string] | undefined => {
  if (source.length === 0) return;
  const line = source.slice(0, source.split('\n', 1)[0].length + 1);
  return line.trim() === ''
    ? undefined
    : [[document.createTextNode(line)], source.slice(line.length)];
};
