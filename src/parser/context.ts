export const enum Syntax {
  reference = 1 << 8,
  index = 1 << 7,
  placeholder = 1 << 6,
  ruby = 1 << 5,
  link = 1 << 4,
  bracket = 1 << 3,
  media = 1 << 2,
  autolink = 1 << 1,
  none = 0,
}

export const enum State {
  annotation = 1 << 7,
  reference = 1 << 6,
  index = 1 << 5,
  label = 1 << 4,
  link = 1 << 3,
  media = 1 << 2,
  autolink = 1 << 1,
  shortcut = 1 << 0,
  none = 0,
  all = ~0,
  linkers = 0
    | State.annotation
    | State.reference
    | State.index
    | State.label
    | State.link
    | State.autolink,
  backtrackers = 0
    | State.annotation
    | State.reference
    | State.index
    | State.link
    | State.media,
}
