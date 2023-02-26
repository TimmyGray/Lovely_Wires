import { IImage } from "./IImage.interface";

export interface IBuy {
  _id: string;
  name: string;
  description: string;
  cost: number;
  item: string;
  count: number;
  image: IImage;
}
