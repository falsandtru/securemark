// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7BWhite_Space%7D&g=&i=
// https://en.wikipedia.org/wiki/Whitespace_character
// https://en.wikipedia.org/wiki/Newline
export function isWhitespace(char: string, linebreak: boolean = true): boolean {
  switch (char) {
    case '\u0009':
    case '\u000B':
    case '\u000C':
    case '\u0020':
    case '\u0085':
    case '\u00A0':
    case '\u1680':
    case '\u2000':
    case '\u2001':
    case '\u2002':
    case '\u2003':
    case '\u2004':
    case '\u2005':
    case '\u2006':
    case '\u2007':
    case '\u2008':
    case '\u2009':
    case '\u200A':
    case '\u2028':
    case '\u2029':
    case '\u202F':
    case '\u205F':
    case '\u3000':
      return true;
    case '\u000A':
    case '\u000D':
      return linebreak;
    default:
      return false;
  }
}
