import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/anchor', () => {
  describe('anchor', () => {
    const parser = (source: string) => some(autolink)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>-0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>01#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>01@'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>https://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('a>>0'), ctx), [['a'], '>>0']);
      assert.deepStrictEqual(inspect(parser(' >>0'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0'), ctx), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a'), ctx), [['<a class="anchor" href="?at=a">&gt;&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>A'), ctx), [['<a class="anchor" href="?at=A">&gt;&gt;A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-'), ctx), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('>>0-a'), ctx), [['<a class="anchor" href="?at=0-a">&gt;&gt;0-a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-A'), ctx), [['<a class="anchor" href="?at=0-A">&gt;&gt;0-A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0--a'), ctx), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '--a']);
      assert.deepStrictEqual(inspect(parser('>>2000-0131-2359-59999'), ctx), [['<a class="anchor" href="?at=2000-0131-2359-59999">&gt;&gt;2000-0131-2359-59999</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>A/2000-0131-2359-59'), ctx), [['<a class="anchor" href="/@A/timeline?at=2000-0131-2359-59">&gt;&gt;A/2000-0131-2359-59</a>'], '']);
    });

  });

});
