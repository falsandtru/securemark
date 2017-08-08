import { loop } from '../../combinator/loop';
import { olist } from './olist';
import { inspect } from '../debug.test';

describe('Unit: parser/block/olist', () => {
  describe('olist', () => {
    const parser = loop(olist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('1a.')), void 0);
      assert.deepStrictEqual(inspect(parser('a1.')), void 0);
      assert.deepStrictEqual(inspect(parser('aZ.')), void 0);
      assert.deepStrictEqual(inspect(parser('Az.')), void 0);
      assert.deepStrictEqual(inspect(parser('1')), void 0);
      assert.deepStrictEqual(inspect(parser('1 ')), void 0);
      assert.deepStrictEqual(inspect(parser('1\n')), void 0);
      assert.deepStrictEqual(inspect(parser('1.1')), void 0);
      assert.deepStrictEqual(inspect(parser('1.1.')), void 0);
      assert.deepStrictEqual(inspect(parser('1.a')), void 0);
      assert.deepStrictEqual(inspect(parser('1.\n 1.')), void 0);
      assert.deepStrictEqual(inspect(parser('1.\n 1. a')), void 0);
      assert.deepStrictEqual(inspect(parser('1. a\n  1. a\n 1. a')), void 0);
      assert.deepStrictEqual(inspect(parser(' 1.')), void 0);
      assert.deepStrictEqual(inspect(parser('1.\n-')), void 0);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('1.')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. ')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('1. -')), [['<ol start="1" type="1"><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. -\n')), [['<ol start="1" type="1"><li>-</li></ol>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('1.\n1')), [['<ol start="1" type="1"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n1.')), [['<ol start="1" type="1"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n1. ')), [['<ol start="1" type="1"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n1.\n')), [['<ol start="1" type="1"><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('1. 1\n1. 2')), [['<ol start="1" type="1"><li>1</li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n1. 2\n1. 3')), [['<ol start="1" type="1"><li>1</li><li>2</li><li>3</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n\n1. 2')), [['<ol start="1" type="1"><li>1</li></ol>', '<ol start="1" type="1"><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n\n\n1. 2')), [['<ol start="1" type="1"><li>1</li></ol>'], '\n1. 2']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('1. 1\n 1')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1.')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1. ')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1.\n')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1. 2')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li>2</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1. 2\n 1. 3')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li>2</li><li>3</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1. 2\n  1. 3')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li>2<ol start="1" type="1"><li>3</li></ol></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 1. 2\n1. 3')), [['<ol start="1" type="1"><li>1<ol start="1" type="1"><li>2</li></ol></li><li>3</li></ol>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser('1.')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('99. 1')), [['<ol start="99" type="1"><li>1</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. 1\n 9. 2')), [['<ol start="1" type="1"><li>1<ol start="9" type="1"><li>2</li></ol></li></ol>'], '']);
    });

    it('alphabet', () => {
      assert.deepStrictEqual(inspect(parser('a.')), [['<ol start="a" type="a"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('A.')), [['<ol start="A" type="A"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('z.')), [['<ol start="z" type="a"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('Z.')), [['<ol start="Z" type="A"><li></li></ol>'], '']);
    });

  });

});
