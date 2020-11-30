import { Parser } from '../../data/parser';

export function creator<P extends Parser<unknown>>(parser: P): P;
export function creator<P extends Parser<unknown>>(cost: number, parser: P): P;
export function creator(cost: number | Parser<unknown>, parser?: Parser<unknown>): Parser<unknown> {
  if (typeof cost === 'function') return creator(1, cost);
  assert(cost > 0);
  return (source, context) => {
    const { resources } = context;
    if (!resources) return parser!(source, context);
    const result = parser!(source, context);
    if (result) {
      resources.budget -= cost;
      assert(Object.getPrototypeOf(resources).budget % 10 === 0);
    }
    assert(resources.budget !== undefined);
    if (resources.budget < 0) throw new Error('Too many creations.');
    return result;
  };
}
