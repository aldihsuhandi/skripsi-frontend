// !!! Urutan enum dan const harus cocok !!!

export enum Color {
  White,
  WhiteGrey,
  Blue,
  Red,
  Black,
  Lightgrey,
  Purple,
}

export const COLOR_HEX_STRING: { [key in Color]: string } = {
  [Color.White]: "#FFFFFF",
  [Color.WhiteGrey]: "#F2F3F5",
  [Color.Blue]: "#0000FF",
  [Color.Red]: "#ff0000",
  [Color.Black]: "#000000",
  [Color.Lightgrey]: "#D3D3D3",
  [Color.Purple]: "#4A2F83",
};
