import { comment } from './comment';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/comment', () => {
  describe('comment', () => {
    const parser = some(comment);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<')), undefined);
      assert.deepStrictEqual(inspect(parser('<#')), undefined);
      assert.deepStrictEqual(inspect(parser('<##>')), undefined);
      assert.deepStrictEqual(inspect(parser('<# #>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#  #>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#   #>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#a#>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#a b#>')), undefined);
      assert.deepStrictEqual(inspect(parser('<#\\ a #>')), undefined);
      assert.deepStrictEqual(inspect(parser('<# a ##>')), undefined);
      assert.deepStrictEqual(inspect(parser('<## a #>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<# a #>')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a b #>')), [['<sup class="comment" title="a b"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a\nb #>')), [['<sup class="comment" title="a\nb"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a\\ #>')), [['<sup class="comment" title="a\\"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a #> #>')), [['<sup class="comment" title="a"></sup>'], ' #>']);
      assert.deepStrictEqual(inspect(parser('<# <# #>')), [['<sup class="comment" title="<#"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<## a ##>')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<## #> ##>')), [['<sup class="comment" title="#>"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [['<sup class="comment" title="a"></sup>'], 'b']);
    });

  });

});
