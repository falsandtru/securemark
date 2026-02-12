import { shortmedia } from './shortmedia';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/shortmedia', () => {
  describe('shortmedia', () => {
    const parser = (source: string) => some(shortmedia)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('!http')), undefined);
      assert.deepStrictEqual(inspect(parser('!ttp')), undefined);
      assert.deepStrictEqual(inspect(parser('!http://')), undefined);
      assert.deepStrictEqual(inspect(parser('!Http://host')), undefined);
      assert.deepStrictEqual(inspect(parser(' !http://host')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('!http://host')), [['<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!https://host')), [['<a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a>'], '']);
    });

  });

});
