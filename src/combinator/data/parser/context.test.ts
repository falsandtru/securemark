import { Parser, Ctx, CtxOptions, input } from '../parser';
import { some } from './some';
import { reset, context } from './context';
import { creation } from './context';

describe('Unit: combinator/data/parser/context', () => {
  interface Context extends CtxOptions {
    status?: boolean;
  }

  describe('reset', () => {
    const parser: Parser<number> = some(creation(1,
      ({ context }) => {
        context.position += 1;
        return [[context.resources?.clock ?? NaN]];
      }));

    it('root', () => {
      const base: Context = { resources: { clock: 3, recursions: [1] } };
      const ctx: Context = {};
      assert.deepStrictEqual(reset(base, parser)(input('123', ctx)), [[3, 2, 1]]);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === undefined);
      assert.throws(() => reset(base, parser)(input('1234', ctx)));
      assert(ctx.resources?.clock === 0);
    });

    it('node', () => {
      const base: Context = { resources: { clock: 3, recursions: [1] } };
      const ctx: Context = { resources: { clock: 1, recursions: [1] } };
      assert.deepStrictEqual(reset(base, parser)(input('1', ctx)), [[1]]);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === 0);
      assert.throws(() => reset(base, parser)(input('1', ctx)));
      assert(ctx.resources?.clock === 0);
    });

  });

  describe('context', () => {
    const parser: Parser<boolean, Context & Ctx> = some(creation(1,
      ({ context }) => {
        context.position += 1;
        return [[context.status!]];
      }));

    it('', () => {
      const base: Context = { status: true };
      const ctx: Context = { resources: { clock: 3, recursions: [1] } };
      assert.deepStrictEqual(context(base, parser)(input('123', ctx)), [[true, true, true]]);
      assert(ctx.resources?.clock === 0);
      assert(ctx.status === undefined);
      assert.throws(() => reset(base, parser)(input('1', ctx)));
      assert(ctx.resources?.clock === 0);
      assert(ctx.status === true);
    });

  });

});
