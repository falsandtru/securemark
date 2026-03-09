import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = some(placeholder);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ab]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\]', new Context())), [['[^', ']'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^ ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^ a]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\ ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\ a]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\n]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\na]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^\\\na]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^ !http://host]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[^a', new Context())), [['[^', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ ]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [^a]', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('[^a]', new Context())), [['<span class="invalid">[^a]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a b]', new Context())), [['<span class="invalid">[^a b]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a ]', new Context())), [['<span class="invalid">[^a ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a  ]', new Context())), [['<span class="invalid">[^a  ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\ ]', new Context())), [['<span class="invalid">[^a\\ ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\ \\ ]', new Context())), [['<span class="invalid">[^a\\ \\ ]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\n]', new Context())), [['<span class="invalid">[^a\n]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\\n]', new Context())), [['<span class="invalid">[^a\\\n]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\nb]', new Context())), [['<span class="invalid">[^a\nb]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a\\\nb]', new Context())), [['<span class="invalid">[^a\\\nb]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a<wbr>]', new Context())), [['<span class="invalid">[^a&lt;wbr&gt;]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a<wbr><wbr>]', new Context())), [['<span class="invalid">[^a&lt;wbr&gt;&lt;wbr&gt;]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^==]', new Context())), [['<span class="invalid">[^==]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a[% b %]]', new Context())), [['<span class="invalid">[^a[% b %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^a[% b %][% c %]]', new Context())), [['<span class="invalid">[^a[% b %][% c %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^\\]]', new Context())), [['<span class="invalid">[^\\]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^(])]', new Context())), [['<span class="invalid">[^(])]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^!http://host]', new Context())), [['<span class="invalid">[^!http://host]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^[% a %]]', new Context())), [['<span class="invalid">[^[% a %]]</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[^[% a %]b]', new Context())), [['<span class="invalid">[^[% a %]b]</span>'], '']);
    });

  });

});
