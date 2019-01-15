import { ulist } from './ulist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ulist', () => {
  describe('ulist', () => {
    const parser = some(ulist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('--')), undefined);
      assert.deepStrictEqual(inspect(parser('-0')), undefined);
      assert.deepStrictEqual(inspect(parser('-a')), undefined);
      assert.deepStrictEqual(inspect(parser('-[]')), undefined);
      assert.deepStrictEqual(inspect(parser('-[ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('-[x]')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n+')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n0')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n -\n 0')), undefined);
      assert.deepStrictEqual(inspect(parser('- 0\n  - 0\n - 0')), undefined);
      assert.deepStrictEqual(inspect(parser('- !http://host')), [['<ul><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to contain media syntax in lists.</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- !http://host\n- 0')), [['<ul><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to contain media syntax in lists.</li><li>0</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - !http://host\n- 2')), [['<ul><li>1<ul><li class="invalid" data-invalid-syntax="listitem" data-invalid-type="content">Invalid syntax: ListItem: Unable to contain media syntax in lists.</li></ul></li><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser(' -')), undefined);
      assert.deepStrictEqual(inspect(parser('+')), undefined);
      assert.deepStrictEqual(inspect(parser('*')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('-')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- ')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('-\n')), [['<ul><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('- \\')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- \\\n')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -')), [['<ul><li>-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -\n')), [['<ul><li>-</li></ul>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('-\n-')), [['<ul><li></li><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('- 1\n- 2')), [['<ul><li>1</li><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2\n- 3')), [['<ul><li>1</li><li>2</li><li>3</li></ul>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('-\n -')), [['<ul><li><br><ul><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2')), [['<ul><li>1<ul><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n - 3')), [['<ul><li>1<ul><li>2</li><li>3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n  - 3')), [['<ul><li>1<ul><li>2<ul><li>3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n- 3')), [['<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n + 2')), [['<ul><li>1<ul class="invalid" data-invalid-syntax="list" data-invalid-type="syntax"><li>Invalid syntax: UList: Use <code data-src="`-`">-</code> instead.</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 1')), [['<ul><li>1<ol start="1" type="1"><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 1.')), [['<ul><li>1<ol start="1" type="1"><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 1. ')), [['<ul><li>1<ol start="1" type="1"><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 1. 2')), [['<ul><li>1<ol start="1" type="1"><li>2</li></ol></li></ul>'], '']);
    });

  });

});
