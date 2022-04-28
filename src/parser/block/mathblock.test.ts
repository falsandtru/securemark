import { mathblock } from './mathblock';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/mathblock', () => {
  describe('mathblock', () => {
    const parser = (source: string) => some(mathblock)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na')), [['<pre class="invalid" translate="no">$$\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na$$')), [['<pre class="invalid" translate="no">$$\na$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$b')), [['<pre class="invalid" translate="no">$$\na\n$$b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\nb')), [['<pre class="invalid" translate="no">$$\na\n$$\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n\n\n$$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$ $$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$lang\n$$')), [['<pre class="invalid" translate="no">$$lang\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$ param\n$$')), [['<pre class="invalid" translate="no">$$ param\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n$$')), [['<pre class="invalid" translate="no">$$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n$$$')), [['<pre class="invalid" translate="no">$$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(' $$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser(`$$\n0${'\n'.repeat(301)}$$`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('$$\n$$')), [['<div class="math" translate="no">$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\n$$')), [['<div class="math" translate="no">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$')), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\n')), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\nb\n$$')), [['<div class="math" translate="no">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\\\n$$')), [['<div class="math" translate="no">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n$$')), [['<div class="math" translate="no">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n\n$$')), [['<div class="math" translate="no">$$\n$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n$$')), [['<div class="math" translate="no">$$\n$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n\n$$')), [['<div class="math" translate="no">$$\n$$</div>'], '\n$$']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n$$')), [['<div class="math" translate="no">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n\n$$')), [['<div class="math" translate="no">$$\n$$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n$$')), [['<div class="math" translate="no">$$\n$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser(`$$\n0${'\n'.repeat(300)}$$`), '>'), [['<div class="math" translate="no">'], '']);
    });

  });

});
