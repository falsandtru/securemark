import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashnum', () => {
  describe('hashnum', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), [['#'], '']);
      assert.deepStrictEqual(inspect(parser('# ')), [['#'], ' ']);
      assert.deepStrictEqual(inspect(parser('#1#')), [['#1#'], '']);
      assert.deepStrictEqual(inspect(parser('#1#2')), [['#1#2'], '']);
      assert.deepStrictEqual(inspect(parser('#1#2#3')), [['#1#2#3'], '']);
      assert.deepStrictEqual(inspect(parser('#1@2')), [['#1@2'], '']);
      assert.deepStrictEqual(inspect(parser('#\\')), [['#'], '\\']);
      assert.deepStrictEqual(inspect(parser('#\\ ')), [['#'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#\\\n')), [['#'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('##')), [['##'], '']);
      assert.deepStrictEqual(inspect(parser('##1')), [['##1'], '']);
      assert.deepStrictEqual(inspect(parser('###1')), [['###1'], '']);
      assert.deepStrictEqual(inspect(parser('#{}')), [['#'], '{}']);
      assert.deepStrictEqual(inspect(parser('#{{}')), [['#'], '{{}']);
      assert.deepStrictEqual(inspect(parser('#{}}')), [['#'], '{}}']);
      assert.deepStrictEqual(inspect(parser('#{#}')), [['#'], '{#}']);
      assert.deepStrictEqual(inspect(parser('#{1}')), [['#'], '{1}']);
      assert.deepStrictEqual(inspect(parser('#　')), [['#'], '　']);
      assert.deepStrictEqual(inspect(parser('0#1')), [['0#1'], '']);
      assert.deepStrictEqual(inspect(parser('0#a')), [['0#a'], '']);
      assert.deepStrictEqual(inspect(parser('0##1')), [['0##1'], '']);
      assert.deepStrictEqual(inspect(parser('0##a')), [['0##a'], '']);
      assert.deepStrictEqual(inspect(parser('あ#1')), [['あ#1'], '']);
      assert.deepStrictEqual(inspect(parser(' #1')), undefined);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(10)}`)), [[`#${'1'.repeat(10)}`], '']);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(10)}a`)), [[`#${'1'.repeat(10)}a`], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashnum">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1 ')), [['<a class="hashnum">#1</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#1\n')), [['<a class="hashnum">#1</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#1\\')), [['<a class="hashnum">#1</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#1\\ ')), [['<a class="hashnum">#1</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#1\\\n')), [['<a class="hashnum">#1</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser(`#1'`)), [[`<a class="hashnum">#1</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser(`#1''`)), [[`<a class="hashnum">#1</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser('#123456789')), [['<a class="hashnum">#123456789</a>'], '']);
    });

  });

});
