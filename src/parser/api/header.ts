import { undefined } from 'spica/global';
import { segment } from '../segment';
import { header as parse } from '../header';

export function header(source: string): string[] | undefined {
  source = segment(source)[0];
  return parse(source, {})
    ? source.trim().match(/^.*$/gm)?.slice(1, -1) || []
    : undefined;
}
