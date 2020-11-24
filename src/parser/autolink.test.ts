import { autolink } from './autolink';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink', () => {
  describe('autolink', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host')), [['!', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [['\\', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('0a#b')), [['0a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('あい#b')), [['あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあ#b')), [['0a', 'あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあい#b')), [['0a', 'あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '\\', '<br>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
    });

  });

});
