import { Parser, Ctx } from '../parser';
import { some } from './some';
import { reset, context } from './context';
import { creation } from './context';

describe('Unit: combinator/data/parser/context', () => {
  interface Context extends Ctx {
    status?: boolean;
  }

  describe('reset', () => {
    const parser: Parser<number> = some(creation(
      (s, context) => [[context.resources?.clock ?? NaN], s.slice(1)]));

    it('root', () => {
      const base: Context = { resources: { clock: 3, recursion: 1 } };
      const ctx: Context = {};
      assert.deepStrictEqual(reset(base, parser)('123', ctx), [[3, 2, 1], '']);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === undefined);
      assert.throws(() => reset(base, parser)('1234', ctx));
      assert(ctx.resources?.clock === undefined);
      assert.deepStrictEqual(reset(base, parser)('123', ctx), [[3, 2, 1], '']);
    });

    it('node', () => {
      const base: Context = { resources: { clock: 3, recursion: 1 } };
      const ctx: Context = { resources: { clock: 1, recursion: 1 } };
      assert.deepStrictEqual(reset(base, parser)('1', ctx), [[1], '']);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === 0);
      assert.throws(() => reset(base, parser)('1', ctx));
      assert(ctx.resources?.clock === 0);
    });

  });

  describe('context', () => {
    const parser: Parser<boolean, Context> = some(creation(
      (s, context) => [[context.status!], s.slice(1)]));

    it('', () => {
      const base: Context = { status: true };
      const ctx: Context = { resources: { clock: 3, recursion: 1 } };
      assert.deepStrictEqual(context(base, parser)('123', ctx), [[true, true, true], '']);
      assert(ctx.resources?.clock === 0);
      assert(ctx.status === undefined);
      assert.throws(() => reset(base, parser)('1', ctx));
      assert(ctx.resources?.clock === 0);
      assert(ctx.status === undefined);
    });

  });

});
