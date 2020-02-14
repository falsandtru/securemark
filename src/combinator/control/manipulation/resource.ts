import { Parser, Ctx } from '../../data/parser';
import { DeepMutable } from 'spica/type';

export function creation<P extends Parser<unknown>>(parser: P): P;
export function creation<P extends Parser<unknown>>(amount: number, parser: P): P;
export function creation(amount: number | Parser<unknown>, parser?: Parser<unknown>): Parser<unknown> {
  if (typeof amount === 'function') return creation(1, amount);
  return (source, context: DeepMutable<Ctx>) => {
    if (context.resource?.creation! < 0) throw new Error('Too many creations');
    const result = parser!(source, context);
    if (result && context.resource) {
      context.resource.creation -= amount;
    }
    return result;
  };
}

export function backtrack<P extends Parser<unknown>>(parser: P): P;
export function backtrack(parser: Parser<unknown>): Parser<unknown> {
  return (source, context: DeepMutable<Ctx>) => {
    if (context.resource?.backtrack! < 0) throw new Error('Too many backtracking');
    const result = parser(source, context);
    if (!result && context.resource) {
      void --context.resource.backtrack;
    }
    return result;
  };
}
