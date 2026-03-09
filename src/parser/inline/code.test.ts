import { code } from './code';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/code', () => {
  describe('code', () => {
    const parser = some(code);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('`', new Context())), [['`'], '']);
      assert.deepStrictEqual(inspect(parser, input('``', new Context())), [['``'], '']);
      assert.deepStrictEqual(inspect(parser, input('``a`', new Context())), [['<code class="invalid">``a`</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`a``', new Context())), [ [ '<code class="invalid">`a``</code>' ], '' ]);
      assert.deepStrictEqual(inspect(parser, input('`\n`', new Context())), [['`'], '\n`']);
      assert.deepStrictEqual(inspect(parser, input('`a\nb`', new Context())), [['<code class="invalid">`a</code>'], '\nb`']);
      assert.deepStrictEqual(inspect(parser, input('`a\\\nb`', new Context())), [['<code class="invalid">`a\\</code>'], '\nb`']);
      assert.deepStrictEqual(inspect(parser, input(' ` `', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('` `', new Context())), [['<code data-src="` `"> </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`  `', new Context())), [['<code data-src="`  `">  </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`   `', new Context())), [['<code data-src="`   `">   </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`a`', new Context())), [['<code data-src="`a`">a</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`ab`', new Context())), [['<code data-src="`ab`">ab</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`a`b', new Context())), [['<code data-src="`a`">a</code>'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('`a`b`', new Context())), [['<code data-src="`a`">a</code>'], 'b`']);
      assert.deepStrictEqual(inspect(parser, input('`a`\n', new Context())), [['<code data-src="`a`">a</code>'], '\n']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser, input('`\\`', new Context())), [['<code data-src="`\\`">\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`\\\\`', new Context())), [['<code data-src="`\\\\`">\\\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`&nbsp;`', new Context())), [['<code data-src="`&amp;nbsp;`">&amp;nbsp;</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('` `` `', new Context())), [['<code data-src="` `` `">``</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`` ` ``', new Context())), [['<code data-src="`` ` ``">`</code>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('`<wbr>`', new Context())), [['<code data-src="`&lt;wbr&gt;`">&lt;wbr&gt;</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`*u*`', new Context())), [['<code data-src="`*u*`">*u*</code>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser, input('`a `', new Context())), [['<code data-src="`a `">a </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('` a`', new Context())), [['<code data-src="` a`"> a</code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('` a `', new Context())), [['<code data-src="` a `"> a </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`  a  `', new Context())), [['<code data-src="`  a  `">  a  </code>'], '']);
      assert.deepStrictEqual(inspect(parser, input('`\ta\t`', new Context())), [['<code data-src="`\ta\t`">\ta\t</code>'], '']);
    });

  });

});
