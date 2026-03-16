import { Parser, List, Node, Context, input } from '../parser';
import { some } from './some';
import { reset, context, creation } from './context';
import { unwrap } from '../../../parser/util';

describe('Unit: combinator/data/parser/context', () => {
  interface Ctx extends Context {
    status?: boolean;
  }
  type Opts = Partial<Ctx>;

  describe('reset', () => {
    const parser: Parser<number> = some(creation(1,
      context => {
        context.position += 1;
        return new List([new Node(context.resources?.clock ?? NaN)]);
      }));

    it('root', () => {
      const base: Opts = { resources: { clock: 3, recursions: [1] } };
      const ctx: Ctx = new Context();
      assert.deepStrictEqual([...unwrap(reset(base, parser)(input('123', ctx))!)], [3, 2, 1]);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === 0);
      assert.throws(() => reset(base, parser)(input('1234', ctx)));
      assert(ctx.resources?.clock === 0);
    });

    it('node', () => {
      const base: Opts = { resources: { clock: 3, recursions: [1] } };
      const ctx: Ctx = new Context({ resources: { clock: 2, recursions: [1] } });
      assert.deepStrictEqual([...unwrap(reset(base, parser)(input('1', ctx))!)], [2]);
      assert(base.resources?.clock === 3);
      assert(ctx.resources?.clock === 1);
      assert.throws(() => reset(base, parser)(input('12', ctx)));
      assert(ctx.resources?.clock === 0);
    });

  });

  describe('context', () => {
    const parser: Parser<boolean, Ctx & Ctx> = some(creation(1,
      context => {
        context.position += 1;
        return new List([new Node(context.status!)]);
      }));

    it('', () => {
      const base: Opts = { status: true };
      const ctx: Ctx = new Context({ resources: { clock: 2, recursions: [1] } });
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
