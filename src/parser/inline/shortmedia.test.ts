import { shortmedia } from './shortmedia';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/shortmedia', () => {
  describe('shortmedia', () => {
    const parser = some(shortmedia);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!http')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!ttp')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!http://')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!Http://host')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' !http://host')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('!http://host')), [['<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!https://host')), [['<a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a>'], '']);
    });

  });

});
