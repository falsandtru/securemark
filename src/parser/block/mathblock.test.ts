import { mathblock } from './mathblock';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/mathblock', () => {
  describe('mathblock', () => {
    const parser = (source: string) => some(mathblock)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$\na'), ctx), [['<pre class="invalid" translate="no">$$\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na$$'), ctx), [['<pre class="invalid" translate="no">$$\na$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$b'), ctx), [['<pre class="invalid" translate="no">$$\na\n$$b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\nb'), ctx), [['<pre class="invalid" translate="no">$$\na\n$$\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n\n\n$$$'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$ $$\n$$'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('$$lang\n$$'), ctx), [['<pre class="invalid" translate="no">$$lang\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$ param\n$$'), ctx), [['<pre class="invalid" translate="no">$$ param\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n$$'), ctx), [['<pre class="invalid" translate="no">$$\n$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$'), ctx), [['<pre class="invalid" translate="no">$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n$$'), ctx), [['<pre class="invalid" translate="no">$$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('$$$\n$$$'), ctx), [['<pre class="invalid" translate="no">$$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(' $$\n$$'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(`$$\n0${'\n'.repeat(301)}$$`), ctx, '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('$$\n$$'), ctx), [['<div class="math" translate="no">$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\n$$'), ctx), [['<div class="math" translate="no">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$'), ctx), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\n$$\n'), ctx), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\na\nb\n$$'), ctx), [['<div class="math" translate="no">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n\\\n$$'), ctx), [['<div class="math" translate="no">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n$$'), ctx), [['<div class="math" translate="no">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$\n\n$$'), ctx), [['<div class="math" translate="no">$$\n$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$\n\n$$'), ctx), [['<div class="math" translate="no">$$\n$$</div>'], '\n$$']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n$$'), ctx), [['<div class="math" translate="no">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser('$$\n$$$\n\n$$'), ctx), [['<div class="math" translate="no">$$\n$$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser(`$$\n0${'\n'.repeat(300)}$$`), ctx, '>'), [['<div class="math" translate="no">'], '']);
    });

  });

});
