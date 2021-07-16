import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = (source: string) => some(placeholder)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[ab]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\]')), [['[^', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^ a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\ a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^\na]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^\\\na]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^<# a #>]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^<# a #>b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^ !http://host]')), undefined);
      assert.deepStrictEqual(inspect(parser('[^a')), undefined);
      assert.deepStrictEqual(inspect(parser('[^a  ]')), [['[^', 'a', '  ', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\ \\ ]')), [['[^', 'a', ' ', ' ', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\n\n]')), [['[^', 'a', '<br>', '<br>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\n\\\n]')), [['[^', 'a', '<span class="linebreak"> </span>', '<span class="linebreak"> </span>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr><wbr>]')), [['[^', 'a', '<wbr>', '<wbr>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<# b #><# b #>]')), [['[^', 'a', '<sup class="comment" title="b"></sup>', '<sup class="comment" title="b"></sup>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ ]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a]]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [^a]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[^a]')), [['<span class="invalid">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a b]')), [['<span class="invalid">a b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\nb]')), [['<span class="invalid">a<br>b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\nb]')), [['<span class="invalid">a<span class="linebreak"> </span>b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr>c]')), [['<span class="invalid">a<wbr>c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<# b #>c]')), [['<span class="invalid">a<sup class="comment" title="b"></sup>c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^\\]]')), [['<span class="invalid">]</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^(])]')), [['<span class="invalid"><span class="paren">(])</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^!http://host]')), [['<span class="invalid"><a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a ]')), [['<span class="invalid">a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\ ]')), [['<span class="invalid">a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\n]')), [['<span class="invalid">a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a\\\n]')), [['<span class="invalid">a<span class="linebreak"> </span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<wbr>]')), [['<span class="invalid">a<wbr></span>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a<# b #>]')), [['<span class="invalid">a<sup class="comment" title="b"></sup></span>'], '']);
    });

  });

});
