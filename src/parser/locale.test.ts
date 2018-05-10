import { block } from './block';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/locale', () => {
  describe('locale', () => {
    const parser = some(block);

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('。\n0')), [['<p>。<span class="linebreak"><wbr></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*。*\n0')), [['<p><em>。</em><span class="linebreak"><wbr></span>0</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>。<rt>a</rt></ruby>\n0')), [['<p><ruby>。<rt>a</rt></ruby><span class="linebreak"><wbr></span>0</p>'], '']);
    });

    it('ja', () => {
      assert.deepStrictEqual(inspect(parser('。\n0')), [['<p>。<span class="linebreak"><wbr></span>0</p>'], '']);
    });

  });

});
