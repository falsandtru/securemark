import { loop } from '../../parser/loop';
import { olist } from './olist';
import { inspect } from '../debug.test';

describe('Unit: syntax/olist', () => {
  describe('olist', () => {
    it('invalid', () => {
      const parser = loop(olist);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('0.0.')), void 0);
      assert.deepStrictEqual(inspect(parser('0.0')), void 0);
      assert.deepStrictEqual(inspect(parser('0.a')), void 0);
      assert.deepStrictEqual(inspect(parser('0.\n*')), void 0);
      assert.deepStrictEqual(inspect(parser('0.\n0')), void 0);
      assert.deepStrictEqual(inspect(parser('0.\n 0.\n0')), void 0);
      assert.deepStrictEqual(inspect(parser(' 0.')), void 0);
    });

    it('single', () => {
      const parser = loop(olist);
      assert.deepStrictEqual(inspect(parser('0.')), [['<ol start="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. ')), [['<ol start="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. -')), [['<ol start="1"><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. -\n')), [['<ol start="1"><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n')), [['<ol start="1"><li></li></ol>'], '']);
    });

    it('multiple', () => {
      const parser = loop(olist);
      assert.deepStrictEqual(inspect(parser('0.\n0.')), [['<ol start="1"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n0. 2')), [['<ol start="1"><li>1</li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n0. 2\n0. 3')), [['<ol start="1"><li>1</li><li>2</li><li>3</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n\n0. 2')), [['<ol start="1"><li>1</li></ol>', '<ol start="1"><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n\n\n0. 2')), [['<ol start="1"><li>1</li></ol>'], '\n0. 2']);
    });

    it('nest', () => {
      const parser = loop(olist);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2')), [['<ol start="1"><li>1<ol start="1"><li>2</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n 0. 3')), [['<ol start="1"><li>1<ol start="1"><li>2</li><li>3</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n0. 3')), [['<ol start="1"><li>1<ol start="1"><li>2</li></ol></li><li>3</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. *1*')), [['<ol start="1"><li><em>1</em></li></ol>'], '']);
    });

    it('index', () => {
      const parser = loop(olist);
      assert.deepStrictEqual(inspect(parser('1.')), [['<ol start="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('99. 0')), [['<ol start="99"><li>0</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 9. 2')), [['<ol start="1"><li>1<ol start="9"><li>2</li></ol></li></ol>'], '']);
    });

  });

});
