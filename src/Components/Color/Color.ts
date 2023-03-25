// !!! Urutan enum dan const harus cocok !!!
// Kalo mao tambah PLEASE do no mess up order yang lain
// Pakenya ntar import COLOR_HEX_STRING ama Color, trus {COLOR_HEX_STRING[Color.NormalBlack]} ntar nge-return string si NormalBlack.

export enum Color {
  PrimaryBackground,
  PrimaryForeground,

  // Normal
  NormalBlack,
  NormalRed,
  NormalGreen,
  NormalYellow,
  NormalBlue,
  NormalMagenta,
  NormalCyan,
  NormalWhite,

  // Bright
  BrightBlack,
  BrightRed,
  BrightGreen,
  BrightYellow,
  BrightBlue,
  BrightMagenta,
  BrightCyan,
  BrightWhite,
}

export const COLOR_HEX_STRING: { [key in Color]: string } = {
  [Color.PrimaryBackground]: "#f1f1f1",
  [Color.PrimaryForeground]: "#424242",

  // Normal
  [Color.NormalBlack]: "#212121",
  [Color.NormalRed]: "#c30771",
  [Color.NormalGreen]: "#10a778",
  [Color.NormalYellow]: "#a89c14",
  [Color.NormalBlue]: "#008ec4",
  [Color.NormalMagenta]: "#523c79",
  [Color.NormalCyan]: "#20a5ba",
  [Color.NormalWhite]: "#e0e0e0",

  // Bright
  [Color.BrightBlack]: "#212121",
  [Color.BrightRed]: "#fb007a",
  [Color.BrightGreen]: "#5fd7af",
  [Color.BrightYellow]: "#f3e430",
  [Color.BrightBlue]: "#20bbfc",
  [Color.BrightMagenta]: "#6855de",
  [Color.BrightCyan]: "#4fb8cc",
  [Color.BrightWhite]: "#f1f1f1",
};
