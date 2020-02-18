import { Parser, Ctx } from '../../data/parser';
import { DeepMutable } from 'spica/type';

export function creator<P extends Parser<unknown>>(parser: P): P;
export function creator<P extends Parser<unknown>>(cost: number, parser: P): P;
export function creator(cost: number | Parser<unknown>, parser?: Parser<unknown>): Parser<unknown> {
  if (typeof cost === 'function') return creator(1, cost);
  return (source, context: DeepMutable<Ctx>) => {
    if (context.resource?.creation! < 0) throw new Error('Too many creations');
    const result = parser!(source, context);
    if (result && context.resource) {
      context.resource.creation -= cost;
      assert(Object.getPrototypeOf(context.resource).creation % 10 === 0);
    }
    return result;
  };
}

export function backtracker<P extends Parser<unknown>>(parser: P): P;
export function backtracker(parser: Parser<unknown>): Parser<unknown> {
  return (source, context: DeepMutable<Ctx>) => {
    if (context.resource?.backtrack! < 0) throw new Error('Too many backtracking');
    const result = parser(source, context);
    if (!result && context.resource) {
      context.resource.backtrack -= 1;
      assert(Object.getPrototypeOf(context.resource).backtrack % 10 === 0);
    }
    return result;
  };
}
