import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/anchor', () => {
  describe('anchor', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>-0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>01#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>01@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>0-1:2', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>https://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>tel:1234567890', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a>>0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' >>0', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('>>0', new Context())), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>a', new Context())), [['<a class="anchor" href="?at=a">&gt;&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>A', new Context())), [['<a class="anchor" href="?at=A">&gt;&gt;A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0-', new Context())), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input('>>0-a', new Context())), [['<a class="anchor" href="?at=0-a">&gt;&gt;0-a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0-A', new Context())), [['<a class="anchor" href="?at=0-A">&gt;&gt;0-A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>0--a', new Context())), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '--a']);
      assert.deepStrictEqual(inspect(parser, input('>>2000-0131-2359-59999', new Context())), [['<a class="anchor" href="?at=2000-0131-2359-59999">&gt;&gt;2000-0131-2359-59999</a>'], '']);
    });

  });

});
