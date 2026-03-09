import { shortmedia } from './shortmedia';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/shortmedia', () => {
  describe('shortmedia', () => {
    const parser = some(shortmedia);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!http', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!ttp', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!http://', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!Http://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' !http://host', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('!http://host', new Context())), [['<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!https://host', new Context())), [['<a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a>'], '']);
    });

  });

});
