import { mathblock } from './mathblock';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/mathblock', () => {
  describe('mathblock', () => {
    const parser = some(mathblock);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$b')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser(' $$\na\n$$')), undefined);
      assert(!parser('$$\n' + '\n'.repeat(101) + '$$'));
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('$$\n$$')), [['<div class="math notranslate">$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\n$$')), [['<div class="math notranslate">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$')), [['<div class="math notranslate">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\n')), [['<div class="math notranslate">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\nb\n$$')), [['<div class="math notranslate">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\\\n$$')), [['<div class="math notranslate">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n$$')), [['<div class="math notranslate">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n\n$$')), [['<div class="math notranslate">$$\n$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n\n$$')), [['<div class="math notranslate">$$\n$$</div>'], '\n$$']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n$$')), [['<div class="math notranslate">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n\n$$')), [['<div class="math notranslate">$$\n$$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$latex\n$$')), [['<div class="math notranslate invalid" data-invalid-syntax="math" data-invalid-type="parameter">$$\n$$</div>'], '']);
      assert(parser('$$\n' + '\n'.repeat(100) + '$$'));
    });

  });

});
