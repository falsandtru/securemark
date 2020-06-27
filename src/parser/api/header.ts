import { undefined } from 'spica/global';
import { normalize } from '../normalize';
import { header as parse } from '../header';

export function header(source: string): string[] | undefined {
  source = normalize(source);
  const [[el], rest] = parse(source, {}) || [[], source];
  return el?.tagName === 'DIV'
    ? source.slice(0, source.length - rest.length).trim().match(/^.*$/gm)?.slice(1, -1) || []
    : undefined;
}
