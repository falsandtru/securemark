import { shortmedia } from './shortmedia';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/shortmedia', () => {
  describe('shortmedia', () => {
    const parser = some(shortmedia);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('!http')), undefined);
      assert.deepStrictEqual(inspect(parser('!ttp')), undefined);
      assert.deepStrictEqual(inspect(parser('!http://')), undefined);
      assert.deepStrictEqual(inspect(parser('!Http://host')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('!http://host')), [['<a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!https://host')), [['<a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!ttps://host')), [['<a href="https://host" rel="noopener nofollow noreferrer" target="_blank"><img class="media" data-src="https://host" alt=""></a>'], '']);
    });

  });

});
