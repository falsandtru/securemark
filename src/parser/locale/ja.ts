export function japanese(char: string): boolean {
  switch (char) {
    case '、':
    case '。':
    case '！':
    case '？':
      return true;
    default:
      return false;
  }
}
