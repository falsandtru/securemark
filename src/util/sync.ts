import { Math, window, document } from 'spica/global';
import { Cancellation } from 'spica/cancellation';
import { bind } from 'typed-dom';

export function sync(editor: HTMLElement, viewer: HTMLElement, footnotes: readonly HTMLOListElement[]): () => void {
  const cancellation = new Cancellation();
  let hover = document.activeElement?.contains(editor) ?? true;
  cancellation.register(bind(editor, 'mouseenter', () => {
    hover = true;
  }));
  cancellation.register(bind(editor, 'mouseleave', () => {
    hover = false;
  }));
  let scroll = editor.scrollTop;
  cancellation.register(bind(editor, 'scroll', () => {
    if (!hover) return;
    const delta = editor.scrollTop - scroll;
    switch (scroll += delta) {
      case 0:
        return void viewer.scrollTo({ top: 0 });
      default:
        return void viewer.scrollBy({
          top: Math.round(
            + delta
            * footnotes.reduce((scrollHeight, el) => {
                const { marginTop, marginBottom, display } = window.getComputedStyle(el);
                return display === 'none'
                  ? scrollHeight
                  : scrollHeight - el.offsetHeight - +marginTop.slice(0, -2) - +marginBottom.slice(0, -2);
              }, viewer.scrollHeight - viewer.offsetHeight)
            / (editor.scrollHeight - editor.offsetHeight)),
        });
    }
  }, { passive: true }));
  return cancellation.cancel;
}
