import { ilist } from './ilist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = some(ilist);

    it('single', () => {
      assert.deepStrictEqual(inspect(parser('-')), [['<ul class="invalid"><li>Invalid syntax: UList syntax: Use <code data-src="`-`">-</code> instead.</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('+')), [['<ul class="invalid"><li>Invalid syntax: UList syntax: Use <code data-src="`-`">-</code> instead.</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('*')), [['<ul class="invalid"><li>Invalid syntax: UList syntax: Use <code data-src="`-`">-</code> instead.</li></ul>'], '']);
    });

  });

});
