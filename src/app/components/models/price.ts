import { IItem } from './IItem.interface';

export class Price {

  constructor(
    public _id: string,
    public name: string,
    public cost: number,
    public itemofprice: IItem) { }

}
