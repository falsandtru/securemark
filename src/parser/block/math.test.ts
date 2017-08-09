import { loop } from '../../combinator/loop';
import { math} from './math';
import { inspect } from '../debug.test';

describe('Unit: parser/block/math', () => {
  describe('math', () => {
    const parser = loop(math);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('$$')), void 0);
      assert.deepStrictEqual(inspect(parser('$$\n')), void 0);
      assert.deepStrictEqual(inspect(parser('$$\n$$')), void 0);
      assert.deepStrictEqual(inspect(parser('$$\na$$')), void 0);
      assert.deepStrictEqual(inspect(parser('$$ a\n$$')), void 0);
      assert.deepStrictEqual(inspect(parser(' $$\n$$')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('$$\n\n$$')), [['<div class="math">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$')), [['<div class="math">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\nb\n$$')), [['<div class="math">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\\\n$$')), [['<div class="math">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\n\n$$')), [['<div class="math">$$\n\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n$$')), [['<div class="math">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n$$')), [['<div class="math">$$\n$$$\n$$</div>'], '']);
    });

  });

});
