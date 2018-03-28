import { olist } from './olist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/olist', () => {
  describe('olist', () => {
    const parser = some(olist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1a.')), undefined);
      assert.deepStrictEqual(inspect(parser('a1.')), undefined);
      assert.deepStrictEqual(inspect(parser('aZ.')), undefined);
      assert.deepStrictEqual(inspect(parser('Az.')), undefined);
      assert.deepStrictEqual(inspect(parser('1')), undefined);
      assert.deepStrictEqual(inspect(parser('1 ')), undefined);
      assert.deepStrictEqual(inspect(parser('1\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1.\n 1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.\n 1. a')), undefined);
      assert.deepStrictEqual(inspect(parser('1. a\n  1. a\n 1. a')), undefined);
      assert.deepStrictEqual(inspect(parser(' 1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.\n-')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('1.')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. ')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('1. \\')), [['<ol start="1" type="1"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1. \\\n')), [['<ol start="1" type="1"><li></li></ol>'], '']);
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
