import { Parser, List, Data, Ctx, CtxOptions, input } from '../parser';
import { some } from './some';
import { reset, context, creation } from './context';
import { unwrap } from '../../../parser/util';

describe('Unit: combinator/data/parser/context', () => {
  interface Context extends CtxOptions {
    status?: boolean;
  }

  describe('reset', () => {
    const parser: Parser<number> = some(creation(1,
      ({ context }) => {
        context.position += 1;
        return new List([new Data(context.resources?.clock ?? NaN)]);
      }));

    it('root', () => {
      const base: Context = { resources: { clock: 3, recursions: [1] } };
      const ctx: Context = {};
      assert.deepStrictEqual([...unwrap(reset(base, parser)(input('123', ctx))!)], [3, 2, 1]);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === undefined);
      assert.throws(() => reset(base, parser)(input('1234', ctx)));
      assert(ctx.resources?.clock === undefined);
    });

    it('node', () => {
      const base: Context = { resources: { clock: 3, recursions: [1] } };
      const ctx: Context = { resources: { clock: 2, recursions: [1] } };
      assert.deepStrictEqual([...unwrap(reset(base, parser)(input('1', ctx))!)], [2]);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === 1);
      assert.throws(() => reset(base, parser)(input('12', ctx)));
      assert(ctx.resources?.clock === 0);
    });

  });

  describe('context', () => {
    const parser: Parser<boolean, Context & Ctx> = some(creation(1,
      ({ context }) => {
        context.position += 1;
        return new List([new Data(context.status!)]);
      }));

    it('', () => {
      const base: Context = { status: true };
      const ctx: Context = { resources: { clock: 2, recursions: [1] } };
      assert.deepStrictEqual([...unwrap(context(base, parser)(input('1', ctx))!)], [true]);
      assert(base.resources?.clock === undefined);
      assert(ctx.resources?.clock === 1);
      assert(ctx.status === undefined);
      assert.throws(() => context(base, parser)(input('12', ctx)));
      assert(ctx.resources?.clock === 0);
      assert(ctx.status === true);
    });

  });

});
