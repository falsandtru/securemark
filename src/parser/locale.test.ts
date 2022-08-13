import { block } from './block';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/locale', () => {
  describe('locale', () => {
    const parser = (source: string) => some(block)({ source, context: {} });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('。\\\n0')), [['<p>。<span class="linebreak"></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('。 \\\n0')), [['<p>。<span class="linebreak"></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('_。_\\\n0')), [['<p><em>。</em><span class="linebreak"></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('!> 。\\\n0')), [['<blockquote><section><p>。<span class="linebreak"></span>0</p><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('[。](a)\\\n0')), [['<p><ruby>。<rp>(</rp><rt>a</rt><rp>)</rp></ruby><span class="linebreak"></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[。　](a )\\\n0')), [['<p><ruby>。<rp>(</rp><rt>a</rt><rp>)</rp></ruby><span class="linebreak"></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('。<wbr>\\\n0')), [['<p>。<wbr><span class="linebreak"></span>0</p>'], '']);
    });

    it('ja', () => {
      assert.deepStrictEqual(inspect(parser('。\\\n0')), [['<p>。<span class="linebreak"></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('\\。\\\n0')), [['<p>。<span class="linebreak"></span>0</p>'], '']);
    });

  });

});
