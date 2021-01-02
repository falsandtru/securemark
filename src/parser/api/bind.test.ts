import { ParserSettings, Progress } from '../../..';
import { bind } from './bind';
import { frag, html } from 'typed-dom';
import { Sequence } from 'spica/sequence';

describe('Unit: parser/api/bind', () => {
  describe('bind', () => {
    function inspect(iter: Iterable<Progress>) {
      return [...iter].flatMap(s => 'value' in s && s.value instanceof HTMLElement && s.value.parentNode ? [s.value.outerHTML] : []);
    }
    function inspectS(iter: IterableIterator<Progress>, count: number) {
      return Sequence.from(iter)
        .bind(result => {
          switch (result.type) {
            case 'segment':
              return Sequence.from([]);
            case 'block':
              return Sequence.from([result.value.outerHTML]);
            case 'break':
              return Sequence.from([null]);
            default:
              return Sequence.from([undefined]);
          }
        })
        .take(count)
        .extract();
    }

    const cfgs: ParserSettings = { footnotes: { annotation: html('ol'), reference: html('ol') } };

    it('empty', () => {
      const el = html('div');
      const update = bind(el, cfgs).parse;

      // init with empty
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
      // update with no changes
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '');
    });

    it('update', () => {
      const el = html('div', [html('ol')]);
      const update = bind(el, cfgs).parse;

      // init with nonempty
      assert.deepStrictEqual(inspect(update('0')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>0</p><ol></ol>');
      // update with no changes
      assert.deepStrictEqual(inspect(update('0')), []);
      assert(el.innerHTML === '<p>0</p><ol></ol>');
      // clear
      assert.deepStrictEqual(inspect(update('')), []);
      assert(el.innerHTML === '<ol></ol>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
      // change top segments
      assert.deepStrictEqual(inspect(update('9\n\n5\n\n9\n\n')), ['<p>9</p>', '<p>5</p>']);
      assert(el.innerHTML === '<p>9</p><p>5</p><p>9</p><ol></ol>');
      // change bottom segments
      assert.deepStrictEqual(inspect(update('9\n\n0\n\n1\n\n')), ['<p>0</p>', '<p>1</p>']);
      assert(el.innerHTML === '<p>9</p><p>0</p><p>1</p><ol></ol>');
      // change middle segments
      assert.deepStrictEqual(inspect(update('9\n\n5\n\n1\n\n')), ['<p>5</p>']);
      assert(el.innerHTML === '<p>9</p><p>5</p><p>1</p><ol></ol>');
      // change segments at the both ends
      assert.deepStrictEqual(inspect(update('1\n\n5\n\n9\n\n')), ['<p>1</p>', '<p>5</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>5</p><p>9</p><ol></ol>');
      // insert
      assert.deepStrictEqual(inspect(update('1\n\n2\n\n3\n\n9\n\n')), ['<p>2</p>', '<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>3</p><p>9</p><ol></ol>');
      // remove
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n')), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
      // repeat the top segment
      assert.deepStrictEqual(inspect(update('1\n\n1\n\n0\n\n9\n\n')), ['<p>1</p>']);
      assert(el.innerHTML === '<p>1</p><p>1</p><p>0</p><p>9</p><ol></ol>');
      // repeat the bottom segment
      assert.deepStrictEqual(inspect(update('1\n\n1\n\n0\n\n9\n\n9\n\n')), ['<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>1</p><p>0</p><p>9</p><p>9</p><ol></ol>');

      // format
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), ['<p>0</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
      // repeat
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(2))), ['<p>1</p>', '<p>0</p>', '<p>9</p>']);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><p>1</p><p>0</p><p>9</p><ol></ol>');
      // unrepeat
      assert.deepStrictEqual(inspect(update('1\n\n0\n\n9\n\n'.repeat(1))), []);
      assert(el.innerHTML === '<p>1</p><p>0</p><p>9</p><ol></ol>');
    });

    it('complex', () => {
      assert.deepStrictEqual(inspect(bind(html('div'), cfgs).parse('# a\n# b')), ['<h1 id="index:a">a</h1>', '<h1 id="index:b">b</h1>']);
    });

    it('normalize', () => {
      assert.deepStrictEqual(inspect(bind(html('div'), cfgs).parse('a\\\r\nb')), ['<p>a<span class="linebreak"> </span>b</p>']);
    });

    it('reentrant', () => {
      const el = html('div');
      const update = bind(el, cfgs).parse;

      const iter = update('0\n\n1\n');
      assert.deepStrictEqual(inspectS(iter, 1), ['<p>0</p>']);
      assert.deepStrictEqual(inspect(update('0\n\n1\n\n2')), ['<p>1</p>', '<p>2</p>']);
      assert(el.innerHTML === '<p>0</p><p>1</p><p>2</p>');
      assert.deepStrictEqual(inspect(update('3\n')), ['<p>3</p>']);
      assert(el.innerHTML === '<p>3</p>');
      assert.deepStrictEqual(inspectS(iter, 1), [undefined]);
      assert.deepStrictEqual(inspectS(iter, 1), []);
      assert(el.innerHTML === '<p>3</p>');
      assert.deepStrictEqual(inspect(update('3\n\n4')), ['<p>4</p>']);
      assert(el.innerHTML === '<p>3</p><p>4</p>');
    });

    it('concurrency', () => {
      const el = html('div');
      const update = bind(el, cfgs).parse;

      assert.deepStrictEqual(inspectS(update('1\n'), 1), ['<p>1</p>']);
      assert(el.innerHTML === '<p>1</p>');
      assert.deepStrictEqual(inspectS(update('1\n\n3\n\n4'), 1), ['<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>3</p>');
      assert.deepStrictEqual(inspectS(update('1\n\n2\n\n4'), 4), ['<p>2</p>', '<p>4</p>', '<p>3</p>']);
      assert(el.innerHTML === '<p>1</p><p>2</p><p>4</p>');
      [...update('')];
      assert(el.innerHTML === '');
      assert.deepStrictEqual(inspectS(update('# a\n# b'), 1), ['<h1 id="index:a">a</h1>']);
      assert(el.innerHTML === '<h1 id="index:a">a</h1>');
      assert.deepStrictEqual(inspectS(update('# a\n# b'), 2), ['<h1 id="index:b">b</h1>', null]);
      assert(el.innerHTML === '<h1 id="index:a">a</h1><h1 id="index:b">b</h1>');
    });

    it('chunk', () => {
      const el = html('div');
      const chunk = frag();
      const update = bind(chunk, { ...cfgs, chunk: true }).parse;
      const iter = update([...Array(3)].map((_, i) => `((${i + 1}))`).join('\n\n'));

      inspectS(iter, 2);
      el.appendChild(chunk);
      assert.deepStrictEqual(
        [...el.children].map(el => el.outerHTML),
        [
          html('p', [html('sup', { class: "annotation" }, '1'),]).outerHTML,
          html('p', [html('sup', { class: "annotation" }, '2'),]).outerHTML,
        ]);
      inspectS(iter, 1);
      el.appendChild(chunk);
      assert.deepStrictEqual(
        [...el.children].map(el => el.outerHTML),
        [
          html('p', [html('sup', { class: "annotation" }, '1'),]).outerHTML,
          html('p', [html('sup', { class: "annotation" }, '2'),]).outerHTML,
          html('p', [html('sup', { class: "annotation" }, '3'),]).outerHTML,
        ]);
      inspect(iter);
      assert.deepStrictEqual(
        [...el.children].map(el => el.outerHTML),
        [
          html('p', [
            html('sup', { class: "annotation", id: "annotation:ref:1", title: "1" }, [
              html('a', { href: "#annotation:def:1", rel: "noopener" }, '*1')
            ]),
          ]).outerHTML,
          html('p', [
            html('sup', { class: "annotation", id: "annotation:ref:2", title: "2" }, [
              html('a', { href: "#annotation:def:2", rel: "noopener" }, '*2')
            ]),
          ]).outerHTML,
          html('p', [
            html('sup', { class: "annotation", id: "annotation:ref:3", title: "3" }, [
              html('a', { href: "#annotation:def:3", rel: "noopener" }, '*3')
            ]),
          ]).outerHTML,
        ]);
      assert.deepStrictEqual(
        cfgs.footnotes.annotation.outerHTML,
        html('ol', [
          html('li', { id: 'annotation:def:1' }, [
            '1',
            html('sup', [html('a', { href: '#annotation:ref:1', rel: 'noopener' }, '~1')])
          ]),
          html('li', { id: 'annotation:def:2' }, [
            '2',
            html('sup', [html('a', { href: '#annotation:ref:2', rel: 'noopener' }, '~2')])
          ]),
          html('li', { id: 'annotation:def:3' }, [
            '3',
            html('sup', [html('a', { href: '#annotation:ref:3', rel: 'noopener' }, '~3')])
          ]),
        ]).outerHTML);
    });

  });

});
