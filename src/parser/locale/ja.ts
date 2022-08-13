export function japanese(char: string): boolean {
  return /^[\p{Ideo}\p{scx=Hiragana}\p{scx=Katakana}～！？]/u.test(char);
}
