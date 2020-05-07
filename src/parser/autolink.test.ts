import { autolink } from './autolink';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink', () => {
  describe('autolink', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host')), [['!', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [['\\', '<br>'], '']);
    });

  });

});
