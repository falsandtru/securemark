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
      assert.deepStrictEqual(inspect(parser('[#[#')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a b#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# ')), [['[', '#', ' '], '']);
      assert.deepStrictEqual(inspect(parser('[# \n a')), [['[', '#', '<br>', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[##]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# #] #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# [#')), [['[', '#', ' ', '[', '#'], '']);
      assert.deepStrictEqual(inspect(parser('[# [# ')), [['[', '#', ' ', '[', '#', ' '], '']);
      assert.deepStrictEqual(inspect(parser('[# [# a')), [['[', '#', ' ', '[', '#', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[# [# a #]')), [['[', '#', ' ', '<span class="comment">[# a #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a[#')), [['[', '#', ' ', 'a', '[', '#'], '']);
      assert.deepStrictEqual(inspect(parser('[# a [#')), [['[', '#', ' ', 'a', ' ', '[', '#'], '']);
      assert.deepStrictEqual(inspect(parser('[# a [# ')), [['[', '#', ' ', 'a', ' ', '[', '#', ' '], '']);
      assert.deepStrictEqual(inspect(parser('[# a [# b')), [['[', '#', ' ', 'a', ' ', '[', '#', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[# a [## b')), [['[', '#', ' ', 'a', ' ', '[', '#', '#', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[## a [# b')), [['[', '#', '#', ' ', 'a', ' ', '[', '#', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\ a #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a\\ #]')), [['[', '#', ' ', 'a', ' ', '#', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[# a#]')), [['[', '#', ' ', 'a#', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[# a ##]')), [['[', '#', ' ', 'a', ' ', '##', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[# [## #]')), [['[', '#', ' ', '[', '#', '#', ' ', '#', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[## [# ##]')), [['[', '#', '#', ' ', '[', '#', ' ', '##', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[## a #]')), [['[', '#', '#', ' ', 'a', ' ', '#', ']'], '']);
      assert.deepStrictEqual(inspect(parser(' [# a #]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[#  #]')), [['<span class="comment">[#  #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[#   #]')), [['<span class="comment">[#  #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]')), [['<span class="comment">[# a #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a b #]')), [['<span class="comment">[# a b #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a\nb #]')), [['<span class="comment">[# a<br>b #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #] #]')), [['<span class="comment">[# a #]</span>'], ' #]']);
      assert.deepStrictEqual(inspect(parser('[# ##] #]')), [['<span class="comment">[# ##] #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# [# a #] #]')), [['<span class="comment">[# <span class="comment">[# a #]</span> #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# [## a ##] #]')), [['<span class="comment">[# <span class="comment">[## a ##]</span> #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[## a ##]')), [['<span class="comment">[## a ##]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[## #] ##]')), [['<span class="comment">[## #] ##]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[## [# a #] ##]')), [['<span class="comment">[## <span class="comment">[# a #]</span> ##]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]b')), [['<span class="comment">[# a #]</span>'], 'b']);
      assert.deepStrictEqual(inspect(parser('[#\na\n#]')), [['<span class="comment">[# a #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# &a; #]')), [['<span class="comment">[# <span class="invalid">&amp;a;</span> #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# &copy; #]')), [['<span class="comment">[# © #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# &amp;copy; #]')), [['<span class="comment">[# &amp;copy; #]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[# \\ a #]')), [['<span class="comment">[#  a #]</span>'], '']);
    });

  });

});
