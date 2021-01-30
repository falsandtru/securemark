import { mathblock } from './mathblock';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/mathblock', () => {
  describe('mathblock', () => {
    const parser = (source: string) => some(mathblock)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('$$')), [['<pre class="math notranslate invalid">$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n')), [['<pre class="math notranslate invalid">$$\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na')), [['<pre class="math notranslate invalid">$$\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na$$')), [['<pre class="math notranslate invalid">$$\na$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$b')), [['<pre class="math notranslate invalid">$$\na\n$$b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\nb')), [['<pre class="math notranslate invalid">$$\na\n$$\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$ $$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$latex\n$$')), [['<pre class="math notranslate invalid">$$latex\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser('$$$\n$$$')), undefined);
      assert.deepStrictEqual(inspect(parser(' $$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser(`$$\n${'\n'.repeat(101)}$$`), '>'), [['<pre class="math notranslate invalid">'], '']);
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
      assert.deepStrictEqual(inspect(parser('$$\n$$\n$$')), [['<div class="math notranslate">$$\n$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n\n$$')), [['<div class="math notranslate">$$\n$$</div>'], '\n$$']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n$$')), [['<div class="math notranslate">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n\n$$')), [['<div class="math notranslate">$$\n$$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n$$')), [['<div class="math notranslate">$$\n$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser(`$$\n${'\n'.repeat(100)}$$`), '>'), [['<div class="math notranslate">'], '']);
    });

  });

});
