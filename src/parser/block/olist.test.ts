import { olist } from './olist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/olist', () => {
  describe('olist', () => {
    const parser = some(olist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1a. ')), undefined);
      assert.deepStrictEqual(inspect(parser('a1. ')), undefined);
      assert.deepStrictEqual(inspect(parser('aZ. ')), undefined);
      assert.deepStrictEqual(inspect(parser('Az. ')), undefined);
      assert.deepStrictEqual(inspect(parser('0')), undefined);
      assert.deepStrictEqual(inspect(parser('0 ')), undefined);
      assert.deepStrictEqual(inspect(parser('0\n')), undefined);
      assert.deepStrictEqual(inspect(parser('0.')), undefined);
      assert.deepStrictEqual(inspect(parser('0.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1')), undefined);
      assert.deepStrictEqual(inspect(parser('1 ')), undefined);
      assert.deepStrictEqual(inspect(parser('1\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1.\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1. a\n  1. a\n 1. a')), undefined);
      assert.deepStrictEqual(inspect(parser('0. !http://host')), [['<ol><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to use media syntax in lists.</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. !http://host\n0. 0')), [['<ol><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to use media syntax in lists.</li><li>0</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. !http://host\n0. 2')), [['<ol><li>1<ol><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to use media syntax in lists.</li></ol></li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser(' 0.')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('0. ')), [['<ol><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('0. \\')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. \\\n')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. -')), [['<ol><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. -\n')), [['<ol><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('00. ')), [['<ol><li></li></ol>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('0.\n0')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n0.')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n0. ')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0.\n0.\n')), [['<ol><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('0. 1\n0. 2')), [['<ol><li>1</li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n0. 2\n0. 3')), [['<ol><li>1</li><li>2</li><li>3</li></ol>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('0.\n 0')), [['<ol><li><br><ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0.')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. ')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0.\n')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2')), [['<ol><li>1<ol><li>2</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n 0. 3')), [['<ol><li>1<ol><li>2</li><li>3</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n  0. 3')), [['<ol><li>1<ol><li>2<ol><li>3</li></ol></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('0. 1\n 0. 2\n0. 3')), [['<ol><li>1<ol><li>2</li></ol></li><li>3</li></ol>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser('1. ')), [['<ol type="1" start="1"><li value="1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('99. 1')), [['<ol type="1" start="99"><li value="99">1</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('01. ')), [['<ol type="1" start="1"><li value="1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n0.\n9')), [['<ol type="1" start="1"><li value="1"></li><li></li><li value="9"></li></ol>'], '']);
    });

    it('alphabet', () => {
      assert.deepStrictEqual(inspect(parser('a. ')), [['<ol type="a"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('A. ')), [['<ol type="A"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('z. ')), [['<ol type="a"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('Z. ')), [['<ol type="A"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('a.\n0.\nc')), [['<ol type="a"><li></li><li></li><li></li></ol>'], '']);
    });

  });

});
