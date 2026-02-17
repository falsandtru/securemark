import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashnum', () => {
  describe('hashnum', () => {
    const parser = (source: string) => some(autolink)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#'), ctx), [['#'], '']);
      assert.deepStrictEqual(inspect(parser('# '), ctx), [['#'], ' ']);
      assert.deepStrictEqual(inspect(parser('#1#'), ctx), [['#1#'], '']);
      assert.deepStrictEqual(inspect(parser('#1#2'), ctx), [['#1#2'], '']);
      assert.deepStrictEqual(inspect(parser('#1#2#3'), ctx), [['#1#2#3'], '']);
      assert.deepStrictEqual(inspect(parser('#1@2'), ctx), [['#1@2'], '']);
      assert.deepStrictEqual(inspect(parser('#\\'), ctx), [['#'], '\\']);
      assert.deepStrictEqual(inspect(parser('#\\ '), ctx), [['#'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#\\\n'), ctx), [['#'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('##'), ctx), [['##'], '']);
      assert.deepStrictEqual(inspect(parser('##1'), ctx), [['##1'], '']);
      assert.deepStrictEqual(inspect(parser('###1'), ctx), [['###1'], '']);
      assert.deepStrictEqual(inspect(parser('#{}'), ctx), [['#'], '{}']);
      assert.deepStrictEqual(inspect(parser('#{{}'), ctx), [['#'], '{{}']);
      assert.deepStrictEqual(inspect(parser('#{}}'), ctx), [['#'], '{}}']);
      assert.deepStrictEqual(inspect(parser('#{#}'), ctx), [['#'], '{#}']);
      assert.deepStrictEqual(inspect(parser('#{1}'), ctx), [['#'], '{1}']);
      assert.deepStrictEqual(inspect(parser('#　'), ctx), [['#'], '　']);
      assert.deepStrictEqual(inspect(parser('0#1'), ctx), [['0#1'], '']);
      assert.deepStrictEqual(inspect(parser('0#a'), ctx), [['0#a'], '']);
      assert.deepStrictEqual(inspect(parser('0##1'), ctx), [['0##1'], '']);
      assert.deepStrictEqual(inspect(parser('0##a'), ctx), [['0##a'], '']);
      assert.deepStrictEqual(inspect(parser('あ#1'), ctx), [['あ#1'], '']);
      assert.deepStrictEqual(inspect(parser(' #1'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(10)}`), ctx), [[`#${'1'.repeat(10)}`], '']);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(10)}a`), ctx), [[`#${'1'.repeat(10)}a`], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#1'), ctx), [['<a class="hashnum">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1 '), ctx), [['<a class="hashnum">#1</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#1\n'), ctx), [['<a class="hashnum">#1</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#1\\'), ctx), [['<a class="hashnum">#1</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#1\\ '), ctx), [['<a class="hashnum">#1</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#1\\\n'), ctx), [['<a class="hashnum">#1</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser(`#1'`), ctx), [[`<a class="hashnum">#1</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser(`#1''`), ctx), [[`<a class="hashnum">#1</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser('#123456789'), ctx), [['<a class="hashnum">#123456789</a>'], '']);
    });

  });

});
