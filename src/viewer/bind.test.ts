import { bind } from './bind';

describe('Unit: viewer/bind', () => {
  describe('bind', () => {
    function inspect(es: HTMLElement[]) {
      return es.map(e => e.outerHTML);
    }

    it('empty', () => {
      const el = document.createElement('div');
      bind(el);
      assert(el.innerHTML === '');
    });

    it('update', () => {
      const el = document.createElement('div');
      const update = bind(el, '0');
      assert(el.innerHTML === '<p>0</p>');
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
      assert.deepStrictEqual(inspect(update('1\n\n2\n\n9')), ['<p>1</p>', '<p>2</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('1\n\n2\n\n3\n\n9')), ['<p>2</p>', '<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>3</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('9\n\n0\n\n1')), ['<p>9</p>', '<p>0</p>', '<p>1</p>']);
      assert(el.innerHTML === '<p>9</p><p>0</p><p>1</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n1')), ['<p>1</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>1</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), ['<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(2))), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><p>1</p><p>0</p><p>9</p>');
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
    });

  });

});
