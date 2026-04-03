import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = some(placeholder);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ab]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\]')), [['[^', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^ ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^ a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\ ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\ a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\n]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\na]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\\na]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^ !http://host]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^a')), [['[^', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ ]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [^a]')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('[^a]')), [['<span class="invalid">[^a]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a b]')), [['<span class="invalid">[^a b]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a ]')), [['<span class="invalid">[^a ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a  ]')), [['<span class="invalid">[^a  ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\ ]')), [['<span class="invalid">[^a\\ ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\ \\ ]')), [['<span class="invalid">[^a\\ \\ ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\n]')), [['<span class="invalid">[^a\n]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\\n]')), [['<span class="invalid">[^a\\\n]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\nb]')), [['<span class="invalid">[^a\nb]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\\nb]')), [['<span class="invalid">[^a\\\nb]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a<wbr>]')), [['<span class="invalid">[^a&lt;wbr&gt;]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a<wbr><wbr>]')), [['<span class="invalid">[^a&lt;wbr&gt;&lt;wbr&gt;]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^==]')), [['<span class="invalid">[^==]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a[% b %]]')), [['<span class="invalid">[^a[% b %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a[% b %][% c %]]')), [['<span class="invalid">[^a[% b %][% c %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^\\]]')), [['<span class="invalid">[^\\]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^(])]')), [['<span class="invalid">[^(])]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^!http://host]')), [['<span class="invalid">[^!http://host]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^[% a %]]')), [['<span class="invalid">[^[% a %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^[% a %]b]')), [['<span class="invalid">[^[% a %]b]</span>'], '']);
    });

  });

});
