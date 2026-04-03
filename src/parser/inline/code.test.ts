import { code } from './code';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/code', () => {
  describe('code', () => {
    const parser = some(code);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('`')), [['`'], '']);
      assert.deepStrictEqual(inspect(parser, input('``')), [['``'], '']);
      assert.deepStrictEqual(inspect(parser, input('``a`')), [['<code class="invalid">``a`</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`a``')), [ [ '<code class="invalid">`a``</code>' ], '' ]);
      assert.deepStrictEqual(inspect(parser, input('`\n`')), [['`'], '\n`']);
      assert.deepStrictEqual(inspect(parser, input('`a\nb`')), [['<code class="invalid">`a</code>'], '\nb`']);
      assert.deepStrictEqual(inspect(parser, input('`a\\\nb`')), [['<code class="invalid">`a\\</code>'], '\nb`']);
      assert.deepStrictEqual(inspect(parser, input(' ` `')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('` `')), [['<code data-src="` `"> </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`  `')), [['<code data-src="`  `">  </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`   `')), [['<code data-src="`   `">   </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`a`')), [['<code data-src="`a`">a</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`ab`')), [['<code data-src="`ab`">ab</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`a`b')), [['<code data-src="`a`">a</code>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('`a`b`')), [['<code data-src="`a`">a</code>'], 'b`']);
      assert.deepStrictEqual(inspect(parser, input('`a`\n')), [['<code data-src="`a`">a</code>'], '\n']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser, input('`\\`')), [['<code data-src="`\\`">\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`\\\\`')), [['<code data-src="`\\\\`">\\\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`&nbsp;`')), [['<code data-src="`&amp;nbsp;`">&amp;nbsp;</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('` `` `')), [['<code data-src="` `` `">``</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`` ` ``')), [['<code data-src="`` ` ``">`</code>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('`<wbr>`')), [['<code data-src="`&lt;wbr&gt;`">&lt;wbr&gt;</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`*u*`')), [['<code data-src="`*u*`">*u*</code>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser, input('`a `')), [['<code data-src="`a `">a </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('` a`')), [['<code data-src="` a`"> a</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('` a `')), [['<code data-src="` a `"> a </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`  a  `')), [['<code data-src="`  a  `">  a  </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`\ta\t`')), [['<code data-src="`\ta\t`">\ta\t</code>'], '']);
    });

  });

});
