export function japanese(char: string): boolean {
  return /^[\p{Ideo}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}～！？]/u.test(char);
}
