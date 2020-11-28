import { header } from './header';

export function body(source: string): string {
  return source.slice(header(source).length);
}
