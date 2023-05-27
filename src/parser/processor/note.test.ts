import { note, annotation, reference } from './note';
import { parse as parse_ } from '../../parser';
import { html } from 'typed-dom/dom';

const parse = (s: string) => parse_(s, { test: true });

describe('Unit: parser/processor/note', () => {
  describe('annotation', () => {
    it('empty', () => {
      const target = parse('');
      const note = html('ol');
      [...annotation(target, note)];
      assert.deepStrictEqual(
        [...target.children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        note.outerHTML,
        html('ol').outerHTML);
    });

    it('1', () => {
      const target = parse('((a b))');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        assert.deepStrictEqual([...annotation(target, note)].length, i === 0 ? 2 : 1);
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:a_b:1', title: 'a b' }, [
                html('span'),
                html('a', { href: '#annotation::def:a_b:1' }, '*1')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'annotation::def:a_b:1' }, [
              html('span', 'a b'),
              html('sup', [html('a', { href: '#annotation::ref:a_b:1' }, '^1')]),
            ]),
          ]).outerHTML);
      }
    });

    it('2', () => {
      const target = parse('((1))((12345678901234567890))');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        assert.deepStrictEqual([...annotation(target, note)].length, i === 0 ? 4 : 2);
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:1:1', title: '1' }, [
                html('span'),
                html('a', { href: '#annotation::def:1:1' }, '*1')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:12345678901234567890:1', title: '12345678901234567890' }, [
                html('span'),
                html('a', { href: '#annotation::def:12345678901234567890:1' }, '*2')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'annotation::def:1:1' }, [
              html('span', '1'),
              html('sup', [html('a', { href: '#annotation::ref:1:1' }, '^1')]),
            ]),
            html('li', { id: 'annotation::def:12345678901234567890:1' }, [
              html('span', '12345678901234567890'),
              html('sup', [html('a', { href: '#annotation::ref:12345678901234567890:1' }, '^2')]),
            ]),
          ]).outerHTML);
      }
    });

    it('unify', () => {
      const target = parse('((1))((2))((3))((2))((4))');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...annotation(target, note)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:1:1', title: '1' }, [
                html('span'),
                html('a', { href: '#annotation::def:1:1' }, '*1')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:2:1', title: '2' }, [
                html('span'),
                html('a', { href: '#annotation::def:2:1' }, '*2')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:3:1', title: '3' }, [
                html('span'),
                html('a', { href: '#annotation::def:3:1' }, '*3')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:2:2', title: '2' }, [
                html('span'),
                html('a', { href: '#annotation::def:2:1' }, '*2')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:4:1', title: '4' }, [
                html('span'),
                html('a', { href: '#annotation::def:4:1' }, '*4')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'annotation::def:1:1' }, [
              html('span', '1'),
              html('sup', [html('a', { href: '#annotation::ref:1:1' }, '^1')]),
            ]),
            html('li', { id: 'annotation::def:2:1' }, [
              html('span', '2'),
              html('sup', [
                html('a', { href: '#annotation::ref:2:1' }, '^2'),
                html('a', { href: '#annotation::ref:2:2' }, '^4'),
              ]),
            ]),
            html('li', { id: 'annotation::def:3:1' }, [
              html('span', '3'),
              html('sup', [html('a', { href: '#annotation::ref:3:1' }, '^3')]),
            ]),
            html('li', { id: 'annotation::def:4:1' }, [
              html('span', '4'),
              html('sup', [html('a', { href: '#annotation::ref:4:1' }, '^5')]),
            ]),
          ]).outerHTML);
      }
      [...annotation(parse(''), note)];
      assert.deepStrictEqual(
        note.outerHTML,
        html('ol').outerHTML);
    });

    it('separation', () => {
      const target = html('blockquote', parse([
        '!>> ((1))\n> ((2))\n~~~',
        '~~~~example/markdown\n((3))\n~~~~',
        '((4))',
      ].join('\n\n')).children);
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...annotation(target, note)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><section><p><sup class="annotation disabled" title="1"><span></span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>1</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote><section><p><sup class="annotation disabled" title="2"><span></span><a>*1</a></sup><br>~~~</p><ol class="annotations"><li data-marker="*1"><span>2</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote>',
            '<aside class="example" data-type="markdown"><pre translate="no">((3))</pre><hr><section><p><sup class="annotation disabled" title="3"><span></span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>3</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></aside>',
            '<p><sup class="annotation" id="annotation::ref:4:1" title="4"><span></span><a href="#annotation::def:4:1">*1</a></sup></p>',
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          '<ol><li id="annotation::def:4:1"><span>4</span><sup><a href="#annotation::ref:4:1">^1</a></sup></li></ol>');
      }
    });

    it('split', () => {
      const target = parse('((1))\n\n## a\n\n((2))((1))((3))((2))\n\n## b\n\n((2))');
      for (let i = 0; i < 3; ++i) {
        [...note(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:1:1', title: '1' }, [
                html('span'),
                html('a', { href: '#annotation::def:1:1' }, '*1')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:1:1', 'data-marker': '*1' }, [
                html('span', '1'),
                html('sup', [html('a', { href: '#annotation::ref:1:1' }, '^1')]),
              ]),
            ]).outerHTML,
            html('h2', { id: 'index::a' }, 'a').outerHTML,
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:2:1', title: '2' }, [
                html('span'),
                html('a', { href: '#annotation::def:2:1' }, '*2')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:1:2', title: '1' }, [
                html('span'),
                html('a', { href: '#annotation::def:1:2' }, '*3')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:3:1', title: '3' }, [
                html('span'),
                html('a', { href: '#annotation::def:3:1' }, '*4')
              ]),
              html('sup', { class: 'annotation', id: 'annotation::ref:2:2', title: '2' }, [
                html('span'),
                html('a', { href: '#annotation::def:2:1' }, '*2')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:2:1', 'data-marker': '*2' }, [
                html('span', '2'),
                html('sup', [
                  html('a', { href: '#annotation::ref:2:1' }, '^2'),
                  html('a', { href: '#annotation::ref:2:2' }, '^5'),
                ]),
              ]),
              html('li', { id: 'annotation::def:1:2', 'data-marker': '*3' }, [
                html('span', '1'),
                html('sup', [html('a', { href: '#annotation::ref:1:2' }, '^3')]),
              ]),
              html('li', { id: 'annotation::def:3:1', 'data-marker': '*4' }, [
                html('span', '3'),
                html('sup', [html('a', { href: '#annotation::ref:3:1' }, '^4')]),
              ]),
            ]).outerHTML,
            html('h2', { id: 'index::b' }, 'b').outerHTML,
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:2:3', title: '2' }, [
                html('span'),
                html('a', { href: '#annotation::def:2:2' }, '*5')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:2:2', 'data-marker': '*5' }, [
                html('span', '2'),
                html('sup', [html('a', { href: '#annotation::ref:2:3' }, '^6')]),
              ]),
            ]).outerHTML,
          ]);
      }
    });

    it('id', () => {
      const target = parse('((a b))');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        assert.deepStrictEqual([...annotation(target, note, { id: '0' })].length, i === 0 ? 2 : 1);
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation:0:ref:a_b:1', title: 'a b' }, [
                html('span'),
                html('a', { href: '#annotation:0:def:a_b:1' }, '*1')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'annotation:0:def:a_b:1' }, [
              html('span', 'a b'),
              html('sup', [html('a', { href: '#annotation:0:ref:a_b:1' }, '^1')]),
            ]),
          ]).outerHTML);
      }
    });

  });

  describe('reference', () => {
    it('1', () => {
      const target = parse('[[a b]]');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...reference(target, note)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'reference', id: 'reference::ref:a_b:1', title: 'a b' }, [
                html('span'),
                html('a', { href: '#reference::def:a_b' }, '[1]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'reference::def:a_b' }, [
              html('span', 'a b'),
              html('sup', [html('a', { href: '#reference::ref:a_b:1' }, '^1')]),
            ]),
          ]).outerHTML);
      }
    });

    it('abbr', () => {
      const target = parse('[[^A 1|b]][[^A 1]][[^A 1]]');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...reference(target, note)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'reference', 'data-abbr': 'A 1', id: 'reference::ref:A_1:1', title: 'b' }, [
                html('span'),
                html('a', { href: '#reference::def:A_1' }, '[A 1]')
              ]),
              html('sup', { class: 'reference', 'data-abbr': 'A 1', id: 'reference::ref:A_1:2', title: 'b' }, [
                html('span'),
                html('a', { href: '#reference::def:A_1' }, '[A 1]')
              ]),
              html('sup', { class: 'reference', 'data-abbr': 'A 1', id: 'reference::ref:A_1:3', title: 'b' }, [
                html('span'),
                html('a', { href: '#reference::def:A_1' }, '[A 1]')
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'reference::def:A_1' }, [
              html('span', 'b'),
              html('sup', [
                html('a', { href: '#reference::ref:A_1:1', title: 'b' }, '^1'),
                html('a', { href: '#reference::ref:A_1:2' }, '^2'),
                html('a', { href: '#reference::ref:A_1:3' }, '^3'),
              ])
            ]),
          ]).outerHTML);
      }
    });

    it('nest', () => {
      const target = parse('((a[[^B]]))[[^B|c]]');
      const note = html('ol');
      for (let i = 0; i < 3; ++i) {
        [...annotation(target)];
        [...reference(target, note)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            html('p', [
              html('sup', { class: 'annotation', id: 'annotation::ref:a:1', title: 'a' }, [
                html('span'),
                html('a', { href: '#annotation::def:a:1' }, '*1')
              ]),
              html('sup', { class: 'reference', 'data-abbr': 'B', id: 'reference::ref:B:1', title: 'c' }, [
                html('span'),
                html('a', { href: '#reference::def:B' }, '[B]')
              ]),
            ]).outerHTML,
            html('ol', { class: 'annotations' }, [
              html('li', { id: 'annotation::def:a:1', 'data-marker': '*1' }, [
                html('span', [
                  'a',
                  html('sup', { class: 'reference', 'data-abbr': 'B', id: 'reference::ref:B:2', title: 'c' }, [
                    html('span'),
                    html('a', { href: '#reference::def:B' }, '[B]')
                  ]),
                ]),
                html('sup', [html('a', { href: '#annotation::ref:a:1' }, '^1')])
              ]),
            ]).outerHTML,
          ]);
        assert.deepStrictEqual(
          note.outerHTML,
          html('ol', [
            html('li', { id: 'reference::def:B' }, [
              html('span', 'c'),
              html('sup', [
                html('a', { href: '#reference::ref:B:1', title: 'c' }, '^1'),
                html('a', { href: '#reference::ref:B:2' }, '^2'),
              ]),
            ]),
          ]).outerHTML);
        target.lastChild?.remove();
      }
    });

  });

});
