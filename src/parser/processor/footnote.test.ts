import { footnote, annotation, reference } from './footnote';
import { parse as parse_ } from '../../parser';
import { html } from 'typed-dom/dom';

const parse = (s: string) => parse_(s, { test: true });

describe('Unit: parser/processor/footnote', () => {
  describe('annotation', () => {
    it('empty', () => {
      const target = parse('');
      const footnote = html('ol');
      [...annotation(target, footnote)];
      assert.deepStrictEqual(
        [...target.children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        footnote.outerHTML,
        html('ol').outerHTML);
    });

    it('1', () => {
      const target = parse('((a b))');
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        assert.deepStrictEqual([...annotation(target, footnote)].length, i === 0 ? 2 : 1);
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation::ref:1", title: "a b" }, [
                html('span', { hidden: '' }, 'a b'),
                html('a', { href: "#annotation::def:a_b" }, '*1')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          html('ol', [
            html('li', { id: 'annotation::def:a_b' }, [
              html('span', 'a b'),
              html('sup', [html('a', { href: '#annotation::ref:1' }, '^1')])
            ]),
          ]).outerHTML);
      }
    });

    it('2', () => {
      const target = parse('((1))((12345678901234567890))');
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        assert.deepStrictEqual([...annotation(target, footnote)].length, i === 0 ? 4 : 2);
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation::ref:1", title: "1" }, [
                html('span', { hidden: '' }, '1'),
                html('a', { href: "#annotation::def:1" }, '*1')
              ]),
              html('sup', { class: "annotation", id: "annotation::ref:2", title: "12345678901234567890" }, [
                html('span', { hidden: '' }, '12345678901234567890'),
                html('a', { href: "#annotation::def:12345678901234567890" }, '*2')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          html('ol', [
            html('li', { id: 'annotation::def:1' }, [
              html('span', '1'),
              html('sup', [html('a', { href: '#annotation::ref:1' }, '^1')])
            ]),
            html('li', { id: 'annotation::def:12345678901234567890' }, [
              html('span', '12345678901234567890'),
              html('sup', [html('a', { href: '#annotation::ref:2' }, '^2')])
            ]),
          ]).outerHTML);
      }
    });

    it('unify', () => {
      const target = parse('((1))((2))((3))((2))((4))');
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...annotation(target, footnote)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation::ref:1", title: "1" }, [
                html('span', { hidden: '' }, '1'),
                html('a', { href: "#annotation::def:1" }, '*1')
              ]),
              html('sup', { class: "annotation", id: "annotation::ref:2", title: "2" }, [
                html('span', { hidden: '' }, '2'),
                html('a', { href: "#annotation::def:2" }, '*2')
              ]),
              html('sup', { class: "annotation", id: "annotation::ref:3", title: "3" }, [
                html('span', { hidden: '' }, '3'),
                html('a', { href: "#annotation::def:3" }, '*3')
              ]),
              html('sup', { class: "annotation", id: "annotation::ref:4", title: "2" }, [
                html('span', { hidden: '' }, '2'),
                html('a', { href: "#annotation::def:2" }, '*2')
              ]),
              html('sup', { class: "annotation", id: "annotation::ref:5", title: "4" }, [
                html('span', { hidden: '' }, '4'),
                html('a', { href: "#annotation::def:4" }, '*4')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          html('ol', [
            html('li', { id: 'annotation::def:1' }, [
              html('span', '1'),
              html('sup', [html('a', { href: '#annotation::ref:1' }, '^1')])
            ]),
            html('li', { id: 'annotation::def:2' }, [
              html('span', '2'),
              html('sup', [
                html('a', { href: '#annotation::ref:2' }, '^2'),
                html('a', { href: '#annotation::ref:4' }, '^4'),
              ]),
            ]),
            html('li', { id: 'annotation::def:3' }, [
              html('span', '3'),
              html('sup', [html('a', { href: '#annotation::ref:3' }, '^3')])
            ]),
            html('li', { id: 'annotation::def:4' }, [
              html('span', '4'),
              html('sup', [html('a', { href: '#annotation::ref:5' }, '^5')])
            ]),
          ]).outerHTML);
      }
      [...annotation(parse(''), footnote)];
      assert.deepStrictEqual(
        footnote.outerHTML,
        html('ol').outerHTML);
    });

    it('separation', () => {
      const target = html('blockquote', parse([
        '!>> ((1))\n> ((2))\n~~~',
        '~~~~example/markdown\n((3))\n~~~~',
        '((4))',
      ].join('\n\n')).children);
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...annotation(target, footnote)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><section><p><sup class="annotation disabled" title="1"><span hidden="">1</span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>1</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote><section><p><sup class="annotation disabled" title="2"><span hidden="">2</span><a>*1</a></sup><br>~~~</p><ol class="annotations"><li data-marker="*1"><span>2</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote>',
            '<aside class="example" data-type="markdown"><pre translate="no">((3))</pre><hr><section><p><sup class="annotation disabled" title="3"><span hidden="">3</span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>3</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></aside>',
            '<p><sup class="annotation" id="annotation::ref:1" title="4"><span hidden="">4</span><a href="#annotation::def:4">*1</a></sup></p>',
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          '<ol><li id="annotation::def:4"><span>4</span><sup><a href="#annotation::ref:1">^1</a></sup></li></ol>');
      }
    });

    it('split', () => {
      const target = parse('((1))\n\n## a\n\n## b\n\n((2))((3))\n\n## c\n\n((4))');
      for (let i = 0; i < 3; ++i) {
        [...footnote(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation::ref:1", title: "1" }, [
                html('span', { hidden: '' }, '1'),
                html('a', { href: "#annotation::def:1" }, '*1')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:1', 'data-marker': '*1' }, [
                html('span', '1'),
                html('sup', [html('a', { href: '#annotation::ref:1' }, '^1')])
              ]),
            ]).outerHTML,
            html('h2', { id: 'index::a' }, 'a').outerHTML,
            html('h2', { id: 'index::b' }, 'b').outerHTML,
            html('p', [
              html('sup', { class: "annotation", id: "annotation::ref:2", title: "2" }, [
                html('span', { hidden: '' }, '2'),
                html('a', { href: "#annotation::def:2" }, '*2')
              ]),
              html('sup', { class: "annotation", id: "annotation::ref:3", title: "3" }, [
                html('span', { hidden: '' }, '3'),
                html('a', { href: "#annotation::def:3" }, '*3')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:2', 'data-marker': '*2' }, [
                html('span', '2'),
                html('sup', [html('a', { href: '#annotation::ref:2' }, '^2')])
              ]),
              html('li', { id: 'annotation::def:3', 'data-marker': '*3' }, [
                html('span', '3'),
                html('sup', [html('a', { href: '#annotation::ref:3' }, '^3')])
              ]),
            ]).outerHTML,
            html('h2', { id: 'index::c' }, 'c').outerHTML,
            html('p', [
              html('sup', { class: "annotation", id: "annotation::ref:4", title: "4" }, [
                html('span', { hidden: '' }, '4'),
                html('a', { href: "#annotation::def:4" }, '*4')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:4', 'data-marker': '*4' }, [
                html('span', '4'),
                html('sup', [html('a', { href: '#annotation::ref:4' }, '^4')])
              ]),
            ]).outerHTML,
          ]);
      }
    });

    it('id', () => {
      const target = parse('((a b))');
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        assert.deepStrictEqual([...annotation(target, footnote, { id: '0' })].length, i === 0 ? 2 : 1);
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "annotation", id: "annotation:0:ref:1", title: "a b" }, [
                html('span', { hidden: '' }, 'a b'),
                html('a', { href: "#annotation:0:def:a_b" }, '*1')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          html('ol', [
            html('li', { id: 'annotation:0:def:a_b' }, [
              html('span', 'a b'),
              html('sup', [html('a', { href: '#annotation:0:ref:1' }, '^1')])
            ]),
          ]).outerHTML);
      }
    });

  });

  describe('reference', () => {
    it('1', () => {
      const target = parse('[[a b]]');
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...reference(target, footnote)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "reference", id: "reference::ref:1", title: "a b" }, [
                html('span', { hidden: '' }, 'a b'),
                html('a', { href: "#reference::def:a_b" }, '[1]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          html('ol', [
            html('li', { id: 'reference::def:a_b' }, [
              html('span', 'a b'),
              html('sup', [html('a', { href: '#reference::ref:1' }, '^1')])
            ]),
          ]).outerHTML);
      }
    });

    it('abbr', () => {
      const target = parse('[[^a| b]][[^a]][[^a]]');
      const footnote = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...reference(target, footnote)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: "reference", 'data-abbr': "a", id: "reference::ref:1", title: "b" }, [
                html('span', { hidden: '' }, 'b'),
                html('a', { href: "#reference::def:a" }, '[a]')
              ]),
              html('sup', { class: "reference", 'data-abbr': "a", id: "reference::ref:2", title: "b" }, [
                html('span', { hidden: '' }),
                html('a', { href: "#reference::def:a" }, '[a]')
              ]),
              html('sup', { class: "reference", 'data-abbr': "a", id: "reference::ref:3", title: "b" }, [
                html('span', { hidden: '' }),
                html('a', { href: "#reference::def:a" }, '[a]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          footnote.outerHTML,
          html('ol', [
            html('li', { id: 'reference::def:a' }, [
              html('span', 'b'),
              html('sup', [
                html('a', { href: '#reference::ref:1', title: 'b' }, '^1'),
                html('a', { href: '#reference::ref:2' }, '^2'),
                html('a', { href: '#reference::ref:3' }, '^3'),
              ])
            ]),
          ]).outerHTML);
      }
    });

  });

});
