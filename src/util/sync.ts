import { Math, window, document } from 'spica/global';
import { Cancellation } from 'spica/cancellation';
import { bind } from 'typed-dom';

export function sync(
  editor: HTMLElement,
  viewer: HTMLElement,
  bottom: Element | null = viewer.firstElementChild,
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
        const last = bottom?.previousElementSibling as HTMLElement | null;
        const viewer_scrollHeight = last
          ? last.offsetTop + last.offsetHeight + +window.getComputedStyle(last).marginBottom.slice(0, -2)
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
