import { olist } from './olist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/olist', () => {
  describe('olist', () => {
    const parser = some(olist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('##. ')), undefined);
      assert.deepStrictEqual(inspect(parser('#1. ')), undefined);
      assert.deepStrictEqual(inspect(parser('1#. ')), undefined);
      assert.deepStrictEqual(inspect(parser('1a. ')), undefined);
      assert.deepStrictEqual(inspect(parser('a1. ')), undefined);
      assert.deepStrictEqual(inspect(parser('aZ. ')), undefined);
      assert.deepStrictEqual(inspect(parser('Az. ')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), undefined);
      assert.deepStrictEqual(inspect(parser('# ')), undefined);
      assert.deepStrictEqual(inspect(parser('#\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#.')), undefined);
      assert.deepStrictEqual(inspect(parser('#.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1')), undefined);
      assert.deepStrictEqual(inspect(parser('1 ')), undefined);
      assert.deepStrictEqual(inspect(parser('1\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1')), undefined);
      assert.deepStrictEqual(inspect(parser('1.1.')), undefined);
      assert.deepStrictEqual(inspect(parser('1.a')), undefined);
      assert.deepStrictEqual(inspect(parser('1.\n')), undefined);
      assert.deepStrictEqual(inspect(parser('1. a\n  1. a\n 1. a')), undefined);
      assert.deepStrictEqual(inspect(parser('#. !http://host')), [['<ol><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to contain media syntax in lists.</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. !http://host\n#. 0')), [['<ol><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to contain media syntax in lists.</li><li>0</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #. !http://host\n#. 2')), [['<ol><li>1<ol><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to contain media syntax in lists.</li></ol></li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser(' #.')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('#. ')), [['<ol><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('#. \\')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. \\\n')), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. -')), [['<ol><li>-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. -\n')), [['<ol><li>-</li></ol>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('#.\n#')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#.\n#.')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#.\n#. ')), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#.\n#.\n')), [['<ol><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('#. 1\n#. 2')), [['<ol><li>1</li><li>2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n#. 2\n#. 3')), [['<ol><li>1</li><li>2</li><li>3</li></ol>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('#.\n #')), [['<ol><li><br><ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #.')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #. ')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #.\n')), [['<ol><li>1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #. 2')), [['<ol><li>1<ol><li>2</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #. 2\n #. 3')), [['<ol><li>1<ol><li>2</li><li>3</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #. 2\n  #. 3')), [['<ol><li>1<ol><li>2<ol><li>3</li></ol></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('#. 1\n #. 2\n#. 3')), [['<ol><li>1<ol><li>2</li></ol></li><li>3</li></ol>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser('1. ')), [['<ol start="1" type="1"><li value="1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('99. 1')), [['<ol start="99" type="1"><li value="99">1</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('1.\n#.\n9')), [['<ol start="1" type="1"><li value="1"></li><li></li><li value="9"></li></ol>'], '']);
    });

    it('alphabet', () => {
      assert.deepStrictEqual(inspect(parser('a. ')), [['<ol start="a" type="a"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('A. ')), [['<ol start="A" type="A"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('z. ')), [['<ol start="z" type="a"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('Z. ')), [['<ol start="Z" type="A"><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser('a.\n#.\nc')), [['<ol start="a" type="a"><li></li><li></li><li></li></ol>'], '']);
    });

  });

});
