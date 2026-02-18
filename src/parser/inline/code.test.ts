import { code } from './code';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/code', () => {
  describe('code', () => {
    const parser = (source: string) => some(code)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('`'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('``'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('``a`'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('`a``'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('`\n`'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('`a\nb`'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('`a\\\nb`'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' ` `'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('` `'), ctx), [['<code data-src="` `"> </code>'], '']);
      assert.deepStrictEqual(inspect(parser('`  `'), ctx), [['<code data-src="`  `">  </code>'], '']);
      assert.deepStrictEqual(inspect(parser('`   `'), ctx), [['<code data-src="`   `">   </code>'], '']);
      assert.deepStrictEqual(inspect(parser('`a`'), ctx), [['<code data-src="`a`">a</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`ab`'), ctx), [['<code data-src="`ab`">ab</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`a`b'), ctx), [['<code data-src="`a`">a</code>'], 'b']);
      assert.deepStrictEqual(inspect(parser('`a`b`'), ctx), [['<code data-src="`a`">a</code>'], 'b`']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('`\\`'), ctx), [['<code data-src="`\\`">\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`\\\\`'), ctx), [['<code data-src="`\\\\`">\\\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`&nbsp;`'), ctx), [['<code data-src="`&amp;nbsp;`">&amp;nbsp;</code>'], '']);
      assert.deepStrictEqual(inspect(parser('` `` `'), ctx), [['<code data-src="` `` `">``</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`` ` ``'), ctx), [['<code data-src="`` ` ``">`</code>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('`<wbr>`'), ctx), [['<code data-src="`&lt;wbr&gt;`">&lt;wbr&gt;</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`*u*`'), ctx), [['<code data-src="`*u*`">*u*</code>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser('`a `'), ctx), [['<code data-src="`a `">a </code>'], '']);
      assert.deepStrictEqual(inspect(parser('` a`'), ctx), [['<code data-src="` a`"> a</code>'], '']);
      assert.deepStrictEqual(inspect(parser('` a `'), ctx), [['<code data-src="` a `"> a </code>'], '']);
      assert.deepStrictEqual(inspect(parser('`  a  `'), ctx), [['<code data-src="`  a  `">  a  </code>'], '']);
      assert.deepStrictEqual(inspect(parser('`\ta\t`'), ctx), [['<code data-src="`\ta\t`">\ta\t</code>'], '']);
    });

  });

});
