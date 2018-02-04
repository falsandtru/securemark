import { reference } from './reference';
import { loop } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/paragraph/reference', () => {
  describe('reference', () => {
    const parser = loop(reference);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('> ')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>0')), [['<span class="reference">&gt;0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a')), [['<span class="reference">&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>A')), [['<span class="reference">&gt;A</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a ')), [['<span class="reference">&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<span class="reference">&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\')), [['<span class="reference">&gt;\\</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\ ')), [['<span class="reference">&gt;\\</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>\\\n')), [['<span class="reference">&gt;\\</span>'], '']);
    });

  });

});
