import { comment } from './comment';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/comment', () => {
  describe('comment', () => {
    const parser = (source: string) => some(comment)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<')), undefined);
      assert.deepStrictEqual(inspect(parser('[#')), undefined);
      assert.deepStrictEqual(inspect(parser('[##]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#  #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#   #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# #] #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#  #]  #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# [#')), undefined);
      assert.deepStrictEqual(inspect(parser('[#[#')), undefined);
      assert.deepStrictEqual(inspect(parser('[# [# ')), undefined);
      assert.deepStrictEqual(inspect(parser('[# [# a')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a[#')), [['<sup class="comment invalid">[# a</sup>'], '[#']);
      assert.deepStrictEqual(inspect(parser('[# a [#')), [['<sup class="comment invalid">[# a </sup>'], '[#']);
      assert.deepStrictEqual(inspect(parser('[# a [# ')), [['<sup class="comment invalid">[# a </sup>'], '[# ']);
      assert.deepStrictEqual(inspect(parser('[# a [#\n')), [['<sup class="comment invalid">[# a </sup>'], '[#\n']);
      assert.deepStrictEqual(inspect(parser('[# a [#b')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a [# b')), [['<sup class="comment invalid">[# a </sup>'], '[# b']);
      assert.deepStrictEqual(inspect(parser('[# a [## b')), undefined);
      assert.deepStrictEqual(inspect(parser('[## a [# b')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a b#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ a #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a##]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a ##]')), undefined);
      assert.deepStrictEqual(inspect(parser('[## a #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# &a; #]')), [['<sup class="comment invalid">[# &amp;a; #]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser(' [# a #]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[# a #]')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a b #]')), [['<sup class="comment" title="a b"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a\nb #]')), [['<sup class="comment" title="a\nb"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a\\ #]')), [['<sup class="comment" title="a\\"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #] #]')), [['<sup class="comment" title="a"></sup>'], ' #]']);
      assert.deepStrictEqual(inspect(parser('[# ##] #]')), [['<sup class="comment" title="##]"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# [## #]')), [['<sup class="comment" title="[##"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# [## a ##] #]')), [['<sup class="comment" title="[## a ##]"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[## a ##]')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[## #] ##]')), [['<sup class="comment" title="#]"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[## [# ##]')), [['<sup class="comment" title="[#"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[## [# a #] ##]')), [['<sup class="comment" title="[# a #]"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]b')), [['<sup class="comment" title="a"></sup>'], 'b']);
      assert.deepStrictEqual(inspect(parser('[#\na\n#]')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# &copy; #]')), [['<sup class="comment" title="©"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# &amp;copy; #]')), [['<sup class="comment" title="&amp;copy;"></sup>'], '']);
    });

  });

});
