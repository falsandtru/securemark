import { window } from 'spica/global';
import { bind } from 'typed-dom';

export function sync(editor: HTMLElement, viewer: HTMLElement, footnotes: HTMLOListElement[]): () => void {
  let prev = editor.scrollTop;
  return bind(editor, 'scroll', () => {
    const curr = editor.scrollTop;
    switch (curr) {
      case 0:
        viewer.scrollTo({ top: 0 });
        break;
      default:
        viewer.scrollBy({
          top:
            + footnotes.reduce((acc, el) => {
                const { marginTop, marginBottom } = window.getComputedStyle(el);
                return acc
                  - el.clientHeight
                  - +marginTop.slice(0, -2)
                  - +marginBottom.slice(0, -2);
              }, viewer.scrollHeight)
            * (curr - prev)
            / editor.scrollHeight,
        });
    }
    prev = curr;
  }, { passive: true });
}
