import { loop } from '../../parser/loop';
import { pretext} from './pretext';
import { inspect } from '../debug.test';

describe('Unit: syntax/pretext', () => {
  describe('pretext', () => {
    it('invalid', () => {
      const parser = loop(pretext);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('```')), void 0);
      assert.deepStrictEqual(inspect(parser('```\n')), void 0);
      assert.deepStrictEqual(inspect(parser('```\na```')), void 0);
      assert.deepStrictEqual(inspect(parser(' ```\n```')), void 0);
    });

    it('ab', () => {
      const parser = loop(pretext);
      assert.deepStrictEqual(inspect(parser('```\n\n```')), [['<pre></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```')), [['<pre>a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\nb\n```')), [['<pre>a\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\\\n```')), [['<pre>\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n\n```')), [['<pre>\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n`\n```')), [['<pre>`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````\n```')), [['<pre>````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n````')), [['<pre>```</pre>'], '']);
    });

    it('lang', () => {
      const parser = loop(pretext);
      assert.deepStrictEqual(inspect(parser('```abc\na\n```')), [['<pre class="lang-abc">a</pre>'], '']);
    });

  });

});
