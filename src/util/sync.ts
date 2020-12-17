import { Math, window, document } from 'spica/global';
import { Cancellation } from 'spica/cancellation';
import { bind } from 'typed-dom';

export function sync(
  editor: HTMLElement,
  viewer: HTMLElement,
  bottom: HTMLElement | null = viewer.firstElementChild as HTMLElement,
): () => void {
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
        const viewer_scrollHeight = bottom?.offsetTop
          ? bottom.offsetTop - +window.getComputedStyle(bottom).marginTop.slice(0, -2)
          : viewer.scrollHeight;
        return void viewer.scrollBy({
          top: Math.sign(delta) * Math.ceil(
            + Math.abs(delta)
            * (viewer_scrollHeight - viewer.clientHeight)
            / (editor.scrollHeight - editor.clientHeight)),
        });
    }
  }, { passive: true }));
  return cancellation.cancel;
}
