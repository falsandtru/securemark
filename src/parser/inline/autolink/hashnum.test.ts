import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashnum', () => {
  describe('hashnum', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1#2')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1#2#3')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1@2')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\ ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('##')), undefined);
      assert.deepStrictEqual(inspect(parser, input('##1')), undefined);
      assert.deepStrictEqual(inspect(parser, input('###1')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{#}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{1}')), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#${'1'.repeat(10)}`)), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#${'1'.repeat(10)}a`)), undefined);
      assert.deepStrictEqual(inspect(parser, input('#　')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' #1')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('#1')), [['<a class="hashnum">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1 ')), [['<a class="hashnum">#1</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser, input('#1\n')), [['<a class="hashnum">#1</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser, input('#1\\')), [['<a class="hashnum">#1</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser, input('#1\\ ')), [['<a class="hashnum">#1</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser, input('#1\\\n')), [['<a class="hashnum">#1</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser, input(`#1'`)), [[`<a class="hashnum">#1</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser, input(`#1''`)), [[`<a class="hashnum">#1</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser, input('#123456789')), [['<a class="hashnum">#123456789</a>'], '']);
    });

  });

});
