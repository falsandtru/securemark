import { window } from 'spica/global';
import { Cancellation } from 'spica/cancellation';
import { bind } from 'typed-dom';

export function sync(editor: HTMLElement, viewer: HTMLElement, footnotes: readonly HTMLOListElement[]): () => void {
  const cancellation = new Cancellation();
  let active = true;
  cancellation.register(bind(editor, 'focus', ev => {
    active = ev.defaultPrevented;
    setTimeout(() => active = true, 30);
  }));
  cancellation.register(bind(editor, 'scroll', () => {
    if (!active) return;
    return void viewer.scrollTo({
      top:
        + editor.scrollTop
        * footnotes.reduce((height, el) => {
            const { marginTop, marginBottom } = window.getComputedStyle(el);
            return height
              - el.clientHeight
              - +marginTop.slice(0, -2)
              - +marginBottom.slice(0, -2);
          }, viewer.scrollHeight)
        / editor.scrollHeight,
    });
  }, { passive: true }));
  return cancellation.cancel;
}
