import { mathblock } from './mathblock';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/mathblock', () => {
  describe('mathblock', () => {
    const parser = some(mathblock);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$\na', new Context())), [['<pre class="invalid" translate="no">$$\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na$$', new Context())), [['<pre class="invalid" translate="no">$$\na$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$b', new Context())), [['<pre class="invalid" translate="no">$$\na\n$$b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$\nb', new Context())), [['<pre class="invalid" translate="no">$$\na\n$$\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$$\n\n\n$$$', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$ $$\n$$', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('$$lang\n$$', new Context())), [['<pre class="invalid" translate="no">$$lang\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$ param\n$$', new Context())), [['<pre class="invalid" translate="no">$$ param\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$\n$$', new Context())), [['<pre class="invalid" translate="no">$$\n$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$$', new Context())), [['<pre class="invalid" translate="no">$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$$\n$$', new Context())), [['<pre class="invalid" translate="no">$$$\n$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$$\n$$$', new Context())), [['<pre class="invalid" translate="no">$$$\n$$$</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' $$\n$$', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`$$\n0${'\n'.repeat(301)}$$`, new Context()), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('$$\n$$', new Context())), [['<div class="math" translate="no">$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n\n$$', new Context())), [['<div class="math" translate="no">$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$', new Context())), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\n$$\n', new Context())), [['<div class="math" translate="no">$$\na\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\na\nb\n$$', new Context())), [['<div class="math" translate="no">$$\na\nb\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n\\\n$$', new Context())), [['<div class="math" translate="no">$$\n\\\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$\n$$', new Context())), [['<div class="math" translate="no">$$\n$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$\n\n$$', new Context())), [['<div class="math" translate="no">$$\n$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$\n\n$$', new Context())), [['<div class="math" translate="no">$$\n$$</div>'], '\n$$']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$$\n$$', new Context())), [['<div class="math" translate="no">$$\n$$$\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$$\n$$$\n\n$$', new Context())), [['<div class="math" translate="no">$$\n$$$\n\n$$</div>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`$$\n0${'\n'.repeat(300)}$$`, new Context()), '>'), [['<div class="math" translate="no">'], '']);
    });

  });

});
