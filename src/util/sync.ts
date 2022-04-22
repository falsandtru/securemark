import { undefined, window, document } from 'spica/global';
import { abs, ceil, sign } from 'spica/alias';
import { aggregate } from 'spica/arrow';
import { clear } from 'spica/function';
import { bind, once } from 'typed-dom/listener';

export function sync(
  editor: HTMLElement,
  viewer: HTMLElement,
  bottom: Element | null = viewer.firstElementChild,
): () => void {
  let hover = document.activeElement?.contains(editor) ?? true;
  let scroll = editor.scrollTop;
  return clear(aggregate(
    once(viewer, 'mousemove', () => {
      hover = false;
    }, passive),
    once(viewer, 'mousedown', () => {
      hover = false;
    }, passive),
    once(viewer, 'wheel', () => {
      hover = false;
    }, passive),
    bind(editor, 'input', () => {
      hover = true;
    }, passive),
    bind(editor, 'keydown', () => {
      hover = true;
    }, passive),
    bind(editor, 'mouseenter', () => {
      hover = true;
    }, passive),
    bind(editor, 'mouseleave', () => {
      hover = false;
    }, passive),
    bind(editor, 'scroll', () => {
      if (!hover) return scroll = editor.scrollTop, undefined;
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
            top: sign(delta) * ceil(
              + abs(delta)
              * (viewer_scrollHeight - viewer.clientHeight)
              / (editor.scrollHeight - editor.clientHeight)),
          });
      }
    }, passive)));
}

const passive = { passive: true };
