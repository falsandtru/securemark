import { annotation, authority } from './footnote';
import { parse } from '../parser';
import { html, text } from 'typed-dom';

describe('Unit: util/footnote', () => {
  describe('annotation', () => {
    it('empty', () => {
      const source = parse('0');
      const target = html('ol');
      assert.deepStrictEqual(
        [...source.children].map(el => el.outerHTML),
        [html('p', '0').outerHTML]);
      annotation(source, target);
      assert.deepStrictEqual(
        target.outerHTML,
        html('ol').outerHTML);
    });

    it('1', () => {
      const source = parse('((a \n b))');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        annotation(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation-ref:1", title: "a  b" }, [
                html('a', { href: "#annotation-def:1", rel: "noopener" }, '*1')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'annotation-def:1' }, [
              text('a'),
              html('span', { class: 'linebreak' }, ' '),
              text(' b'),
              html('sup', [html('a', { href: '#annotation-ref:1', rel: 'noopener' }, '↩')])
            ]),
          ]).outerHTML);
      }
    });

    it('2', () => {
      const source = parse('((1))((12345678901234567890))');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        annotation(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation-ref:1", title: "1" }, [
                html('a', { href: "#annotation-def:1", rel: "noopener" }, '*1')
              ]),
              html('sup', { class: "annotation", id: "annotation-ref:2", title: "12345678901234567890" }, [
                html('a', { href: "#annotation-def:2", rel: "noopener" }, '*2')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'annotation-def:1' }, [
              text('1'),
              html('sup', [html('a', { href: '#annotation-ref:1', rel: 'noopener' }, '↩')])
            ]),
            html('li', { id: 'annotation-def:2' }, [
              text('12345678901234567890'),
              html('sup', [html('a', { href: '#annotation-ref:2', rel: 'noopener' }, '↩')])
            ]),
          ]).outerHTML);
      }
    });

    it('unify', () => {
      const source = parse('((1))((2))((3))((2))((4))');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        annotation(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation-ref:1", title: "1" }, [
                html('a', { href: "#annotation-def:1", rel: "noopener" }, '*1')
              ]),
              html('sup', { class: "annotation", id: "annotation-ref:2", title: "2" }, [
                html('a', { href: "#annotation-def:2", rel: "noopener" }, '*2')
              ]),
              html('sup', { class: "annotation", id: "annotation-ref:3", title: "3" }, [
                html('a', { href: "#annotation-def:3", rel: "noopener" }, '*3')
              ]),
              html('sup', { class: "annotation", id: "annotation-ref:4", title: "2" }, [
                html('a', { href: "#annotation-def:2", rel: "noopener" }, '*2')
              ]),
              html('sup', { class: "annotation", id: "annotation-ref:5", title: "4" }, [
                html('a', { href: "#annotation-def:4", rel: "noopener" }, '*4')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'annotation-def:1' }, [
              text('1'),
              html('sup', [html('a', { href: '#annotation-ref:1', rel: 'noopener' }, '↩')])
            ]),
            html('li', { id: 'annotation-def:2' }, [
              text('2'),
              html('sup', [
                html('a', { href: '#annotation-ref:2', rel: 'noopener' }, '↩'),
                html('a', { href: '#annotation-ref:4', rel: 'noopener' }, '↩'),
              ]),
            ]),
            html('li', { id: 'annotation-def:3' }, [
              text('3'),
              html('sup', [html('a', { href: '#annotation-ref:3', rel: 'noopener' }, '↩')])
            ]),
            html('li', { id: 'annotation-def:4' }, [
              text('4'),
              html('sup', [html('a', { href: '#annotation-ref:5', rel: 'noopener' }, '↩')])
            ]),
          ]).outerHTML);
      }
      annotation(parse(''), target);
      assert.deepStrictEqual(
        target.outerHTML,
        html('ol').outerHTML);
    });

  });

  describe('authority', () => {
    it('1', () => {
      const source = parse('[[a b]]');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        authority(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "authority", id: "authority-ref:1", title: "a b" }, [
                html('a', { href: "#authority-def:1", rel: "noopener" }, '[1]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'authority-def:1' }, [
              text('a b'),
              html('sup', [html('a', { href: '#authority-ref:1', rel: 'noopener' }, '↩')])
            ]),
          ]).outerHTML);
      }
    });

  });

});
