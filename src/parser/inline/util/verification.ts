export function isVisible(el: HTMLElement): boolean {
  return el.textContent!.trim() !== '';
}

export function isTightVisible(el: HTMLElement): boolean {
  return isVisible(el)
      && el.textContent === el.textContent!.trim();
}
