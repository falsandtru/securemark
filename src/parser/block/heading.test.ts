import { loop } from '../../combinator/loop';
import { heading } from './heading';
import { inspect } from '../debug.test';

describe('Unit: parser/heading', () => {
  describe('heaheading', () => {
    const parser = loop(heading);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('#')), void 0);
      assert.deepStrictEqual(inspect(parser('# ')), void 0);
      assert.deepStrictEqual(inspect(parser('#\n')), void 0);
      assert.deepStrictEqual(inspect(parser('#a\n')), void 0);
      assert.deepStrictEqual(inspect(parser('#a \n')), void 0);
      assert.deepStrictEqual(inspect(parser('#a\n#')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1>a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1>a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \n')), [['<h1>a </h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n#')), [['<h1>a</h1>'], '#']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6>a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n# b')), [['<h1>a</h1>', '<h1>b</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n\n# b')), [['<h1>a</h1>'], '\n# b']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('# *<u>`<a>`</u>*')), [['<h1><em><u><code>&lt;a&gt;</code></u></em></h1>'], '']);
    });

  });

});
