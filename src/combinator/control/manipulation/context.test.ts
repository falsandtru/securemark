import { Parser, Ctx } from '../../data/parser';
import { some } from '../../data/parser/some';
import { reset, context } from './context';
import { creator } from './resource';

describe('Unit: combinator/context', () => {
  interface Context extends Ctx {
    state?: boolean;
  }

  describe('reset', () => {
    const parser: Parser<number> = some(creator(
      (s, context) => [[context.resources?.budget ?? NaN], s.slice(1)]));

    it('root', () => {
      const base: Context = { resources: { budget: 3, recursion: 1 } };
      const ctx: Context = {};
      assert.deepStrictEqual(reset(base, parser)('123', ctx), [[3, 2, 1], '']);
      assert(base.resources?.budget === 3);
      assert(ctx.resources?.budget === undefined);
      assert.throws(() => reset(base, parser)('1234', ctx));
      assert(ctx.resources?.budget === undefined);
      assert.deepStrictEqual(reset(base, parser)('123', ctx), [[3, 2, 1], '']);
    });

    it('node', () => {
      const base: Context = { resources: { budget: 3, recursion: 1 } };
      const ctx: Context = { resources: { budget: 1, recursion: 1 } };
      assert.deepStrictEqual(reset(base, parser)('1', ctx), [[1], '']);
      assert(base.resources?.budget === 3);
      assert(ctx.resources?.budget === 0);
      assert.throws(() => reset(base, parser)('1', ctx));
      assert(ctx.resources?.budget === 0);
    });

  });

  describe('context', () => {
    const parser: Parser<boolean, Context> = some(creator(
      (s, context) => [[context.state!], s.slice(1)]));

    it('', () => {
      const base: Context = { state: true };
      const ctx: Context = { resources: { budget: 3, recursion: 1 } };
      assert.deepStrictEqual(context(base, parser)('123', ctx), [[true, true, true], '']);
      assert(ctx.resources?.budget === 0);
      assert(ctx.state === undefined);
      assert.throws(() => reset(base, parser)('1', ctx));
      assert(ctx.resources?.budget === 0);
      assert(ctx.state === undefined);
    });

  });

});
