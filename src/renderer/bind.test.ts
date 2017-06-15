import { bind } from './bind';

describe('Unit: viewer/bind', () => {
  describe('bind', () => {
    function inspect(es: HTMLElement[]) {
      return es.map(e => e.outerHTML);
    }

    it('target', () => {
      assert(bind(document.createElement('div')));
      assert(bind(document.createDocumentFragment()));
    });

    it('empty', () => {
      const el = document.createElement('div');
      bind(el);
      assert(el.innerHTML === '');
    });

    it('update', () => {
      const el = document.createElement('div');
      const update = bind(el);
      // init
      assert.deepStrictEqual(inspect(update('0')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>0</p>');
      // clear
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
      // change from empty
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      // change top segments
      assert.deepStrictEqual(inspect(update('9\n\n5\n\n9\n\n')), ['<p>9</p>', '<p>5</p>']);
      assert(el.innerHTML === '<p>9</p><p>5</p><p>9</p>');
      // change bottom segments
      assert.deepStrictEqual(inspect(update('9\n\n0\n\n1\n\n')), ['<p>0</p>', '<p>1</p>']);
      assert(el.innerHTML === '<p>9</p><p>0</p><p>1</p>');
      // change middle segments
      assert.deepStrictEqual(inspect(update('9\n\n5\n\n1\n\n')), ['<p>5</p>']);
      assert(el.innerHTML === '<p>9</p><p>5</p><p>1</p>');
      // change segments at the both ends 
      assert.deepStrictEqual(inspect(update('1\n\n5\n\n9\n\n')), ['<p>1</p>', '<p>5</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>5</p><p>9</p>');
      // insert
      assert.deepStrictEqual(inspect(update('1\n\n2\n\n3\n\n9\n\n')), ['<p>2</p>', '<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>3</p><p>9</p>');
      // remove
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      // repeat a top segment
      assert.deepStrictEqual(inspect(update('1\n\n1\n\n0\n\n9\n\n')), ['<p>1</p>']);
      assert(el.innerHTML === '<p>1</p><p>1</p><p>0</p><p>9</p>');
      // repeat a bottom segment
      assert.deepStrictEqual(inspect(update('1\n\n1\n\n0\n\n9\n\n9\n\n')), ['<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>1</p><p>0</p><p>9</p><p>9</p>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
      // repeat
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(2))), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><p>1</p><p>0</p><p>9</p>');
      // unrepeat
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p>');
    });

  });

});
