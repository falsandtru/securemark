import { Parser } from '../../data/parser';

export function creator<P extends Parser<unknown>>(parser: P): P;
export function creator<P extends Parser<unknown>>(cost: number, parser: P): P;
export function creator(cost: number | Parser<unknown>, parser?: Parser<unknown>): Parser<unknown> {
  if (typeof cost === 'function') return creator(1, cost);
  assert(cost > 0);
  return (source, context) => {
    const { resources = { budget: 1, recursion: 1 } } = context;
    if (resources.budget <= 0) throw new Error('Too many creations.');
    if (resources.recursion <= 0) throw new Error('Too much recursion.');
    --resources.recursion;
    const result = parser!(source, context);
    ++resources.recursion;
    if (result) {
      resources.budget -= cost;
    }
    return result;
  };
}
