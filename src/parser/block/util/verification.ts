import { Result } from '../../../combinator';

export function verify<T extends Result<any, any>>(parser: (source: string) => T): (source: string) => T {
  return source => {
    const result = parser(source);
    if (!result) return result;
    assert(result[0].length < 2);
    if (result[1].split('\n', 1)[0].trim() !== '') return undefined as T;
    return result;
  };
}
