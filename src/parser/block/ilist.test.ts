import { ilist } from './ilist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = some(ilist);

    it('single', () => {
      assert.deepStrictEqual(inspect(parser('-')), [['<ul class="invalid" data-invalid-syntax="list" data-invalid-type="syntax"><li>Invalid syntax: UList: Use <code data-src="`-`">-</code> instead.</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('+')), [['<ul class="invalid" data-invalid-syntax="list" data-invalid-type="syntax"><li>Invalid syntax: UList: Use <code data-src="`-`">-</code> instead.</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('*')), [['<ul class="invalid" data-invalid-syntax="list" data-invalid-type="syntax"><li>Invalid syntax: UList: Use <code data-src="`-`">-</code> instead.</li></ul>'], '']);
    });

  });

});
