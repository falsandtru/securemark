import { loop } from '../../combinator';
import { pretext} from './pretext';
import { inspect } from '../debug.test';

describe('Unit: parser/block/pretext', () => {
  describe('pretext', () => {
    const parser = loop(pretext);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```')), undefined);
      assert.deepStrictEqual(inspect(parser('```\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```\n```')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na```')), undefined);
      assert.deepStrictEqual(inspect(parser('``` a\n```')), undefined);
      assert.deepStrictEqual(inspect(parser(' ```\n```')), undefined);
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

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('```abc\na\n```')), [['<pre class="language-abc" data-lang="abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```abc \na\n```')), [['<pre class="language-abc" data-lang="abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a b.c\n\n```')), [['<pre class="language-a" data-lang="a" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a  b.c  \n\n```')), [['<pre class="language-a" data-lang="a" data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a b c\n\n```')), [['<pre class="language-a" data-lang="a" data-file="b"></pre>'], '']);
    });

  });

});
