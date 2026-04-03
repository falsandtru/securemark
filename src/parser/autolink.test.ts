import { autolink } from './autolink';
import { input } from './context';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink', () => {
  describe('autolink', () => {
    const parser = autolink;

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('http://host)')), [['<a class="url" href="http://host)" target="_blank">http://host)</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('http://host\\')), [['<a class="url" href="http://host\\" target="_blank">http://host\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!http://host)')), [['!', '<a class="url" href="http://host)" target="_blank">http://host)</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!http://host\\')), [['!', '<a class="url" href="http://host\\" target="_blank">http://host\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a#b')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\n')), [['\\', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a#b')), [['a', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('0a#b')), [['0a', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('あ#b')), [['あ', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('あい#b')), [['あい', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('0aあ#b')), [['0a', 'あ', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('0aあい#b')), [['0a', 'あい', '#b'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\n#b')), [['a', '\\', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0a>>b')), [['0a', '>', '>b'], '']);
    });

  });

});
