import { loop } from '../../combinator/loop';
import { code } from './code';
import { inspect } from '../debug.test';

describe('Unit: parser/code', () => {
  describe('code', () => {
    const parser = loop(code);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('`')), void 0);
      assert.deepStrictEqual(inspect(parser('``')), void 0);
      assert.deepStrictEqual(inspect(parser('` `')), void 0);
      assert.deepStrictEqual(inspect(parser('` `` `')), void 0);
      assert.deepStrictEqual(inspect(parser('`\n`')), void 0);
      assert.deepStrictEqual(inspect(parser('`a\nb`')), void 0);
      assert.deepStrictEqual(inspect(parser('a`b`')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('`a`')), [['<code>a</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`ab`')), [['<code>ab</code>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('`\\`')), [['<code>\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`\\\\`')), [['<code>\\\\</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`&nbsp;`')), [['<code>&amp;nbsp;</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`` ` ``')), [['<code>`</code>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('`<wbr>`')), [['<code>&lt;wbr&gt;</code>'], '']);
      assert.deepStrictEqual(inspect(parser('`*u*`')), [['<code>*u*</code>'], '']);
    });

    it('trim', () => {
      assert.deepStrictEqual(inspect(parser('` a b `')), [['<code>a b</code>'], '']);
    });

  });

});
