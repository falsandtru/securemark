import { undefined, Math, window, document } from 'spica/global';
import { fanOut } from 'spica/arrow';
import { replaceReturn } from 'spica/function';
import { bind } from 'typed-dom';

export function sync(
  editor: HTMLElement,
  viewer: HTMLElement,
  bottom: Element | null = viewer.firstElementChild,
): () => void {
  let hover = document.activeElement?.contains(editor) ?? true;
  let scroll = editor.scrollTop;
  return replaceReturn(fanOut(
    bind(editor, 'mouseenter', () => {
      hover = true;
    }),
    bind(editor, 'mouseleave', () => {
      hover = false;
    }),
    bind(editor, 'scroll', () => {
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
    }, { passive: true })),
    () => undefined);
}
