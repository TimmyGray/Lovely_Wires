import { IImage } from "./IImage.interface";

export interface IBuy {
  _id: string;
  name: string;
  description: string;
  cost: number;
  item: string;
  itemid: string;
  count: number;
  image: IImage;
}
