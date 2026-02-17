import { codeblock } from './codeblock';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/codeblock', () => {
  describe('codeblock', () => {
    const parser = (source: string) => some(codeblock)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('```'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('```\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('```\na'), ctx), [['<pre class="invalid" translate="no">```\na</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na```'), ctx), [['<pre class="invalid" translate="no">```\na```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```b'), ctx), [['<pre class="invalid" translate="no">```\na\n```b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```\nb'), ctx), [['<pre class="invalid" translate="no">```\na\n```\nb</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n\n```'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('```a ```\n```'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('```\n```\n```'), ctx), [['<pre class="invalid" translate="no">```\n```\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````'), ctx), [['<pre class="invalid" translate="no">```\n````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```'), ctx), [['<pre class="invalid" translate="no">````\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(' ```\n```'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(`\`\`\`\n0${'\n'.repeat(301)}\`\`\``), ctx, '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('```\n```'), ctx), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```'), ctx), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\n```'), ctx), [['<pre class="text">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\na\nb\n```'), ctx), [['<pre class="text">a<br>b</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\\\n```'), ctx), [['<pre class="text">\\</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n`\n```'), ctx), [['<pre class="text">`</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n```\n\n```'), ctx), [['<pre class="text"></pre>'], '\n```']);
      assert.deepStrictEqual(inspect(parser('```\n````\n```'), ctx), [['<pre class="text">````</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n````\n\n```'), ctx), [['<pre class="text">````<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n````'), ctx), [['<pre class="text">```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('````\n```\n\n````'), ctx), [['<pre class="text">```<br></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n\n```\n'), ctx), [['<pre class="text"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\nhttp://host\n```'), ctx), [['<pre class="text"><a class="url" href="http://host" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\nhttp://host)\n```'), ctx), [['<pre class="text"><a class="url" href="http://host)" target="_blank">http://host)</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n!http://host\n```'), ctx), [['<pre class="text">!<a class="url" href="http://host" target="_blank">http://host</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n!http://host)\n```'), ctx), [['<pre class="text">!<a class="url" href="http://host)" target="_blank">http://host)</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n#a\n```'), ctx), [['<pre class="text"><a class="hashtag" href="/hashtags/a">#a</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```\n@a#b\n```'), ctx), [['<pre class="text"><a class="channel" href="/@a?ch=b">@a#b</a></pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`\`\`\`\n0${'\n'.repeat(300)}\`\`\``), ctx, '>'), [['<pre class="text">'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('```0\n```'), ctx), [['<pre class="code language-0" translate="no" data-lang="0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a\n```'), ctx), [['<pre class="code language-a" translate="no" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```A\n```'), ctx), [['<pre class="code language-a" translate="no" data-lang="a"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b\n```'), ctx), [['<pre class="code language-a-b" translate="no" data-lang="a-b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a-b0\n```'), ctx), [['<pre class="code language-a-b0" translate="no" data-lang="a-b0"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a--b\n```'), ctx), [['<pre class="text" data-path="a--b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b\n```'), ctx), [['<pre class="text" data-path="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b c\n```'), ctx), [['<pre class="invalid" translate="no">``` b c\n```</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b\\ c\n```'), ctx), [['<pre class="text" data-path="b\\ c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` b.c\n```'), ctx), [['<pre class="code language-c" translate="no" data-lang="c" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` .b\n```'), ctx), [['<pre class="text" data-path=".b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```  b \n```'), ctx), [['<pre class="text" data-path="b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` ~/.b\n```'), ctx), [['<pre class="text" data-path="~/.b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` ~/b.c\n```'), ctx), [['<pre class="code language-c" translate="no" data-lang="c" data-path="~/b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```.b\n```'), ctx), [['<pre class="text" data-path=".b"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```b.c\n```'), ctx), [['<pre class="code language-c" translate="no" data-lang="c" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a b.c\n```'), ctx), [['<pre class="code language-a" translate="no" data-lang="a" data-path="b.c"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('```a 1\n```'), ctx), [['<pre class="code language-a" translate="no" data-lang="a" data-line="1"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` 1\n```'), ctx), [['<pre class="text" data-line="1"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` 1,2-3\n```'), ctx), [['<pre class="text" data-line="1,2-3"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('``` 1 b.c\n```'), ctx), [['<pre class="code language-c" translate="no" data-lang="c" data-line="1" data-path="b.c"></pre>'], '']);
    });

  });

});
