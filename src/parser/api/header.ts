import { undefined } from 'spica/global';
import { body } from './body';

export function header(source: string): string[] | undefined {
  source = source.slice(0, source.length - body(source).length).trim();
  return source !== ''
    ? source.split('\n').slice(1, -1)
    : undefined;
}
