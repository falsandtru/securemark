import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashref', () => {
  describe('hashref', () => {
    const parser = (source: string) => some(autolink)(source, {}, {});

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
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashref" rel="noopener">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1 ')), [['<a class="hashref" rel="noopener">#1</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#1\n')), [['<a class="hashref" rel="noopener">#1</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#1\\')), [['<a class="hashref" rel="noopener">#1</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#1\\ ')), [['<a class="hashref" rel="noopener">#1</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#1\\\n')), [['<a class="hashref" rel="noopener">#1</a>'], '\\\n']);
    });

  });

});
