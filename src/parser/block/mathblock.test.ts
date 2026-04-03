import { mathblock } from './mathblock';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/mathblock', () => {
  describe('mathblock', () => {
    const parser = some(mathblock);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$\na')), [['<pre class="invalid" translate="no">$$\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na$$')), [['<pre class="invalid" translate="no">$$\na$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$b')), [['<pre class="invalid" translate="no">$$\na\n$$b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$\nb')), [['<pre class="invalid" translate="no">$$\na\n$$\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$$\n\n\n$$$')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$ $$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$lang\n$$')), [['<pre class="invalid" translate="no">$$lang\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$ param\n$$')), [['<pre class="invalid" translate="no">$$ param\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$\n$$')), [['<pre class="invalid" translate="no">$$\n$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$$')), [['<pre class="invalid" translate="no">$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$$\n$$')), [['<pre class="invalid" translate="no">$$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$$\n$$$')), [['<pre class="invalid" translate="no">$$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' $$\n$$')), undefined);
      assert.deepStrictEqual(inspect(parser, input(`$$\n0${'\n'.repeat(301)}$$`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('$$\n$$')), [['<div class="math" translate="no">$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n\n$$')), [['<div class="math" translate="no">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$')), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$\n')), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\nb\n$$')), [['<div class="math" translate="no">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n\\\n$$')), [['<div class="math" translate="no">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$\n$$')), [['<div class="math" translate="no">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$\n\n$$')), [['<div class="math" translate="no">$$\n$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$\n\n$$')), [['<div class="math" translate="no">$$\n$$</div>'], '\n$$']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$$\n$$')), [['<div class="math" translate="no">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$$\n\n$$')), [['<div class="math" translate="no">$$\n$$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`$$\n0${'\n'.repeat(300)}$$`), '>'), [['<div class="math" translate="no">'], '']);
    });

  });

});
