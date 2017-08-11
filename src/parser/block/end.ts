import { Result } from '../../combinator/parser';

export function verifyBlockEnd<a extends Result<any, any>>(parser: (source: string) => a): (source: string) => a {
  return (source: string) => {
    const result = parser(source);
    if (!result) return result;
    if (result[1].split('\n', 1).shift()!.trim() !== '') return <a>void 0;
    return result;
  };
}
