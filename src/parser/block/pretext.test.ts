import { loop } from '../../combinator/loop';
import { pretext} from './pretext';
import { inspect } from '../debug.test';

describe('Unit: parser/pretext', () => {
  describe('pretext', () => {
    const parser = loop(pretext);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('```')), void 0);
      assert.deepStrictEqual(inspect(parser('```\n')), void 0);
      assert.deepStrictEqual(inspect(parser('```\n```')), void 0);
      assert.deepStrictEqual(inspect(parser('```\na```')), void 0);
      assert.deepStrictEqual(inspect(parser('``` a\n```')), void 0);
      assert.deepStrictEqual(inspect(parser(' ```\n```')), void 0);
    });

    it('ab', () => {
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
      assert.deepStrictEqual(inspect(parser('```abc\na\n```')), [['<pre class="lang-abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b:c \n\n```')), [['<pre class="lang-a"></pre>'], '']);
    });

  });

});
