import { undefined } from 'spica/global';
import { body } from './body';
import { normalize } from './normalize';

export function header(source: string): string[] | undefined {
  source = normalize(source.slice(0, source.length - body(source).length).trimEnd());
  return source !== ''
    ? source.split('\n').slice(1, -1)
    : undefined;
}
