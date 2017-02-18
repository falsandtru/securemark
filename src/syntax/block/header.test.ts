import { loop } from '../../parser/loop';
import { header } from './header';
import { inspect } from '../debug.test';

describe('Unit: syntax/header', () => {
  describe('header', () => {
    it('invalid', () => {
      const parser = loop(header);
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
      const parser = loop(header);
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1>a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1>a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \n')), [['<h1>a </h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n#')), [['<h1>a</h1>'], '#']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6>a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n# b')), [['<h1>a</h1>', '<h1>b</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n\n# b')), [['<h1>a</h1>'], '\n# b']);
    });

    it('nest', () => {
      const parser = loop(header);
      assert.deepStrictEqual(inspect(parser('# *<u>`<a>`</u>*')), [['<h1><em><u><code>&lt;a&gt;</code></u></em></h1>'], '']);
    });

  });

});
