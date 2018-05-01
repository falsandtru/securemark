import { footnote } from './footnote';
import { parse } from '../parser';
import { html, text } from 'typed-dom';

describe('Unit: util/footnote', () => {
  describe('footnote', () => {
    it('empty', () => {
      const source = parse('0');
      const target = html('ol');
      assert.deepStrictEqual(
        [...source.children].map(el => el.outerHTML),
        [html('p', '0').outerHTML]);
      footnote(source, target);
      assert.deepStrictEqual(
        target.outerHTML,
        html('ol').outerHTML);
    });

    it('1', () => {
      const source = parse('((a \n b))');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        footnote(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", title: "a   b", id: "annotation:1:a___b" }, [
                html('a', { href: "#footnote:1:a___b", rel: "noopener" }, '[1]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'footnote:1:a___b' }, [
              text('a '),
              html('span', { class: 'newline' }, ' '),
              text(' b'),
              html('sup', [html('a', { href: '#annotation:1:a___b', rel: 'noopener' }, '[1]')])
            ]),
          ]).outerHTML);
      }
    });

    it('2', () => {
      const source = parse('((1))((12345678901234567890))');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        footnote(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", title: "1", id: "annotation:1:1" }, [
                html('a', { href: "#footnote:1:1", rel: "noopener" }, '[1]')
              ]),
              html('sup', { class: "annotation", title: "12345678901234567890", id: "annotation:2:123456789012345..." }, [
                html('a', { href: "#footnote:2:123456789012345...", rel: "noopener" }, '[2]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'footnote:1:1' }, [
              text('1'),
              html('sup', [html('a', { href: '#annotation:1:1', rel: 'noopener' }, '[1]')])
            ]),
            html('li', { id: 'footnote:2:123456789012345...' }, [
              text('12345678901234567890'),
              html('sup', [html('a', { href: '#annotation:2:123456789012345...', rel: 'noopener' }, '[2]')])
            ]),
          ]).outerHTML);
      }
    });

    it('unify', () => {
      const source = parse('((1))((2))((3))((2))((4))');
      const target = html('ol');
      for (let i = 0; i < 3; ++i) {
        footnote(source, target);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", title: "1", id: "annotation:1:1" }, [
                html('a', { href: "#footnote:1:1", rel: "noopener" }, '[1]')
              ]),
              html('sup', { class: "annotation", title: "2", id: "annotation:2:2" }, [
                html('a', { href: "#footnote:2:2", rel: "noopener" }, '[2]')
              ]),
              html('sup', { class: "annotation", title: "3", id: "annotation:3:3" }, [
                html('a', { href: "#footnote:3:3", rel: "noopener" }, '[3]')
              ]),
              html('sup', { class: "annotation", title: "2", id: "annotation:4:2" }, [
                html('a', { href: "#footnote:2:2", rel: "noopener" }, '[2]')
              ]),
              html('sup', { class: "annotation", title: "4", id: "annotation:5:4" }, [
                html('a', { href: "#footnote:4:4", rel: "noopener" }, '[4]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          target.outerHTML,
          html('ol', [
            html('li', { id: 'footnote:1:1' }, [
              text('1'),
              html('sup', [html('a', { href: '#annotation:1:1', rel: 'noopener' }, '[1]')])
            ]),
            html('li', { id: 'footnote:2:2' }, [
              text('2'),
              html('sup', [
                html('a', { href: '#annotation:2:2', rel: 'noopener' }, '[2]'),
                html('a', { href: '#annotation:4:2', rel: 'noopener' }, '[4]'),
              ]),
            ]),
            html('li', { id: 'footnote:3:3' }, [
              text('3'),
              html('sup', [html('a', { href: '#annotation:3:3', rel: 'noopener' }, '[3]')])
            ]),
            html('li', { id: 'footnote:4:4' }, [
              text('4'),
              html('sup', [html('a', { href: '#annotation:5:4', rel: 'noopener' }, '[5]')])
            ]),
          ]).outerHTML);
      }
    });

  });

});
