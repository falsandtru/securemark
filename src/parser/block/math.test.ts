import { math } from './math';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/math', () => {
  describe('math', () => {
    const parser = some(math);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$b')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\nb')), undefined);
      assert.deepStrictEqual(inspect(parser(' $$\na\n$$')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('$$\n$$')), [['<div class="math notranslate">$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\n$$')), [['<div class="math notranslate">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$')), [['<div class="math notranslate">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\n')), [['<div class="math notranslate">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\nb\n$$')), [['<div class="math notranslate">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\\\n$$')), [['<div class="math notranslate">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n$$')), [['<div class="math notranslate">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n$$')), [['<div class="math notranslate">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$latex\n$$')), [['<div class="math notranslate invalid" data-invalid-type="attribute">$$\n$$</div>'], '']);
    });

  });

});
