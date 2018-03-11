export function hasContent(el: HTMLElement): boolean {
  return hasText(el)
      || !!el.querySelector('.media');
}

export function hasText(el: HTMLElement): boolean {
  return el.textContent!.trim() !== '';
}

export function hasTightText(el: HTMLElement): boolean {
  return hasText(el)
      && el.textContent === el.textContent!.trim();
}
