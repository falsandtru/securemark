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
      assert.deepStrictEqual(inspect(parser('[#a#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a b#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ a #]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a##]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a ##]')), undefined);
      assert.deepStrictEqual(inspect(parser('[## a #]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [# a #]')), undefined);
      assert.deepStrictEqual(inspect(parser(`[#\na${' '.repeat(100000 - 6)}\n#`)), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[# a #]')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a b #]')), [['<sup class="comment" title="a b"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a\nb #]')), [['<sup class="comment" title="a\nb"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a\\ #]')), [['<sup class="comment" title="a\\"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #] #]')), [['<sup class="comment" title="a"></sup>'], ' #]']);
      assert.deepStrictEqual(inspect(parser('[# [# #]')), [['<sup class="comment" title="[#"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[## a ##]')), [['<sup class="comment" title="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[## #] ##]')), [['<sup class="comment" title="#]"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]b')), [['<sup class="comment" title="a"></sup>'], 'b']);
      assert.deepStrictEqual(inspect(parser('[#\na\n#]')), [['<sup class="comment" title="a"></sup>'], '']);
      assert(parser(`[# ${'a'.repeat(100 - 6)} #]`));
      assert(parser(`[# ${'a'.repeat(100000 - 6)} #]`));
      assert(parser(`[# ${'a\n'.repeat(100)} #]`));
      assert(!parser(`[# ${'a\n'.repeat(101)} #]`));
      assert(!parser(`[# ${'a\n'.repeat(100000 / 2 - 6 / 2)} #]`));
    });

  });

});
