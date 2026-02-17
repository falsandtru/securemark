import { shortmedia } from './shortmedia';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/shortmedia', () => {
  describe('shortmedia', () => {
    const parser = (source: string) => some(shortmedia)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!http'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!ttp'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!http://'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!Http://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' !http://host'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('!http://host'), ctx), [['<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!https://host'), ctx), [['<a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a>'], '']);
    });

  });

});
