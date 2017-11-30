import { Result } from '../../../combinator';

export function verify<T extends Result<any, any>>(parser: (source: string) => T): (source: string) => T {
  return (source: string): T => {
    const result = parser(source);
    if (!result) return result;
    if (result[1].split('\n', 1).shift()!.trim() !== '') return undefined as T;
    return result;
  };
}
