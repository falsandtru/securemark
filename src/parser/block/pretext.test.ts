import { pretext} from './pretext';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/pretext', () => {
  describe('pretext', () => {
    const parser = some(pretext);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```')), undefined);
      assert.deepStrictEqual(inspect(parser('```\n')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na```')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na\n```b')), undefined);
      assert.deepStrictEqual(inspect(parser('```\na\n```\nb')), undefined);
      assert.deepStrictEqual(inspect(parser(' ```\n```')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('```\n```')), [['<pre></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```')), [['<pre></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```')), [['<pre>a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\nb\n```')), [['<pre>a\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\\\n```')), [['<pre>\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n\n```')), [['<pre>\n</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n`\n```')), [['<pre>`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````\n```')), [['<pre>````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n````')), [['<pre>```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```\n')), [['<pre></pre>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('```abc\na\n```')), [['<pre class="language-abc" data-lang="abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```abc \na\n```')), [['<pre class="language-abc" data-lang="abc">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b\n```')), [['<pre data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b c \n```')), [['<pre data-file="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b.c\n```')), [['<pre data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```  b.c \n```')), [['<pre data-file="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```"0A ~/.\\ b\n```')), [['<pre class="language-&quot;0a" data-lang="&quot;0A" data-file="~/.\\ b"></pre>'], '']);
    });

  });

});
