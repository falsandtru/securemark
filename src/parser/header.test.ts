import { header } from './header';
import { input } from '../combinator/data/parser';
import { Context } from './context';
import { inspect } from '../debug.test';

describe('Unit: parser/header', () => {
  describe('header', () => {
    const parser = header;

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n---', new Context())), [['<pre class="invalid" translate="no">---\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n', new Context())), [['<pre class="invalid" translate="no">---\na: b\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---c', new Context())), [['<pre class="invalid" translate="no">---\na: b\n---c</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---\nc', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n\n---', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n \n---', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('---\n-\n---', new Context())), [['<pre class="invalid" translate="no">---\n-\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n----', new Context())), [['<pre class="invalid" translate="no">---\na: b\n----</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('----\na: b\n---', new Context())), [['<pre class="invalid" translate="no">----\na: b\n---</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`---\n${'a: b\n'.repeat(101)}---`, new Context())), [[`<pre class="invalid" translate="no">---\n${'a: b\n'.repeat(101)}---</pre>`], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---', new Context())), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\n---\n', new Context())), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\na: b\nC: D e\n---\n', new Context())), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div><div class="field" data-name="c" data-value="D e"><span class="field-name">C</span>: <span class="field-value">D e</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('---\r\na: b\r\nC: D e\r\n---\r\n', new Context())), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div><div class="field" data-name="c" data-value="D e"><span class="field-name">C</span>: <span class="field-value">D e</span></div></details></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('----\na: b\n----', new Context())), [['<aside class="header"><details open=""><summary>Header</summary><div class="field" data-name="a" data-value="b"><span class="field-name">a</span>: <span class="field-value">b</span></div></details></aside>'], '']);
    });

  });

});
